import os
from dbconstants import DATABASE, USER, PW, HOST
from flask import Flask, render_template, request, redirect, url_for, session
from flask.ext.socketio import SocketIO, emit, disconnect #import socketio things
from flask_socketio import join_room, leave_room, disconnect #import socketio room things
from flask.ext.login import LoginManager

import psycopg2
import psycopg2.extras


app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'secret!'
app.secret_key = os.urandom(24).encode('hex')
login_manager = LoginManager()
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

@socketio.on('connect', namespace='/poll')
def makeConnection():
    print('connected')

@socketio.on('login', namespace='/poll')
def attemptLogin(uname,pw):
    #debug
    print('received login attempt with creds: ' + uname + ', ' + pw) 

    #connect to db
    conn = connectToDB()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    #construct query
    query = 'SELECT * FROM users WHERE username = %s AND '+\
            'password = crypt(%s,password);'

    #execute it
    try:
        cur.execute(query,(uname,pw))
        session['userData'] = cur.fetchall()
        if(session['userData']):
            #debug
            print('credentials verified in db')
        else:
            print('credential verification failed')
    except:
        #debug
        print('login exception')



#when someone first lands
@app.route('/')
def mainIndex():
    print 'in main index'
    return app.send_static_file('index.html')

# start the server - change to socketio
if __name__ == '__main__':
    socketio.run(app, host=os.getenv('IP', '0.0.0.0'), port =int(os.getenv('PORT', 80)), debug=True)
