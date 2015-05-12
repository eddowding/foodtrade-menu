'use strict';

//Establishments service used to communicate Establishments REST endpoints
angular.module('establishments').factory('Establishments', ['$resource',
	function($resource) {
		return $resource('establishments/:establishmentId', { establishmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);