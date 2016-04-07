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



###Socketio###

#socketio connection made
@socketio.on('connect', namespace='/poll')
def makeConnection():

    print('connected')

    if('logged_in' in session):
        emit('successful_login', session['name'])

#socketio client disconnected
@socketio.on('disconnect', namespace='/poll')
def test_disconnect():
    print('Client disconnected')

#socketio get states
@socketio.on('get_states', namespace='/poll')
def get_states():
    
    print 'in getStates'

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    #construct query
    query = 'SELECT state_abbrev FROM states;'

    #execute it
    try:
        cur.execute(query)
        states = cur.fetchall()

        if(states):

            #debug
            print('retrieved states')

            for state in states:

                emit('state',state)

    except:
        #debug
        print('exception retrieving states')


#socketio get states
@socketio.on('get_parties', namespace='/poll')
def get_parties():
    
    print 'in get parties'

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    #construct query
    query = 'SELECT parties FROM states;'

    #execute it
    try:
        cur.execute(query)
        states = cur.fetchall()

        if(states):

            #debug
            print('retrieved states')

            for party in parties:

                emit('party',state)

    except:
        #debug
        print('exception retrieving states')




     


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
