var app = angular.module('musciApp', ["ngRoute","firebase","youtube-embed"]); 

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

app.controller('mainCtrl', function($scope, $http, $firebaseArray, $firebaseAuth) {
	var ref = firebase.database().ref().child("tracks");
	$scope.tracks= $firebaseArray(ref);

	//Function to add new track:
	$scope.addTrack = function(myName,Id) {
	    $scope.tracks.$add({
	    	name: myName,
	    	id: Id
	    });
  	};

  	//Function to play track, triggered by ng-click:
	$scope.playTrack = function() {
		SC.initialize({
		  client_id: 'eb60efff116075efdaa769b3eec7a5f8'
		});

		if ($scope.trackid==="misty") {
			SC.stream('/tracks/244261890').then(function(player){
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
	}

	// Use the below to add new track: 
	// $scope.addTrack("misty","244261890");

	$scope.anotherGoodOne = 'https://www.youtube.com/watch?v=EhC1K6KCm90';

	//Auto Replay Function:
	$scope.$on('youtube.player.ended', function ($event, player) {
		player.playVideo();
	});
 
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

