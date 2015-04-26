'use strict';

//Setting up route
angular.module('grids').config(['$stateProvider',
	function($stateProvider) {
		// Grids state routing
		$stateProvider.
		state('listGrids', {
			url: '/grids',
			templateUrl: 'modules/grids/views/list-grids.client.view.html'
		}).
		state('createGrid', {
			url: '/grids/create',
			templateUrl: 'modules/grids/views/create-grid.client.view.html'
		}).
		state('viewGrid', {
			url: '/grids/:gridId',
			templateUrl: 'modules/grids/views/view-grid.client.view.html'
		}).
		state('editGrid', {
			url: '/grids/:gridId/edit',
			templateUrl: 'modules/grids/views/edit-grid.client.view.html'
		});
	}
]);