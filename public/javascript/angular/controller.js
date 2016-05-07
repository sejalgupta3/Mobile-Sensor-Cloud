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

sensorCloudApp.controller('userDashboardController', function($scope, $http, sensorDataService){
	 $(".button-collapse").sideNav();
	//sensorDataService.getSensorData();
});

sensorCloudApp.controller('sensorManagerController', function($scope, $stateParams ,$http, sensorService, stationService){
	$scope.selectedStataionId = $stateParams.stationId;
	$scope.selectedSensorName = $stateParams.sensorName;

	stationService.getStationList(function(list){
		$scope.stationList = list;
		getStation();
		getSensor();
	});
	
	sensorService.getSensorTypes(function(data){
		$scope.selectValues = data;
	});
	
	var getStation = function(){
		if($scope.selectedStataionId){
			for(index in $scope.stationList){
				var station = $scope.stationList[index];
				if(station.id == $scope.selectedStataionId){
					$scope.stationName = station.name;
					$scope.stationId = station.id;
					$scope.lat = station.lat;
					$scope.lng = station.long;
				}
			}
		}
	};

	var getSensor = function(){
		if($scope.selectedStataionId && $scope.selectedSensorName){
			for(index in $scope.stationList){
				var station = $scope.stationList[index];
				if(station.id == $scope.selectedStataionId){
					for(index2 in station.sensorList){
						var sensor = station.sensorList[index2];
						if(sensor.name == $scope.selectedSensorName){
							$scope.sensorName = sensor.name;
							$scope.sensorType = sensor.type;
						}
					}
				}
			}
		}
	};

	$scope.confirmAddStation = function(){
		stationService.addStation($scope.stationName, $scope.stationId, $scope.lat, $scope.lng);
	}

	$scope.confirmEditStation = function(){
		stationService.editStation($scope.stationName, $scope.stationId, $scope.lat, $scope.lng);
	}

	$scope.confirmDeleteStation = function(selectedStataionId){
		if(confirm("Are you sure you want to delete the station")){
			stationService.deleteStation(selectedStataionId, function(list){
				$scope.stationList = list;
			});
		}
	}

	$scope.confirmAddSensor = function(){
		sensorService.addSensor($scope.sensorName, $scope.sensorType, $scope.selectedStataionId);
	}

	$scope.confirmEditSensor = function(){
		sensorService.editSensor($scope.sensorName, $scope.sensorType, $scope.selectedStataionId);
	}

	$scope.confirmDeleteSensor = function(selectedStataionId, selectedSensorName){
		if(confirm("Are you sure you want to delete the sensor")){
			sensorService.deleteSensor(selectedStataionId, selectedSensorName, function(list){
				$scope.stationList = list;
			});
		}
	}
});

sensorCloudApp.controller('sensorControlController', function($scope, $http, stationService, sensorService){
	$scope.flag = false;
	
	stationService.getStationList(function(list){
		$scope.stations = list;
		$scope.flag = true;
	});
	
	sensorService.getSensorTypes(function(data){
		$scope.selectValues = data;
	});
	
    $scope.choseSensorType = function() {
        var userValues = {
        	selectedType : $scope.selectedSensorType
        };
        $http.post('/retreiveSelectedSensorTypeStations', userValues)
	    	.success(function(res) {
	    		$scope.stations = res;
	    	})
	       .error(function(res) {
	    	   console.log('Error: ' + res);
	       });
    }
});

//sensorCloudApp.controller('userSensorDataController', function($scope, $http, stationService, sensorService){
//	$scope.flag = false;
//	
//	stationService.getStationList(function(list){
//		$scope.stations = list;
//		$scope.flag = true;
//	});
//
//	sensorService.getSensorTypes(function(data){
//		$scope.selectValues = data;
//	});
//	
//    $scope.choseSensorType = function() {
//        var userValues = {
//          selectedType : $scope.selectedSensorType
//        };
//        $http.post('/retreiveSelectedSensorTypeStations', userValues)
//	       .success(function(res) {
//	           $scope.stations = res;
//	       })
//	       .error(function(res) {
//	           console.log('Error: ' + res);
//	       });
//    }
//});

sensorCloudApp.controller('sensorDataController', function($scope, $http, $stateParams, sensorDataService){
	sensorDataService.getSensorData($stateParams.stationId, function(data){
		$scope.dataSet = data;
	});
});
