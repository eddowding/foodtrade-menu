'use strict';

// Grids controller
angular.module('grids').controller('GridsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grids',
	function($scope, $stateParams, $location, Authentication, Grids) {
		$scope.authentication = Authentication;

		// Create new Grid
		$scope.create = function() {
			// Create new Grid object
			var grid = new Grids ({
				name: this.name
			});

			// Redirect after save
			grid.$save(function(response) {
				$location.path('grids/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grid
		$scope.remove = function(grid) {
			if ( grid ) { 
				grid.$remove();

				for (var i in $scope.grids) {
					if ($scope.grids [i] === grid) {
						$scope.grids.splice(i, 1);
					}
				}
			} else {
				$scope.grid.$remove(function() {
					$location.path('grids');
				});
			}
		};

		// Update existing Grid
		$scope.update = function() {
			var grid = $scope.grid;

			grid.$update(function() {
				$location.path('grids/' + grid._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grids
		$scope.find = function() {
			$scope.grids = Grids.query();
		};

		// Find existing Grid
		$scope.findOne = function() {
			$scope.grid = Grids.get({ 
				gridId: $stateParams.gridId
			});
		};
	}
]);