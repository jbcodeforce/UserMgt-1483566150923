/**
 * Angular app 
 */
(function(){
	var app = angular.module('UserApp',['ngRoute', 'ui.bootstrap']);
	
	// Define top route of the application
	app.config(['$routeProvider',
	      function($routeProvider) {
			$routeProvider.when('/',
	    		{templateUrl: 'partials/LoginPage.html',
	    		controller: 'LoginCtrl'});
			
			$routeProvider.otherwise({redirectTo: '/'});
	      }
	]);
		
	         
	app.controller('LoginCtrl' ,['$scope','$location','$uibModal','$http','userService',
     		function($scope,$location,$uibModal,$http,userService) {
     			$scope.pageStatus = '';	
     			
     			
     			// Log user in
     			$scope.logUser = function(u){
     				$http({
     					method:'POST',
     					url:'/login',
     					data:u,
     					headers: {'Content-Type': 'application/json'}
     				}).then(function(response) {
     					console.log(response.data);
     					if (response.data.success) {
     						console.log('Login Successful');
     						if (response.data.user) {
     							userService.setUser(response.data.user);
     						} else {
     							console.log('ERROR: empty user response');
     						}
     						$location.path('/iw');
     					} else if (response.data.message == 'INCORRECT_PASSWORD') {
     						console.log('INCORRECT_PASSWORD');
     						$scope.pageStatus = 'INCORRECT_PASSWORD';
     						$location.path('/login');
     					} else if (response.data.message == 'NO_USER_FOUND') {
     						console.log('NO_USER_FOUND');
     						$scope.pageStatus = 'NO_USER_FOUND';
     						$location.path('/login');
     					} else {
     						// make sure other not caught status is not followed through
     						console.log('UNKNOWN_ERROR');
     						$scope.pageStatus = 'NO_USER_FOUND';
     						$location.path('/login');
     					}
     				}),function(error) {
     					// todo do something from the error
     					console.log(error);
     				};
     			}
     			
     			$scope.elem={};
     			// To register a new user.
     			$scope.newUser = function(){
     				var modalInstance = $uibModal.open({
     					templateUrl: 'userForm.html',
     					controller: 'ElementModalCtrl',
     					size: 'md',
     					resolve: {
     						elem: function () {
     							return $scope.elem;
     						}
     					}
     				});
     				
     				// when user clicks okay on modal windows, save the login to the backend
     				modalInstance.result.then(function (elem) {
     					saveUserInfo($http,elem);			
     					$scope.elem={}; // reset the content to avoid having the data back
     					$location.path('/login');
     				}, function () {
     					$scope.elem={};
     					$location.path('/login');
     				});
     			}
     			
     			// Change password
     			$scope.changePassword = function(){
     				var modalInstance = $uibModal.open({
     					templateUrl: 'changePassword.html',
     					controller: 'ElementModalCtrl',
     					size: 'md',
     					resolve: {
     						elem: function () {
     							return $scope.elem;
     						}
     					}
     				});
     				// when user clicks okay on modal windows, update the login to the backend
     				modalInstance.result.then(function (elem) {
     					updateUserInfo($http,elem);			
     					$scope.elem={}; // reset the content to avoid having the data back
     					$location.path('/');
     				}, function () {
     					$scope.elem={};
     					$location.path('/');
     				});
     			}
     	}]);
	
})();


