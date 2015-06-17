'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Menus', '$http',
	function($scope, $rootScope, Authentication, Menus, $http) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$rootScope.commonSigninFn = function() {
			console.log('Common Login');
			$http.post('/auth/signin', $scope.user).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				analytics.identify(response._id, {
					name: response.displayName,
					email: response.email
				});
			}).error(function(response, status) {
				if (status == 301) {
					window.location = 'http://' + response.subdomain + '.foodtrade.menu';
				}
				$scope.error = response.message;
			});
		};
	}
]);
