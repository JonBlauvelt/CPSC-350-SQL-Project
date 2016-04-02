Pollarize

INSTALLING THE SYSTEM:
  1) Navigate to the directory you wish to use on your ubuntu vm
  2) Install git by typing the following shell command:
      sudo apt-get install git
  3) Clone the repo by typing the following shell command: 
      git clone https://github.com/JonBlauvelt/CPSC-350-SQL-Project
  4) Install the dependencies:
      sudo apt-get install postgresql
      sudo easy_install Flask
      sudo easy_install flask-socketio
      sudo easy_install eventlet
  5) Start the database: sudo service postgresql start
  6) Login to postgresql:
      psql -h localhost -U postgres -p
  7) Set up the database by entering the following postgres command:
      \i pollus.sql 
  8) Change the password for the postgresql user 'pollus' that was created:
      ALTER USER pollus WITH PASSWORD '<make up a pw>';
  9) Make a file to store your data base info in the main project directory
     and call it 'dbconstants.py'.  It should contain the following lines:
      DATABASE = 'pollus'
      PW = '<the password you just set'
      USER = 'pollster'
      HOST = 'localhost'
  10) Change into the project directory with the shell command:
      cd ./CPSC-350-SQL-Project
  11) Run the server with the following shell commands: 
     screen
     sudo python server.py
