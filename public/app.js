var app = angular.module('DashBoard', ['ngMaterial', 'ngMessages', 'ui.router', 'ngResource']);

	
	app.config(function($stateProvider, $urlRouterProvider){
	
		
		$urlRouterProvider.otherwise('/dashboard')
		
		$stateProvider
			.state('dashboard', {
				url: '/dashboard',
				templateUrl: 'dashboard/dashboard.html',
				controller: 'dashboardCtrl',
				controllerAs: 'dash'
			})
		
	});