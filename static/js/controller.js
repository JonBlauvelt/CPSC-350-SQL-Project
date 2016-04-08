//Create angular js application with no dependencies
var pollarizeApp = angular.module('pollarizeApp', []);

//Create controller
pollarizeApp.controller('appController', function($scope){

  //make connection back to flask app
  var socket = io.connect(document.domain + ':' + location.port + '/poll');    

  //vars

  //show/hide
  $scope.loggedin = false;
  $scope.showloginform = false;
  $scope.showreg=false;
  $scope.show_main_header = true;
  $scope.show_main_banner = true;
  $scope.displayname = '';
  $scope.username = '';
  $scope.password = '';
  $scope.show_trending_page = false;

  //messages
  $scope.login_msg = 'Get on in Here.';
  $scope.reg_msg = "Let's Get Started.";

  //reg form
  $scope.newpass = '';
  $scope.newuser = '';
  $scope.zip = '';
  $scope.dob = '';
  $scope.selected_state = '';
  $scope.selected_party = '';
  $scope.selected_ed_lev = '';
  $scope.selected_income = '';
  $scope.states = [];
  $scope.parties = [];
  $scope.ed_levs = [];
  $scope.incomes = [];
  $scope.profile = [];
  $scope.elections = [];

  //local

  $scope.get_states = function(){
    console.log("requesting states from server");
    $scope.states = [];
    socket.emit("get_states");
  }

  $scope.get_ed_levs = function(){
    console.log("requesting education levels from server");
    $scope.ed_levs = [];
    socket.emit("get_ed_levs");
  }

  $scope.get_parties = function(){
    console.log("requesting parties from server");
    $scope.parties = [];
    socket.emit("get_parties");
  }
  
  $scope.get_incomes = function(){
    console.log("requesting incomes from server");
    $scope.incomes = [];
    socket.emit("get_incomes");
  }

  $scope.exit = function(){
    console.log("in exit");
    $scope.showloginform = false;
    $scope.showreg = false;  
  }

  $scope.gotoLogin = function(){
    console.log("in goto login");
    $scope.login_msg = 'Get on in Here.';
    $scope.showloginform = true;
  };

  $scope.goRegister = function(){
    console.log('displaying reg form');
    $scope.get_states();
    $scope.get_parties();
    $scope.get_ed_levs();
    $scope.get_incomes();
    $scope.showreg = true;
  }; 

  $scope.register = function(){
    console.log('attempting to register user');
    $scope.profile = [$scope.newuser,$scope.newpass, 
        $scope.zip, $scope.dob,$scope.city,
        $scope.selected_state[0], $scope.selected_ed_lev[0],
        $scope.selected_income[0], $scope.selected_party[0],
        $scope.selected_party[0]];
    console.log($scope.profile);
    socket.emit('register', $scope.profile);
  };

  $scope.goUsrDash = function(){
    console.log('navigating to user dashboard');
    $scope.show_main_banner = false;
    $scope.show_trending_page = true;
    socket.emit('get_elections');
  };

  $scope.reset_register = function(){
    console.log('resetting reg form');
    $scope.newuser='';
    $scope.newpass='';
    $scope.zip='';
    $scope.dob='';
    $scope.city='';
  };

  $scope.vote = function(choice,election){
    console.log('choice: ' + choice + ' election: ' + election);

  };

  //socket 

  socket.on('successful_login', function(uname){
    console.log('logged in as '  + $scope.displayname);
    $scope.displayname = uname;
    $scope.loggedin = true;
    $scope.showloginform = false;
    $scope.goUsrDash();
    console.log('showloginform = ' + $scope.showloginform);
    console.log('show_main_banner = ' + $scope.show_main_banner);
    console.log('show_main_header = ' + $scope.show_main_header);
    $scope.$apply();
  }); 

  socket.on('failed_login', function(){
    console.log('failed login');
    $scope.login_msg = "That's not quite right.";
    $scope.$apply();
  });

  socket.on('states', function(state){
    console.log('got the state: ' + state); 
    $scope.states.push(state);
    $scope.$apply();
  });

  socket.on('parties', function(party){
    console.log('got the party: ' + party); 
    $scope.parties.push(party);
    $scope.$apply();
  });

  socket.on('ed_levs', function(ed_lev){
    console.log('got the ed_lev: ' + ed_lev); 
    $scope.ed_levs.push(ed_lev);
    $scope.$apply();
  });
  
  socket.on('incomes', function(income){
    console.log('got the income: ' + income); 
    $scope.incomes.push(income);
    $scope.$apply();
  });

  socket.on('registration_complete', function(failed){
    console.log('registration failed? ' + failed);
    if(failed){
      $scope.reg_msg = 'Whoops, Something Went Wrong.';
      $scope.$apply();
      $scope.goRegister();
    }else{
      $scope.showreg = false;
      $scope.login_msg = "Registration Successful. \nC'mon in Neighbor!";
      $scope.showloginform = true;
      $scope.$apply();
    }
  });

  socket.on('failed_elec_retrieve', function(){
    console.log('failed to load elections');
    socket.emit('get_elections');
  });

  socket.on('election', function(election){
    console.log('received election: ' + election);
    $scope.elections.push(election);
    $scope.$apply();
  });

});//end controller
