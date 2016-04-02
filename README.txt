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
  5) Change into the project directory with the shell command:
      cd ./CPSC-350-SQL-Project
  6) Run the server: sudo python server.py
