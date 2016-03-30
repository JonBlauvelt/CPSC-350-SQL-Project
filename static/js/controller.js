//helper function for show/hide
function login(showhide){
  if(showhide == "show"){
    document.getElementById('popupbox').style.visibility="visible";
  }else if (showhide == "hide"){
    document.getElementById('popupbox').style.visibility="hidden";
  }
}

//Create angular js application with no dependencies
var pollarizeApp = angular.module('pollarizeApp', []);

//Create controller
pollarizeApp.controller('appController', function($scope){

  //make connection back to flask app
  var socket = io.connect(document.domain + ':' + location.port + '/poll');    

  //define variables
  $scope.showhide = 'hide';
  login($scope.showhide);
  $scope.username = '';
  $scope.password = '';

 
  $scope.gotoLogin = function gotoLogin(){
    console.log("in goto login");
    login('show');
  };


  $scope.processLogin = function processLogin() {
     console.log("trying login");
     login('hide');
     socket.emit('login', $scope.username, $scope.password);
     $scope.username = '';
     $scope.password = '';
     $scope.$apply();
  };
  
});//end controller
