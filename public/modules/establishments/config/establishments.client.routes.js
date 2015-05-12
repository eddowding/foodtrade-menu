'use strict';

//Setting up route
angular.module('establishments').config(['$stateProvider',
	function($stateProvider) {
		// Establishments state routing
		$stateProvider.
		state('listEstablishments', {
			url: '/establishments',
			templateUrl: 'modules/establishments/views/list-establishments.client.view.html'
		}).
		state('createEstablishment', {
			url: '/establishments/create',
			templateUrl: 'modules/establishments/views/create-establishment.client.view.html'
		}).
		state('viewEstablishment', {
			url: '/establishments/:establishmentId',
			templateUrl: 'modules/establishments/views/view-establishment.client.view.html'
		}).
		state('editEstablishment', {
			url: '/establishments/:establishmentId/edit',
			templateUrl: 'modules/establishments/views/edit-establishment.client.view.html'
		});
	}
]);