var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
	$rootScope.authenticated = false;
	$rootScope.current_user = "";

	$rootScope.signout = function(){
		$http.get('/auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = "";
	};
});


app.config(function($routeProvider) {
	$routeProvider

		//the timeline display
		.when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})

		//login
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})

		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		});

	});

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');
})
app.controller('mainController', function($scope, $rootScope, postService){
	$scope.posts = postService.query();
	$scope.newPost = {username: '', text: '', created_at: ''};


	$scope.post = function(){
		console.log('post');
		$scope.newPost.username = $rootScope.current_user;
		$scope.newPost.created_at = Date.now();
		postService.save($scope.newPost, function(){
			$scope.newPost = {username: '', text: '', created_at: ''};			
			$scope.posts = postService.query();
		});		
	};
});

app.controller('authController', function($scope, $rootScope, $http, $location){

	$scope.user = {username: '', password: ''};
	$scope.error_message = '';

	$scope.login= function(){
	$http.post("/auth/login", $scope.user).success(function(data){
		$rootScope.authenticated = true;
		$rootScope.current_user = data.user.username;

		$location.path('/');
	})
	};

	$scope.register = function (){
	$http.post("/auth/signup", $scope.user).success(function(data){
		$rootScope.authenticated = true;
		$rootScope.current_user = data.user.username;

		$location.path('/');
	})
	};	
});
