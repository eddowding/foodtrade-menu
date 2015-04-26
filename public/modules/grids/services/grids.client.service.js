'use strict';

//Grids service used to communicate Grids REST endpoints
angular.module('grids').factory('Grids', ['$resource',
	function($resource) {
		return $resource('grids/:gridId', { gridId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);