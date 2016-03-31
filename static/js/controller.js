//Create angular js application with no dependencies
var pollarizeApp = angular.module('pollarizeApp', []);

//Create controller
pollarizeApp.controller('appController', function($scope){

  //make connection back to flask app
  var socket = io.connect(document.domain + ':' + location.port + '/poll');    

  //define variables
  $scope.username = '';
  $scope.password = '';
  $scope.displayname = ''; 
  $scope.loggedin = false;
  $scope.showloginform = false;
  $scope.showreg = false;

 
  $scope.gotoLogin = function gotoLogin(){
    console.log("in goto login");
    $scope.showloginform = true;
  };

  $scope.goRegister = function(){
    console.log('displaying reg form');
    $scope.showreg = true;
  }; 


  $scope.processLogin = function processLogin() {
     console.log("trying login");
     socket.emit('login', $scope.username, $scope.password);
     $scope.username = '';
     $scope.password = '';
  };

  $scope.logout = function logout() {
     console.log('logging out'); 
     socket.emit('logout');
     $scope.loggedin = false;
  
  };

  socket.on('successful_login', function(uname){
      console.log('logged in as ' +uname);
      $scope.displayname = uname;
      $scope.loggedin = true;
      $scope.showloginform = false;
      console.log('showloginform = ' + $scope.showloginform);
      $scope.$apply();
      
  }); 

  socket.on('failed_login', function(){
    console.log('failed login');
  
  });

});//end controller
