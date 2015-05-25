'use strict';

//Setting up route
angular.module('ftm').config(['$stateProvider',
	function($stateProvider) {
		// Ftm state routing
		$stateProvider.
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
