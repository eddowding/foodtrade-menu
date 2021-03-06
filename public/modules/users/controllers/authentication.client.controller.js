'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', 'Accounts', 'Establishments',
	function($scope, $http, $location, Authentication, Accounts, Establishments) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

        $scope.account = {};
        $scope.establishment = {};

		$scope.signup = function() {
            $scope.user.username = $scope.user.email;
			$http.post('/auth/signup', $scope.user).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				analytics.identify(response._id, {
          name: response.displayName,
          email: response.email
        });

				analytics.track('Signed Up', {
  				plan: 'Regular'
				});

                $scope.account.user = response._id;
                Accounts.save($scope.account)
                .$promise
                .then(function(account) {
                  $scope.account = account;
                });
                $scope.establishment.user = response._id;
                Establishments.save($scope.establishment)
                .$promise
                .then(function(establishment) {
                  $scope.establishment = establishment;
                });
				// And redirect to the listing view
				$location.path('/grids');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.user).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				analytics.identify(response._id, {
          name: response.displayName,
          email: response.email
        });
				// And redirect to the listing view
				if (response.roles.indexOf('admin') > -1) {
					$location.path('/grids');
				} else {
					$location.path('/dashboard');
				}
			}).error(function(response, status) {
				if (status == 301) {
					window.location = 'http://' + response.subdomain + '.foodtrade.menu';
				}
				$scope.error = response.message;
			});
		};
	}
]);
