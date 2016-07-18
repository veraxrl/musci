var app = angular.module('musciApp', ["ngRoute","firebase"]); 

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'mainCtrl',
		templateUrl: 'templates/home.html'
	})
	$routeProvider.when('/login', {
		controller: 'loginCtrl',
		templateUrl: 'templates/login.html'
	})                                      
});

app.controller('mainCtrl', function($scope, $http, $firebaseObject, $firebaseArray,$firebaseAuth) {


	SC.initialize({
	  client_id: 'eb60efff116075efdaa769b3eec7a5f8'
	});

	if ($scope.trackid==="misty") {
		SC.stream('/tracks/244261890').then(function(player){
		  player.play();
		  console.log(player);
		  $scope.myPlayer= player.streamInfo;
		});
	} else if ($scope.trackid==="latenight") {
		SC.stream('/tracks/11711484').then(function(player){
		  player.play();
		  console.log(player);
		  $scope.myPlayer= player.streamInfo;
		});
	} else if ($scope.trackid==="river") {
		SC.stream('/tracks/128905480').then(function(player){
		  player.play();
		  console.log(player);
		  $scope.myPlayer= player.streamInfo;
		});
	}
 
});

app.controller('LoginCtrl', function($scope, $routeParams, $firebaseObject, $firebaseAuth) {
    $scope.authObj = $firebaseAuth();

    $scope.login = function() {
        console.log($scope.email);
        console.log($scope.password);

        $scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
            window.location.assign('http://localhost:8000/#/');

        }).catch(function(error) {
             console.error("Authentication failed:", error);
        })

    }
});

