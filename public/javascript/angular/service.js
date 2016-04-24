sensorCloudApp.service('userService', function($http, $state){
	
	var userData = {
			firstName: '',
			userType: '',
			lastName: '',
			email: '',
			username: '',
			password: ''
		};
	
	var responseMessage;
	
	this.registerUser = function(fname, userType, lname, email, username, password){
		userData.firstName = fname;
		userData.userType = userType;
		userData.lastName = lname;
		userData.email = email;
		userData.username = username;
		userData.password = password;
		
		$http.post('/register', JSON.stringify(userData))
			.success(function(res){
				responseMessage = res;
				$state.go('login');
			}
		);
	};
	
	this.getRegisterResponse = function(){
		return responseMessage;
	};
});

sensorCloudApp.service('verifyUserService', function($http, $state){
	var userCredentials = {
			username: '',
			password: ''
		};
	
	var userType;
	
	this.validateUser = function(username, password, callback){
		userCredentials.username = username;
		userCredentials.password = password;
		
		$http.post('/login', JSON.stringify(userCredentials))
			.success(function(res){
				userType = res.userType;
				if(userType === "endUser"){
					$state.go('userDashboard');
				}else if(userType === "admin"){
					$state.go('adminDashboard');
				}
				callback(res.message);
			}
		);
	};

	this.getUsername = function(){
		return userCredentials.username;
	}
	
	this.getUserType = function(){
		return userType;
	}
});