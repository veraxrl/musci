var app = angular.module('musciApp', ["ngRoute","firebase","youtube-embed"]); 

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'loginCtrl',
		templateUrl: 'templates/login.html'
	}).when('/login', {
		controller: 'loginCtrl',
		templateUrl: 'templates/login.html'
	}).when('/signup', {
		controller: 'signupCtrl',
		templateUrl: 'templates/signup.html'
	}).when('/users/:userID', {
		controller: 'mainCtrl',
		templateUrl: 'templates/home.html',
		resolve: {
			"currentAuth": function($firebaseAuth) {
       		return $firebaseAuth().$requireSignIn();
			}
		}
	})                                     
});

app.run(["$rootScope", "$location", function($rootScope, $location) {
 $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
   // We can catch the error thrown when the $requireSignIn promise is rejected
   // and redirect the user back to the home page
   if (error === "AUTH_REQUIRED") {
     $location.path("/login");
   }
 });
}]);

app.controller('mainCtrl', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $location, $routeParams, $route) {

	$scope.control = true; //true = stopped, false = playing

	//Function to add new track:
	$scope.addSCTrack = function(myName,Id) {
		var ref = firebase.database().ref().child("tracks").child("SoundCloud");
		$scope.tracks= $firebaseArray(ref);
	    $scope.tracks.$add({
	    	name: myName,
	    	id: Id,
	    	type: "SC"
	    });
  	};

  	//Load length of YT database: 
  	var ref2= firebase.database().ref().child("tracks").child("Youtube");
	$scope.a= $firebaseArray(ref2);
	$scope.a.$loaded(function() {
		console.log($scope.a.numTrack);
	})
		
  	//Function to add Youtube track:
  	$scope.addYTTrack = function(myName,Id) {
		var ref = firebase.database().ref().child("users").child($routeParams.userID).child("tracks").child(Id);
		$scope.track= $firebaseObject(ref);

			console.log("adding track");
			$scope.track.name= myName;
			$scope.track.id= Id;
			$scope.track.type= "YT";

			$scope.track.$save().then(function(ref) {
				ref.key === Id;
			}, function (error) {
				console.log(error);
			});
  	};

  	$scope.deleteTrack = function(p) {
  		var ref = firebase.database().ref().child("users").child($routeParams.userID).child("tracks").child(p.id);
  		var obj = $firebaseObject(ref);
		obj.$remove().then(function(ref) {
		  	console.log("remove track named "+p.name);
		  	$route.reload();
		}, function(error) {
		  console.log("Error:", error);
		});
  	}
	
  	//Creating the dropdown menu items:                            
	$scope.menu = [];
	$scope.playMenu= [];

	// var scRef = firebase.database().ref().child("tracks").child("SoundCloud");
	// $scope.scMenus= $firebaseArray(scRef);

	// $scope.scMenus.$loaded().then(function(data) {
	// 	$scope.menu.push({"playlist": $scope.scMenus});
	// });

	var ytRef = firebase.database().ref().child("users").child($routeParams.userID).child("tracks");
	$scope.ytMenus = $firebaseArray(ytRef);

	$scope.ytMenus.$loaded().then(function(data) {
		$scope.menu.push({"playlist": $scope.ytMenus});

		for (var i=0;i<$scope.menu.length;i++) {
			for (var j=0; j<$scope.menu[i].playlist.length;j++) {
				var song= {name:$scope.menu[i].playlist[j].name, id:$scope.menu[i].playlist[j].id, type:$scope.menu[i].playlist[j].type}; 
				$scope.playMenu.push(song);
			}
		}

		console.log($scope.playMenu);

	});	
	
  	//Function to select track, triggered by ng-click:
	$scope.playTrack = function() {
		SC.initialize({
		  client_id: 'eb60efff116075efdaa769b3eec7a5f8'
		});

		if ($scope.tracktype==="SC") {
			SC.stream('/tracks/'+$scope.currentID).then(function(player){
			  console.log(player);
			  $scope.currentPlayer = player;
			});
		} 
		else if ($scope.tracktype==="YT") {
			$scope.anotherGoodOne = 'https://www.youtube.com/watch?v='+$scope.currentID;
			$scope.currentPlayer= false;
		} 
	}

	$scope.assignID = function(p) {
		console.log(p.id);
		$scope.currentID= p.id;
		$scope.trackid = p.name;
		$scope.tracktype= p.type;
		$scope.playTrack();
		console.log("type "+p.type);
	}

	//Function to control track: (play, pause, stop)
	$scope.pausePlayer = function() {
		console.log("in pausePlayer");
		if ($scope.tracktype==="YT") $scope.bestPlayer.pauseVideo();
		if ($scope.tracktype==="SC") $scope.currentPlayer.pause();
		$scope.control = true;
		$scope.isPlaying= false;
	} 

	$scope.stopPlayer = function() {
		if ($scope.tracktype==="YT") $scope.bestPlayer.stopVideo();
		if ($scope.tracktype==="SC") {
			$scope.currentPlayer.pause();
			$scope.currentPlayer.seek(0);
		}
		$scope.isPlaying= false;
	}

	$scope.startPlayer = function() {
		if ($scope.tracktype==="YT") $scope.bestPlayer.playVideo();
		if ($scope.tracktype==="SC") {
			$scope.currentPlayer.play();
		}
		$scope.control = false;
		$scope.isPlaying = true;
	}


// GABE THIS IS THE FUNCTION THAT PULLS YOUTUBE LINKS
	$scope.refreshDB = function() {
		console.log($scope.newURL.substring(32));
		$scope.addYTTrack($scope.newTrackName, $scope.newURL.substring(32));
		$route.reload();
	}




	// this one bru ^^^

	//sign out f(x)
	$scope.authObj = $firebaseAuth();

	$scope.signOut= function(){
    	$scope.authObj.$signOut();
    	$location.path("/login")
    };

	//Move down the playlist:
	// $scope.$on('youtube.player.ended', function ($event, player) {
	// 	console.log($scope.playMenu[3]);
	// 	$scope.currentID= "VUbOGrq8rmE";
	// 	$scope.trackid = "The Pines";
	// 	$scope.tracktype= "YT";
	// 	$scope.playTrack();
	// });

	//Auto play:
	$scope.$on('youtube.player.ready',function($event,player) {
		$scope.startPlayer();
	});

	//Auto play Function:
	// $scope.$on('youtube.player.ended', function ($event, player) {
	// 	bestPlayer.playVideo();
	// });

		// element(by.model('checked')).click();

		// $scope.$on(youtube.player.playing){
 
});

