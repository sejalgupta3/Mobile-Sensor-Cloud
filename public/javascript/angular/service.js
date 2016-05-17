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
	
	this.logout = function(){
		
		$http.get('/logout').success(function(){
			$state.go('login');
		});
	};

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

	this.getCurrentUser = function(callback){
		$http.get('/getCurrentUser')
		.success(function(res){
			callback(res);
		});
	}

	this.getTotalUsers = function(callback){
		$http.get('/getTotalUsers')
		.success(function(res){
			callback(res);
		});
	}

	this.getTotalStations = function(callback){
		$http.get('/getTotalStations')
		.success(function(res){
			callback(res);
		});
	}

	this.fetchHistory = function(callback){
		$http.get('/fetchUserHistory')
		.success(function(res){
			callback(res);
		});
	}

	this.fetchAdminHistory = function(callback){
		$http.get('/fetchAdminHistory')
		.success(function(res){
			callback(res);
		});
	}

	this.fetchMostVisitedStations = function(callback){
		$http.get('/fetchMostVisitedStations')
		.success(function(res){
			callback(res);
		});
	}
	
	this.getBillingInfo = function(callback){
		alert("service");
		$http.get('/getBillingInfo')
		.success(function(res){
			callback(res);
		});
	}
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

sensorCloudApp.service('sensorDataService', function($http, $state){
	this.getSensorData = function(id, callback){
		$http.post('/getSensorLatestData', JSON.stringify({id: id}))
			.success(function(res){
				callback(res);
			}
		);
	};
});

sensorCloudApp.service('stationService', function($http, $state){


	this.getStationDetails = function(id,callback){
		$http.post('/getStationDetails', JSON.stringify({id : id}))
		.success(function(res){
			callback(res);

		});
	}

	this.getSensorDetails = function(stationId,sensorName,callback){
		
		$http.post('/getSensorDetails', JSON.stringify({stationId : stationId, sensorName : sensorName}))
		.success(function(res){
			callback(res);
		});	
	}
	
	this.addUserHistory = function(id){
		$http.post('/addUserHistory', JSON.stringify({id : id}))
		.success(function(res){
			console.log(res);
		});
	}

	this.addStation = function(name, id, lat, long){
		var stationData = {
				name: name,
				id: id,
				lat: lat,
				long: long,
				status: 'active',
				sensorList:[]
		};

		$http.post('/addStation', JSON.stringify(stationData))
			.success(function(res){
				responseMessage = res;
				console.log(responseMessage);
				$state.go("sensorManager");
			}
		);
	};

	this.getStationList = function(callback){
		$http.get('/getStationList')
			.success(function(res){
				callback(res);
			}
		);
	}

	this.editStation = function(name, id, lat, long){
		var editStationData = {
				name: name,
				id: id,
				lat: lat,
				long: long,
				status: 'active',
		};
		editStationData.name = name;
		editStationData.id = id;
		editStationData.lat = lat;
		editStationData.long = long;
		editStationData.status = 'active';
		$http.post('/editStation', JSON.stringify(editStationData))
			.success(function(res){
				responseMessage = res;
				alert(res);
				$state.go('sensorManager');
			}
		);
	}

	this.deleteStation = function(id, callback){
		$http.post('/deleteStation', JSON.stringify({id: id}))
			.success(function(res){

				callback(res);
			}
		);
	}

	this.changeStationStatus = function(stationId){
		$http.post('/changeStationStatus', JSON.stringify({id: stationId}))
		.success(function(res){
				console.log("Station status changed successfully.");
			}
		);
	}
});

sensorCloudApp.service('sensorService', function($http, $state){
	var sensorData = {
			name:'',
			type:'',
			status:'',
			station:''
		};

	this.addSensor = function(name, type, station){
		sensorData.name = name;
		sensorData.type = type;
		sensorData.status = 'active'
		sensorData.station = station;

		$http.post('/addSensor', JSON.stringify(sensorData))
			.success(function(res){
				$state.go('sensorManager');
			}
		);
	};

	this.editSensor =  function(name, type, station , sensor){
		$http.post('/editSensor', JSON.stringify({sensorName : name , sensorType : type , stationId : station ,selectedSensor : sensor }))
		.success(function(res){	
			$state.go('sensorManager');
		}
	);
	}

	this.getSensorList = function(callback){
		$http.get('/getSensorList')
		.success(function(res){
			callback(res);
		});
	}


	this.deleteSensor = function(station, name, callback){
		$http.post('/deleteSensor', JSON.stringify({id: station, name: name}))
			.success(function(res){
				callback(res);
			}
		);
	}

	this.getSensorTypes = function(callback){
		$http.get('/getSensorTypes')
			.success(function(res){
				callback(res);
			}
		);
	}

	this.changeSensorStatus = function(stationId, sensorName, callback){
		$http.post('/changeSensorStatus', JSON.stringify({id: stationId, sensorName: sensorName}))
		.success(function(res){
			callback(res);
			}
		);
	}
});
