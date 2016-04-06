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
  


 



  //local
  
  $scope.gotoLogin = function(){
    console.log("in goto login");
    $scope.login_msg = 'Get on in Here.';
    $scope.showloginform = true;
  };

  $scope.goRegister = function(){
    console.log('displaying reg form');
    $scope.showreg = true;
  }; 

  $scope.logout = function logout() {
     console.log('logging out'); 
     socket.emit('logout');
     $scope.loggedin = false;
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


});//end controller
