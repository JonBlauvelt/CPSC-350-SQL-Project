import os
from dbconstants import DATABASE, USER, PW, HOST
from flask import Flask, render_template, request, redirect, url_for, session
from flask.ext.socketio import SocketIO, emit #import socketio things
from flask_socketio import join_room, leave_room, disconnect #import socketio room things
import flask_login
import threading
import psycopg2
import psycopg2.extras


app = Flask(__name__, static_url_path='')
app.secret_key ='b9108e611bbcbfa1429a0fdc514f8210e9b3b483bfcd7fbb' 

#create socketio app - pass in the flask app created above
socketio = SocketIO(app)

###Local Functions###

#connect to db function
def connectToDB():

    # make connection string
    connectionString = 'dbname=' + DATABASE + ' user=' + USER +\
            ' password=' + PW + ' host=' + HOST

    #debug msg
    print connectionString

    #try to get the cursor object
    try:
        return psycopg2.connect(connectionString)
    except:
        #debug msg
        print("Can't connect to database")


#helper function to handle verification
def verify_user(uname,pw):
    #debug
    print('verify user with creds: ') 

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    #construct query
    query = 'SELECT username,user_id FROM users WHERE '+\
            'username = %s AND password = crypt(%s,password);'

    #execute it
    try:
        cur.execute(query,(uname,pw))
        userData = cur.fetchone()
        if(userData):

            #debug
            print('credentials verified in db')

            return userData

    except:
        #debug
        print('login exception')

#populate drop downs
def populate_dropdown(menu_name):

    print 'in get ' + menu_name

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    #construct query
    if menu_name == "states":
        query = 'SELECT state_abbrev FROM states;'
    elif menu_name == "parties":
        query = "SELECT  CONCAT(party_name,' (', year_founded, ')') "+\
                "FROM parties;"
    elif menu_name == "ed_levs":
        query = 'SELECT  ed_lev from ed_levs;'
    elif menu_name == "incomes":
        query = 'SELECT income from incomes;'

    #execute it
    try:
        cur.execute(query)
        menu_items = cur.fetchall()

        if(menu_items):

            #debug
            print('retrieved ' + menu_name)

            for menu_item in menu_items:

                emit(menu_name, menu_item)

    except:
        #debug
        print('exception retrieving ' + menu_name)


###Socketio###

#socketio connection made
@socketio.on('connect', namespace='/poll')
def makeConnection():

    print('connected')

    if('logged_in' in session):
        print 'validating login'
        emit('successful_login', session['name'])
   #else:
   #   populate_dropdown("states")
   #   populate_dropdown("incomes")
   #   populate_dropdown("ed_levs")
   #   populate_dropdown("parties")


#socketio client disconnected
@socketio.on('disconnect', namespace='/poll')
def test_disconnect():
    print('Client disconnected')

#socketio get states
@socketio.on('get_states', namespace='/poll')
def get_states():
    
    print 'in getStates'

    populate_dropdown('states')

  
#socketio get parties
@socketio.on('get_parties', namespace='/poll')
def get_parties():
    
    print 'in get parties'

    populate_dropdown('parties')

#socketio get ed_levs
@socketio.on('get_ed_levs', namespace='/poll')
def get_ed_levs():
    
    print 'in get ed_levs'

    populate_dropdown('ed_levs')

#socketio get incomes
@socketio.on('get_incomes', namespace='/poll')
def get_incomes():
    
    print 'in get incomes'

    populate_dropdown('incomes')

#socketio register new user
@socketio.on('register', namespace='/poll')
def register_new_user(user_data):
    
    failed = False

    print 'received registration request'

    party_separater = "' ('"

    query = "INSERT INTO users "+\
    "(username, password, zip, dob, city, state_id, ed_lev_id, "+\
    "income_id, party_id) VALUES (%s,crypt(%s, gen_salt('bf')), "+\
    "%s,%s,%s,(SELECT state_id FROM states WHERE state_abbrev = %s), "+\
    "(SELECT ed_lev_id FROM ed_levs WHERE ed_lev = %s LIMIT 1), "+\
    "(SELECT income_id FROM incomes WHERE income = %s LIMIT 1), "+\
    "(SELECT party_id FROM parties WHERE party_name = SUBSTRING(%s FROM "+\
    "0 FOR POSITION(" + party_separater + " IN  %s)) LIMIT 1));"

    print(query)

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        # insert new user
        query = cur.mogrify(query, tuple(user_data))
        print(query)
        cur.execute(query)

    except:
        #debug
        print 'failed registration'
        
        # keep track
        failed = True
        
        #failed
        conn.rollback()
        
    #commit
    conn.commit() 

    #emit
    emit('registration_complete', failed)

#socket request for trending elections
@socketio.on('get_elections', namespace='/poll')
def get_elections():

    if 'logged_in' in session:

        #debug
        print 'retrieving elections'

        #build query
        query = 'SELECT title, descr, COUNT(*) AS total_votes, '+\
                'SUM(vote) AS '+\
                'ayes,(COUNT(*) - SUM(vote)) AS nays, election_id, '+\
                'SUM(CASE WHEN user_id = %s THEN 1 ELSE 0 END) AS voted, '+\
                "SUM(CASE WHEN user_id = %s AND vote = '1' THEN 1 "+\
                'ELSE 0 END) AS vote FROM elections '+\
                'NATURAL JOIN votes GROUP BY election_id '+\
                'ORDER BY total_votes DESC LIMIT 20;'
        
        #connect
        conn = connectToDB()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        try:
            # execute query
            query = cur.mogrify(query,(session['id'],session['id']))
            print query
            cur.execute(query)
            elections = cur.fetchall();
            if(elections):
                for election in elections: 
                    #get none
                    if(election['vote'] is None):
                        election['vote'] = 2

                    #debug
                    print ('election: ' +str(election))

                    #emit
                    emit('election', election)

        except:
            #debug
            print 'failed to get elections'
            
            #tell the client
            emit('failed_elec_retrieve')
            
    else:
        return redirect(url_for('mainIndex'))
    
### Flask app route###

#logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('mainIndex'))

#login
@app.route('/login',methods=['GET','POST'])
def login():

    #debug
    print('received login attempt with creds: ') 

    #verify
    userData = \
        verify_user(request.form['username'],
                request.form['password'])

    if(userData):
        session['logged_in'] = True
        session['name'] = userData['username']
        session['id'] = userData['user_id']

        #emit success
        print('successful_login')
        
    else:
        print('failed_login')

    return redirect(url_for('mainIndex'))


#when someone first lands
@app.route('/')
def mainIndex():

    return app.send_static_file('index.html')


# start the server - change to socketio
if __name__ == '__main__':
    socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 80)), debug=True)
