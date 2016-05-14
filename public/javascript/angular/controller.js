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

	$scope.confirmEditStation = function(){
		stationService.editStation($scope.stationName, $scope.stationId, $scope.lat, $scope.lng);
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

	$scope.confirmEditSensor = function(){
		sensorService.editSensor($scope.sensorName, $scope.sensorType, $scope.selectedStataionId);
	}

	$scope.confirmDeleteSensor = function(selectedStationId, selectedSensorName){
		if(confirm("Are you sure you want to delete the sensor" + selectedStationId + " " + selectedSensorName  )){
			sensorService.deleteSensor(selectedStationId, selectedSensorName, function(res){
				sensorService.getSensorList(function(sensor){
					$scope.sensorList = sensor;
					alert(res);
				});
			//	$scope.stationList = list;
				
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
	
	$scope.sensorList = ['1','2','3'];
	 
	   ////
	 $scope.ShowDriverDetails = function(s,d,t,f) {
		   alert("inside driver");
    	   $scope.chartConfig1 = {
    		        options: {
    		            chart: {
    		                type: 'line',
    		                
    		            }
    		        },
    		         series: [{
    		         
    		        	 data : s,
    		          //  pointInterval: 24 * 3600 * 1000 // one day
    		        }],
    		        title: {
    		            text: 'Temperature Data'
    		        },
    		        xAxis: {
    		        
    		          categories: d
    		        },
    		        loading: false
    		    }
    	   
    	  $scope.chartConfig2 = {
    		        options: {
    		            chart: {
    		                type: 'bar',
    		                
    		            }
    		        },
    		         series: [{
    		         
    		        	 data : t,
    		          //  pointInterval: 24 * 3600 * 1000 // one day
    		        }],
    		        title: {
    		            text: 'Humidity Data'
    		        },
    		        xAxis: {
    		        
    		          categories: f
    		        },
    		        loading: false
    		    }
    	   
      	  $scope.chartConfig3 = {
    		        options: {
    		            chart: {
    		                type: 'pie',
    		                
    		            }
    		        },
    		         series: [{
    		         
    		        	 data : t,
    		          //  pointInterval: 24 * 3600 * 1000 // one day
    		        }],
    		        title: {
    		            text: 'Precipitation Data'
    		        },
    		        xAxis: {
    		        
    		          categories: f
    		        },
    		        loading: false
    		    }
    	   
    	 $scope.chartConfig4 = {
    		        options: {
    		            chart: {
    		                type: 'column',
    		                
    		            }
    		        },
    		         series: [{
    		         
    		        	 data : t,
    		          //  pointInterval: 24 * 3600 * 1000 // one day
    		        }],
    		        title: {
    		            text: 'Wind Cycle Data'
    		        },
    		        xAxis: {
    		        
    		          categories: f
    		        },
    		        loading: false
    		    }
 			}
 
	  $scope.getgraph= function(){
		  			
		  			alert("inside getgraph");
		           	var s =[2,16,7,11],d=[2013,2014,2015,2016];
		        	var t =[6,3,11,5,9,8],f=[2011,2012,2013,2014,2015,2016];
	            	$scope.ShowDriverDetails(s,d,t,f); 
	            	
	        };
	    $scope.getgraph(); 
	////
	
	
});
