sensorCloudApp.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
	$stateProvider
		.state('navigation', {
		    templateUrl: '/partials/navigation.ejs',
		    abstract: true,
		})
		.state('userNavigation', {
			templateUrl: '/partials/userDashboardNavigation.ejs',
		    abstract: true,
		    controller: 'userNavigationController'
		})
		.state('adminNavigation', {
			templateUrl: '/partials/adminDashboardNavigation.ejs',
		    abstract: true,
		    controller: 'userNavigationController'
		})
    	.state('home', {
            url: '/',
            parent: 'navigation',
            templateUrl: '/partials/mainContent.ejs',
            controller: 'mainController'
        })
        .state('login', {
            url: '/login',
            parent: 'navigation',
            templateUrl: '/partials/login.ejs',
            controller: 'loginController'
        })
        .state('register', {
            url: '/register',
            parent: 'navigation',
            templateUrl: '/partials/userRegister.ejs',
            controller: 'userRegisterController'
        })
        .state('userDashboard', {
            url: '/userDashboard',
            parent: 'userNavigation',
            templateUrl: '/partials/userDashboard.ejs',
            controller: 'userDashboardController'
        })
        .state('adminDashboard', {
            url: '/adminDashboard',
            parent: 'adminNavigation',
            templateUrl: '/partials/adminDashboard.ejs',
            controller: 'adminDashboardController'
        })
		.state('sensorManager', {
			url: '/sensorManager',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/sensorManager.ejs',
	        controller: 'sensorManagerController'
	    })
	    //
	    .state('sensorGraph', {
			url: '/sensorGraph',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/sensorGraph.ejs',
	        controller: 'sensorManagerController'
	    })
	    //
	    .state('addStation', {
			url: '/addStation',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/addStation.ejs',
	        controller: 'sensorManagerController'
	    })
	    .state('editStation', {
			url: '/editStation/:stationId',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/editStation.ejs',
	        controller: 'editsensorManagerController'
	    })
	    .state('deleteStation', {
			url: '/deleteStation/:stationId',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/deleteStation.ejs',
	        controller: 'sensorManagerController'
	    })
	    .state('addSensor', {
			url: '/addSensor/:stationId',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/addSensor.ejs',
	        controller: 'sensorManagerController'
	    })
	    .state('stationData', {
			url: '/stationData/:stationId',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/stationData.ejs',
	        controller: 'sensorDataController'
	    })
	    .state('userStationData', {
			url: '/userStationData',
	        parent: 'userNavigation',
	        templateUrl: '/partials/userStationData.ejs',
	        controller: 'sensorControlController'
	    })
	    .state('userSensorData', {
			url: '/userSensorData/:stationId',
	        parent: 'userNavigation',
	        templateUrl: '/partials/userSensorData.ejs',
	        controller: 'sensorDataController'
	    })
	    .state('editSensor', {
			url: '/editSensor/:stationId/:sensorName',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/editSensor.ejs',
	        controller: 'editsensorController'
	    })
	    .state('sensorController', {
			url: '/sensorController',
	        parent: 'adminNavigation',
	        templateUrl: '/partials/sensorController.ejs',
	        controller: 'sensorControlController'
	    });
	});