app.controller('loginCtrl', function($scope, $routeParams, $firebaseObject, $firebaseAuth) {
    $scope.authObj = $firebaseAuth();

    $scope.login = function() {
        console.log($scope.email);
        console.log($scope.password);

        $scope.authObj.$signInWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
            window.location.assign('http://localhost:8000/#/users/'+firebaseUser.uid);

        }).catch(function(error) {
             console.error("Authentication failed:", error);
        })

    }
});
app.controller('signupCtrl', function($scope, $http, $firebaseObject, $firebaseArray,$routeParams,$firebaseAuth) {
    $scope.authObj = $firebaseAuth();

    $scope.show = function() {
		console.log($scope.name);
		console.log($scope.email);
		console.log($scope.password);
	}

	$scope.createUser = function() {
		$scope.authObj = $firebaseAuth();
		$scope.authObj.$createUserWithEmailAndPassword($scope.email,$scope.password)
		.then(function(firebaseUser) {
			//add user for printout:
			console.log("my uid is"+firebaseUser.uid);
			var ref = firebase.database().ref().child("users").child(firebaseUser.uid);
			$scope.user= $firebaseObject(ref);

			$scope.user.uid= firebaseUser.uid;
			$scope.user.email= $scope.email;
			$scope.user.password= $scope.password;

			$scope.user.$save().then(function(ref) {
				console.log($scope.user);
				ref.key === firebaseUser.uid;
				window.location.assign('http://localhost:8000/#/users/'+firebaseUser.uid);
			}, function (error) {
				console.log(error);
			});

		    console.log("User " + firebaseUser.uid + " created successfully!");
		    console.log($scope.user);
		    }).catch(function(error) {
		    	console.error("Error: ", error);
		    	$scope.isError= true;
		    	$scope.errormsg=error.message;
		  	})

	}

});


//TO-DOS: 
//1. Sometimes Youtube track does not load properly. (internet problem)
//2.  Display all songs in Firebase database in a playlist (CSS work, make it pretty) (done!)
//6.  Fix bug of multiple loaded songs playing at once (done!)

//Future goals: 
//1.  Being able to remove songs
//2.  Queue songs 
//7.  How to do chrome extension 
//8.  How to drag and drop songs 
//10. change trackid to an object that we can add to, and thus access them through that. we can then fix many other functions through that
