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
		    controller: 'sidebarController'
		})
		.state('adminNavigation', {
			templateUrl: '/partials/adminDashboardNavigation.ejs',
		    abstract: true,
		    controller: 'sidebarController'
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
            //controller: 'userDashboardController'
        })
        .state('adminDashboard', {
            url: '/adminDashboard',
            parent: 'adminNavigation',
            templateUrl: '/partials/adminDashboard.ejs',
            //controller: 'adminDashboardController'
        });
});