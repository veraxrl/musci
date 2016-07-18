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
	// var ref = firebase.database().ref().child("msgs");
	// $scope.msgs= $firebaseArray(ref);

	SC.initialize({
	  client_id: 'eb60efff116075efdaa769b3eec7a5f8'
	  // redirect_uri: 'http://localhost:8000/#/login'
	});

	SC.stream('/tracks/244261890').then(function(player){
	  player.play();
	  console.log(player);
	  $scope.myPlayer= player.streamInfo;
	});

	// var tracks = [{id: 290}, {id: 291}, {id: 292}];

	// SC.connect().then(function() {
	//   SC.post('/playlists', {
	//     playlist: { title: 'Liked Tracks', tracks: tracks }
	//   });
	// });

	// console.log(playlist);

	//<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/244261890&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>

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

