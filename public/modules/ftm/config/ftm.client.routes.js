'use strict';

//Setting up route
angular.module('ftm').config(['$stateProvider',
	function($stateProvider) {
		// Ftm state routing
		$stateProvider.
		state('dashboard', {
			url: '/dashboard',
			templateUrl: 'modules/ftm/views/dashboard.client.view.html'
		});
	}
]);
