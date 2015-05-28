'use strict';

// Establishments controller
angular.module('establishments').controller('EstablishmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Establishments', '$state',
	function($scope, $stateParams, $location, Authentication, Establishments, $state) {
		$scope.authentication = Authentication;
		if ($scope.authentication.user.roles.indexOf('admin') == -1) {
			$state.go('dashboard');
		}

		// Create new Establishment
		$scope.create = function() {
			// Create new Establishment object
			var establishment = new Establishments ({
				name: this.name
			});

			// Redirect after save
			establishment.$save(function(response) {
				$location.path('establishments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Establishment
		$scope.remove = function(establishment) {
			if ( establishment ) {
				establishment.$remove();

				for (var i in $scope.establishments) {
					if ($scope.establishments [i] === establishment) {
						$scope.establishments.splice(i, 1);
					}
				}
			} else {
				$scope.establishment.$remove(function() {
					$location.path('establishments');
				});
			}
		};

		// Update existing Establishment
		$scope.update = function() {
			var establishment = $scope.establishment;

			establishment.$update(function() {
				$location.path('establishments/' + establishment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Establishments
		$scope.find = function() {
			$scope.establishments = Establishments.query();
		};

		// Find existing Establishment
		$scope.findOne = function() {
			$scope.establishment = Establishments.get({
				establishmentId: $stateParams.establishmentId
			});
		};
	}
]);
