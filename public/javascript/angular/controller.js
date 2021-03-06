sensorCloudApp.controller('mainController', function($scope) {
	$scope.Message = "In controller";
});

sensorCloudApp.controller('userNavigationController', function($scope, $http, $state, userService) {
	userService.getCurrentUser(function(res){
		$scope.useremail = res;
		$scope.logout = function(){
			userService.logout();
		}
	});
});

sensorCloudApp.controller('adminNavigationController', function($scope, $http, $state, userService) {
	userService.getCurrentUser(function(res){
		$scope.useremail = res;
		$scope.logout = function(){
			userService.logout();
		}
	});
});

sensorCloudApp.controller('userBillingModule', function($scope, $http, $state, userService) {
	userService.getBillingInfo(function(data){
		 $scope.amount = data;
	});
	
	userService.fetchHistory(function(history){
		 $scope.history = history;
	 });
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

sensorCloudApp.controller('userDashboardController', function($scope, $http, userService){
	 $(".button-collapse").sideNav();
	
	 userService.fetchHistory(function(history){
		 $scope.history = history;
	 });

	 userService.fetchMostVisitedStations(function(data){
		 $scope.mostVisitedStation = data;
	 });
	 
	 userService.getBillingInfo(function(data){
		 $scope.amount = data;
	 });
});

sensorCloudApp.controller('adminDashboardController', function($scope, $http, userService){
	userService.getTotalUsers(function(res){
		$scope.totalUsers = res;
	});

	userService.getTotalStations(function(res){
		$scope.totatStations = res;
	});

	userService.fetchAdminHistory(function(res){
		$scope.adminHistory = res;
	});
});

sensorCloudApp.controller('editsensorManagerController', function($scope,$stateParams, $http,stationService){
	var selectedStationId = $stateParams.stationId;

	stationService.getStationDetails(selectedStationId,function(list){
		$scope.stationName = list[0].stationName;
		$scope.stationId = list[0].stationId;
		$scope.lat = list[0].stationLat;
		$scope.lng = list[0].stationLong;
	});

	$scope.confirmEditStation = function(){
		stationService.editStation($scope.stationName, $scope.stationId, $scope.lat, $scope.lng);
	}
});


sensorCloudApp.controller('editsensorController', function($scope,$stateParams, $http,stationService, sensorService){
	
	var selectedStationId = $stateParams.stationId;
	var selectedSensorName = $stateParams.sensorName;
//	alert(selectedStationId);
//	alert(selectedSensorName);
	stationService.getSensorDetails(selectedStationId,selectedSensorName, function(list){
		alert("sensortype : " + list[0].sensorType);
		$scope.sensorName = list[0].sensorName;
		$scope.sensorType = list[0].sensorType;
		
	});
	
	sensorService.getSensorTypes(function(data){
		$scope.selectValues = data;
	});
	
	$scope.confirmEditSensor = function(){
		alert($scope.sensorName);
		sensorService.editSensor($scope.sensorName, $scope.sensorType, selectedStationId , selectedSensorName);
	}

});

sensorCloudApp.controller('sensorManagerController', function($scope, $stateParams ,$http, sensorService, stationService){
	$scope.selectedStataionId = $stateParams.stationId;
	$scope.selectedSensorName = $stateParams.sensorName;

	stationService.getStationList(function(list){
		$scope.stationList = list;
	//	getStation();
		sensorService.getSensorList(function(sensor){
			$scope.sensorList = sensor;
		});

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

	$scope.confirmDeleteStation = function(selectedStationId){
		if(confirm("Are you sure you want to delete the station " + selectedStationId)){
			stationService.deleteStation(selectedStationId, function(res){
				stationService.getStationList(function(list){
					$scope.stationList = list;
					alert(res);
				});
			});
		}
	}

	$scope.confirmAddSensor = function(){
		sensorService.addSensor($scope.sensorName, $scope.sensorType, $scope.selectedStataionId);
	}

	/*$scope.confirmEditSensor = function(){
		sensorService.editSensor($scope.sensorName, $scope.sensorType, $scope.selectedStataionId);
	}*/

	$scope.confirmDeleteSensor = function(selectedStationId, selectedSensorName){
		if(confirm("Are you sure you want to delete the sensor" + selectedStationId + " " + selectedSensorName  )){
			sensorService.deleteSensor(selectedStationId, selectedSensorName, function(res){
				sensorService.getSensorList(function(sensor){
					$scope.sensorList = sensor;
					alert(res);
				});
			});
		}
	}
});

sensorCloudApp.controller('sensorControlController', function($scope, $http, stationService, sensorService){
	$scope.flag = false;

	stationService.getStationList(function(list){
		$scope.stations = list;
		$scope.flag = true;
		sensorService.getSensorList(function(sensor){
			$scope.sensorList = sensor;
		});
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

    $scope.changeStationStatus = function(stationId, stationName){
    	if(confirm("Are you sure you want to change the status of the station " + stationName )){
    		stationService.changeStationStatus(stationId);
    	}
    }
});


sensorCloudApp.controller('sensorDataController', function($scope, $http, $stateParams, sensorDataService, sensorService, stationService, userService){
	userService.getCurrentUser(function(user){
		if(user != 'admin'){
			stationService.addUserHistory($stateParams.stationId);
		}
	});
	
	sensorDataService.getSensorData($stateParams.stationId, function(data){
		$scope.sensorList = data.ListOfSensor;
		$scope.configList = [];
		$scope.getgraph= function(){
			for(var j =0 ; j < $scope.sensorList.length ; j++){
				var s = [];
				var d = [];
				var sensor = data.ListOfSensor[j];
				for(var i =0 ; i < data.arr.length ; i++){
					if (data.arr[i].sensorName == sensor.sensorName && data.arr[i].data != 'MM' && data.arr[i].data != undefined){
						d.push(data.arr[i].date);
					    s.push(data.arr[i].data/1);
					}
				}
				$scope.ShowDriverDetails(s,d,sensor);
			}
		};

		$(".loading").hide();
		$scope.getgraph(); 
	});

	$scope.changeSensorStatus = function(stationId, sensorName){
    	if(confirm("Are you sure you want to change the status of the sensorName: " + sensorName )){
    		sensorService.changeSensorStatus(stationId, sensorName, function(status){
//    			if(status == "Success"){
//    				if($scope[sensorName + 'showStatus']){
//    					$scope[sensorName + 'showStatus'] = false;
//    				}else{
//    					$scope[sensorName + 'showStatus'] = true;
//    				}
//        		}
    		});
    	}
    }

    $scope.showSensorType = function(){
		var sensor = $scope.selectedSensorType;
		if(sensor != ""){
			$scope[sensor + 'showSensor'] = false;
			for(index in $scope.sensorList){
				var name = $scope.sensorList[index].sensorName;
				if(sensor != name){
					$scope[name + 'showSensor'] = true;
				}
			}
		}else{
			for(index in $scope.sensorList){
				$scope[$scope.sensorList[index].sensorName + 'showSensor'] = false;
			}
		}
    }

	$scope.ShowDriverDetails = function(s,d,sensor) {
		var chart1 = {
			options: {
				chart: {
					type: 'line',
    		     }
    		},
    		title: {
    			text: 'Line Graph',
    		},
    		series: [{
    			data : s,
    		}],
	        xAxis: {
	        	categories: d
	        },
	        loading: false
	    }

		var chart2 = {
			options: {
				chart: {
					type: 'bar',
    		     }
    		},
    		title: {
    			text: 'Bar Graph',
    		},
    		series: [{
    			data : s,
    		}],
	        xAxis: {
	        	categories: d
	        },
	        loading: false
	    }

//		var chart3 = {
//			options: {
//				chart: {
//					type: 'pie',
//    		     }
//    		},
//    		series: [{
//    			data : s,
//    		}],
//	        xAxis: {
//	        	categories: d
//	        },
//	        loading: false
//	    }

		var chart4 = {
			options: {
				chart: {
					type: 'column',
    		     }
    		},
    		title: {
    			text: 'Column Graph',
    		},
    		series: [{
    			data : s,
    		}],
	        xAxis: {
	        	categories: d
	        },
	        loading: false
	    }

		var configData = {
			sensor: {},
			config : []
		};

		configData.sensor = sensor;
		configData.config.push(chart1);
		configData.config.push(chart2);
//		configData.config.push(chart3);
		configData.config.push(chart4);
		$scope.configList.push(configData);
	}
});
