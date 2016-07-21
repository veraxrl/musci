var app = angular.module('musciApp', ["ngRoute","firebase","youtube-embed"]); 

app.config(function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'mainCtrl',
		templateUrl: 'templates/home.html',
		resolve: {

     		"currentAuth": function($firebaseAuth) {
       		return $firebaseAuth().$requireSignIn();
     		}
   		}
	}).when('/login', {
		controller: 'loginCtrl',
		templateUrl: 'templates/login.html'
	}).when('/signup', {
		controller: 'signupCtrl',
		templateUrl: 'templates/signup.html'
	})                                      
});

//Redirect to login, if not signed in
app.run(["$rootScope", "$location", function($rootScope, $location) {
 $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
   // We can catch the error thrown when the $requireSignIn promise is rejected
   // and redirect the user back to the home page
   if (error === "AUTH_REQUIRED") {
     $location.path("/login");
   }
 });
}]);



app.controller('mainCtrl', function($scope, $http, $firebaseArray, $firebaseObject, $firebaseAuth, $location) {
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
		var ref = firebase.database().ref().child("tracks").child("Youtube");
		console.log("num", ref);
		$scope.tracks= $firebaseArray(ref);

	    $scope.tracks.$add({
	    	name: myName,
	    	id: Id,
	    	type: "YT"	    
	    });
	    //$scope.a.numTrack= $scope.trackLength+1;
  	};
	
  	//Creating the dropdown menu items:                            
	$scope.menu = [];
	$scope.playMenu= [];

	var scRef = firebase.database().ref().child("tracks").child("SoundCloud");
	$scope.scMenus= $firebaseArray(scRef);

	$scope.scMenus.$loaded().then(function(data) {
		$scope.menu.push({"playlist": $scope.scMenus});
	});

	var ytRef = firebase.database().ref().child("tracks").child("Youtube");
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


	// $scope.menus = $scope.ytMenus;
	// $scope.menus.push($scope.scMenus);
	
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
	} 

	$scope.stopPlayer = function() {
		if ($scope.tracktype==="YT") $scope.bestPlayer.stopVideo();
		if ($scope.tracktype==="SC") {
			$scope.currentPlayer.pause();
			$scope.currentPlayer.seek(0);
		}
	}

	$scope.startPlayer = function() {
		if ($scope.tracktype==="YT") $scope.bestPlayer.playVideo();
		if ($scope.tracktype==="SC") {
			$scope.currentPlayer.play();
		}
		$scope.control = false;
	}

	$scope.refreshDB = function() {
		console.log($scope.newURL.substring(32));
		$scope.addYTTrack($scope.newTrackName, $scope.newURL.substring(32));
	}

	//sign out f(x)
	$scope.authObj = $firebaseAuth();

	$scope.signOut= function(){
    	$scope.authObj.$signOut();
    	$location.path("/login")
    };

	// Use the below to add new track: 
	// $scope.addSCTrack("misty","244261890");
	// $scope.addSCTrack("river","128905480");

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
            window.location.assign('http://localhost:8000/#/');

        }).catch(function(error) {
             console.error("Authentication failed:", error);
        })

    }
});
app.controller('signupCtrl', function($scope, $routeParams, $firebaseObject, $firebaseAuth) {
    $scope.authObj = $firebaseAuth();

    $scope.signUp = function() {
        console.log($scope.name);
        console.log($scope.email);
        console.log($scope.password);

        $scope.authObj.$createUserWithEmailAndPassword($scope.email, $scope.password)
        .then(function(firebaseUser) {
            console.log("Created account:", firebaseUser.uid);
            window.location.assign('http://localhost:8000/#/');

        }).catch(function(error) {
             console.error("Authentication failed:", error);
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



