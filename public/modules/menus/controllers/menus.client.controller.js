'use strict';

// Menus controller
angular.module('menus').controller('MenusController', ['$scope', '$stateParams', '$location', 'Authentication', 'Menus',
	function($scope, $stateParams, $location, Authentication, Menus) {
		$scope.authentication = Authentication;

		// Create new Menu
		$scope.create = function() {
			// Create new Menu object
			var menu = new Menus ({
				name: this.name
			});

			// Redirect after save
			menu.$save(function(response) {
				$location.path('menus/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Menu
		$scope.remove = function(menu) {
			if ( menu ) { 
				menu.$remove();

				for (var i in $scope.menus) {
					if ($scope.menus [i] === menu) {
						$scope.menus.splice(i, 1);
					}
				}
			} else {
				$scope.menu.$remove(function() {
					$location.path('menus');
				});
			}
		};

		// Update existing Menu
		$scope.update = function() {
			var menu = $scope.menu;

			menu.$update(function() {
				$location.path('menus/' + menu._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Menus
		$scope.find = function() {
			$scope.menus = Menus.query();
		};

		// Find existing Menu
		$scope.findOne = function() {
			$scope.menu = Menus.get({ 
				menuId: $stateParams.menuId
			});
		};
	}
]);