sensorCloudApp.controller('mainController', function($scope) {
	$scope.Message = "In controller";
});

sensorCloudApp.controller('userRegisterController', function($scope, $http, $state, userService) {
	$scope.confirmRegister = function(){
		if($scope.password == $scope.cpassword){
			userService.registerUser($scope.fname, 'endUser', $scope.lname, $scope.email, $scope.username, $scope.password);
		}
	};
});

sensorCloudApp.controller('loginController', function($scope, $http, userService, verifyUserService) {
	$scope.loginMessage = userService.getRegisterResponse();

	$scope.confirmLogin = function(){
		verifyUserService.validateUser($scope.username, $scope.password, function(message){
			$scope.loginMessage = message;
		});
	};	
});
	
sensorCloudApp.controller('sidebarController', function($scope){
});