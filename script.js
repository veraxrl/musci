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


	//Function to add new track:
	$scope.addSCTrack = function(myName,Id) {
		var ref = firebase.database().ref().child("tracks").child("SoundCloud");
		$scope.tracks= $firebaseArray(ref);
	    $scope.tracks.$add({
	    	name: myName,
	    	id: Id
	    });
  	};

  	//Function to add Youtube track:
  	$scope.addYTTrack = function(myName,Id) {
		var ref = firebase.database().ref().child("tracks").child("Youtube");
		$scope.tracks= $firebaseArray(ref);
	    $scope.tracks.$add({
	    	name: myName,
	    	id: Id
	    });
  	};

  	//Function to select track, triggered by ng-click:
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
			$scope.anotherGoodOne = 'https://www.youtube.com/watch?v='+'EhC1K6KCm90';
		} else if ($scope.trackid==="electric") {
			$scope.anotherGoodOne = 'https://www.youtube.com/watch?v='+'Rv_a6rlRjZk';
		}

	}

	//Function to control track: (play, pause, stop)
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
	//$scope.addSCTrack("river","128905480");
	//$scope.addYTTrack("clouds","EhC1K6KCm90");

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


//TO-DOS: 
//1.  Figure out how to do Bootstrap dropdown bar
//2.  Display all songs in Firebase database in a playlist (CSS work, make it pretty) 
// The firebase function is already set up. Use function to add track infos. 

//3.  Use firebase db to store songs, their ids. (done!) 
//4.  Systematially choose the songs to play. (not hardcode if else statement, based on firebase db and user input)

//5.  Instead of manually type in song name, have a dropdown bar to display all songs in the database 

//Future goals: 
//6.  Figure out how to add songs to database based on URL (String manipulation, to be able to recognize that the 
//URL belongs to a specific API)
//7.  How to do chrome extension 
//8.  How to drag and drop songs 
//9.  Make a log-in page 