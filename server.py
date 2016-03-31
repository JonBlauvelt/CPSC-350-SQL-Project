import os
from dbconstants import DATABASE, USER, PW, HOST
from flask import Flask, render_template, request, redirect, url_for, session
from flask.ext.socketio import SocketIO, emit, disconnect #import socketio things
from flask_socketio import join_room, leave_room, disconnect #import socketio room things
import flask.ext.login as flask_login

import psycopg2
import psycopg2.extras


app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'
app.secret_key = os.urandom(24).encode('hex')
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

#create socketio app - pass in the flask app created above
socketio = SocketIO(app)

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


###########################################
#flask login things
###########################################

class User(flask_login.UserMixin):
    pass

#helper function to handle verification
def verify_user(uname,pw):
    #debug
    print('verify user with creds: ' + uname + ', ' + pw) 

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    #construct query
    query = 'SELECT username,user_id FROM users WHERE '+\
            'username = %s AND password = crypt(%s,password);'

    #execute it
    try:
        cur.execute(query,(uname,pw))
        userData = cur.fetchall()
        if(userData):

            #debug
            print('credentials verified in db')

            return userData

    except:
        #debug
        print('login exception')

#wrapper for User constructor
def create_user(userData):
    user = User()
    user.id = userData[0]['user_id']
    user.name = userData[0]['username']
    user.is_authinticated = True
    return user

@login_manager.user_loader
def user_loader(uname,pw):

    #debug
    print('load user with creds: ' + uname + ', ' + pw) 

    #verify user
    userData = verify_user(uname,pw)
    
    if(userData):

        #debug
        print("received the verified user")

        #create and return user 
        return create_user(userData)

#I don't think i'll be using this, but here it is
@login_manager.request_loader
def request_loader(request):

    #debug
    print("request load: " + str(request))

    #verify
    username = request.form.get('username')
    pw = request.form.get('password')
    userData = verify_user(username,pw)

    #check for success
    if(userData):
         
        #debug
        print('received verified user (from form)')

        #create and return user
        return create_user(userData)

@socketio.on('connect', namespace='/poll')
def makeConnection():
    print('connected')

@socketio.on('login', namespace='/poll')
def attemptLogin(uname,pw):

    #debug
    print('received login attempt with creds: ' + uname + ', ' + pw) 

    #verify
    userData = verify_user(uname, pw)

    if(userData):

        #create user
        user = create_user(userData)
        
        #login
        flask_login.login_user(user, remember=True)

        #emit success
        emit('successful_login', user.name)
    
    else:
        flask.flash('esd')
        emit('failed_login')


#logout
@socketio.on('logout', namespace='/poll')
def logout():
  flaks_login.logout_user()
  return redirect('/')

#when someone first lands
@app.route('/')
def mainIndex():
    print 'in main index'
    return app.send_static_file('index.html')

# start the server - change to socketio
if __name__ == '__main__':
    socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 80)), debug=True)
