//Create angular js application with no dependencies
var pollarizeApp = angular.module('pollarizeApp', []);

//Create controller
pollarizeApp.controller('appController', function($scope){

  //make connection back to flask app
  var socket = io.connect(document.domain + ':' + location.port + '/poll');    

  //vars
  $scope.username = '';
  $scope.displayname = '';
  $scope.loggedin = false;
  $scope.showloginform = false;
  $scope.showreg=false;
  $scope.username = '';
  $scope.password = '';
  $scope.login_msg = 'Get on in Here.';
  $scope.newpass = '';
  $scope.newuser = '';
  $scope.zip = '';
  $scope.dob = '';
  $scope.states = [];
  $scope.selected_state = '';
  $scope.party_affiliation = '';
  $scope.ed_lev = '';
  $scope.ed_levs= '';
  $scope.income = '';


  //local

  $scope.get_states = function(){
    console.log("requesting states from server");
    $scope.states = [];
    socket.emit("get_states");
  }

  $scope.get_ed_levels = function(){
    console.log("requesting education levels from server");
    $scope.ed_levs = [];
    socket.emit("get_ed_levels");
  }

  $scope.get_parties = function(){
    console.log("requesting parties from server");
    $scope.parties = [];
    socket.emit("get_parties");
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
    $scope.showreg = true;
    $scope.get_states();
  }; 

  //socket 

  socket.on('successful_login', function(uname){
    console.log('logged in as '  + $scope.displayname);
    $scope.displayname = uname;
    $scope.loggedin = true;
    $scope.showloginform = false;
    console.log('showloginform = ' + $scope.showloginform);
    $scope.$apply();
  }); 

  socket.on('failed_login', function(){
    console.log('failed login');
    $scope.login_msg = "That's not quite right.";
    $scope.$apply();
  });

  socket.on('states', function(states){
    console.log('got the states: ' + states); 
    $scope.states.push(states);
    $scope.$apply();
  });


});//end controller
