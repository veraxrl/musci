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
			  console.log(player);
			  $scope.currentPlayer = player;
			});
		} else if ($scope.trackid==="river") {
			SC.stream('/tracks/128905480').then(function(player){
			  $scope.currentPlayer = player;
			});
		} else if ($scope.trackid==="clouds") {
			$scope.anotherGoodOne = 'https://www.youtube.com/watch?v=EhC1K6KCm90';
		} else if ($scope.trackid==="electric") {
			$scope.anotherGoodOne = 'https://www.youtube.com/watch?v=Rv_a6rlRjZk';
		}

	}

	$scope.pausePlayer = function() {
		if ($scope.bestPlayer) $scope.bestPlayer.pauseVideo();
		if ($scope.currentPlayer) $scope.currentPlayer.pause();
	} 

	$scope.stopPlayer = function() {
		if ($scope.bestPlayer) $scope.bestPlayer.stopVideo();
		if ($scope.currentPlayer) $scope.currentPlayer.stop();  //SoundCloud does not have a stop function
	}

	$scope.startPlayer = function() {
		if ($scope.bestPlayer) $scope.bestPlayer.playVideo();
		if ($scope.currentPlayer) $scope.currentPlayer.play();
	}

	// Use the below to add new track: 
	// $scope.addTrack("misty","244261890");

	//Auto play Function:
	// $scope.$on('youtube.player.ended', function ($event, player) {
	// 	bestPlayer.playVideo();
	// });
 
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

