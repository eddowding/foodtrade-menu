'use strict';

//Setting up route
angular.module('ftm').config(['$stateProvider',
	function($stateProvider) {
		// Ftm state routing
		$stateProvider.
		state('terms', {
			url: '/terms',
			templateUrl: 'modules/ftm/views/terms.client.view.html'
		}).
		state('grid-create-signup', {
			url: '/grid-create-signup',
			templateUrl: 'modules/ftm/views/grid-create-signup.client.view.html'
		}).
		state('about', {
			url: '/about',
			templateUrl: 'modules/ftm/views/about.client.view.html'
		}).
		state('grid-create', {
			url: '/grid-create',
			templateUrl: 'modules/ftm/views/grid-create.client.view.html'
		}).
		state('grid-detail', {
			url: '/grid-detail/:gridId',
			templateUrl: 'modules/ftm/views/grid-detail.client.view.html'
		}).
		state('dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/ftm/views/dashboard.client.view.html'
		});
	}
]);
