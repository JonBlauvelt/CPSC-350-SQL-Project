//Create angular js application with no dependencies
var pollarizeApp = angular.module('pollarizeApp', []);

//Create controller
pollarizeApp.controller('appController', function($scope, $location, $anchorScroll){

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
  $scope.dob_activate = false;
  $scope.party_active = false;
  $scope.ed_lev_active = false;
  $scope.state_active = false;

  //messages
  $scope.login_msg = 'Get on in Here.';
  $scope.reg_msg = "Let's Get Started.";
  $scope.vote_buttons = ['aye','nay','aye'];
  $scope.vote_status = ['You have NOT yet voted!','You have voted ']
  $scope.vote_instructions = ['Vote now:', 'Change vote:'] 

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
  };

  $scope.get_ed_levs = function(){
    console.log("requesting education levels from server");
    $scope.ed_levs = [];
    socket.emit("get_ed_levs");
  };

  $scope.get_parties = function(){
    console.log("requesting parties from server");
    $scope.parties = [];
    socket.emit("get_parties");
  };
  
  $scope.get_incomes = function(){
    console.log("requesting incomes from server");
    $scope.incomes = [];
    socket.emit("get_incomes");
  };

  $scope.exit = function(){
    console.log("in exit");
    $scope.showloginform = false;
    $scope.showreg = false;  
    $scope.reset_register();
    $scope.password = '';
    $scope.username = '';
  };

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

  $scope.gotoTrending = function(){
    console.log('navigating to trending polls page');
    $scope.show_main_banner = false;
    $scope.show_trending_page = true;
    socket.emit('get_elections');
  };

  $scope.gotoDash = function(){
    console.log('nothing here yet'); 
  };

  $scope.goHome = function(){
    console.log('going home'); 
    $scope.show_main_banner = true;
    $scope.show_trending_page = false;
  };

  $scope.reset_register = function(){
    console.log('resetting reg form');
    $scope.newuser='';
    $scope.newpass='';
    $scope.city='';
    $scope.selected_state='';
    $scope.zip='';
    $scope.dob='';
    $scope.selected_party=''; 
    $scope.selected_ed_lev='';
    $scope.selected_income='';
  };

  $scope.validate = function(){
    if(isNaN($scope.zip[$scope.zip.length-1])){
        $scope.zip = $scope.zip.substring(0,$scope.zip.length-1);
      }
  };

  $scope.vote = function(choice,election,isNew){
    console.log(choice + ',' + election + ',' + isNew);
    socket.emit('vote',choice,election,isNew); 
  };

    $scope.shiftFocus = function(id){
    console.log('shifting focus to ' + id);
    if(id == 'state'){
      $scope.state_active = true;
    }else if(id == 'dob'){
      $scope.dob_active = true;
    }else if(id=='party'){
      $scope.party_active=true;
    }else if(id=='ed'){
      $scope.ed_lev_active=true;
    }else if(id=='income'){
      $scope.income_active=true;
    }
    var elem = document.getElementById(id);
    window.setTimeout(function(){elem.focus();}, 100);
  };

  //socket 

  socket.on('successful_login', function(uname){
    console.log('logged in as '  + $scope.displayname);
    $scope.displayname = uname;
    $scope.loggedin = true;
    $scope.showloginform = false;
    $scope.gotoTrending();
    console.log('showloginform = ' + $scope.showloginform);
    console.log('show_main_banner = ' + $scope.show_main_banner);
    console.log('show_main_header = ' + $scope.show_main_header);
    $scope.$apply();
  }); 

  socket.on('failed_login', function(){
    console.log('failed login');
    $scope.showloginform = true;
    $scope.loggedin = false;
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

  socket.on('clear_elections', function(election){
    console.log('clearing elections');
    $scope.elections = [];
    $scope.$apply();
  });

  socket.on('scroll', function(id){
    console.log('scrolling to ' + id);
    $location.hash('election'+id);
    $anchorScroll();
    $scope.$apply();
  });


});//end controller
