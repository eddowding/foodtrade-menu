'use strict';

// Accounts controller
angular.module('accounts').controller('AccountsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Accounts', '$state',
	function($scope, $stateParams, $location, Authentication, Accounts, $state) {
		$scope.authentication = Authentication;
		if ($scope.authentication.user.roles.indexOf('admin') == -1) {
			$state.go('dashboard');
		}

		// Create new Account
		$scope.create = function() {
			// Create new Account object
			var account = new Accounts ({
				name: this.name
			});

			// Redirect after save
			account.$save(function(response) {
				$location.path('accounts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Account
		$scope.remove = function(account) {
			if ( account ) {
				account.$remove();

				for (var i in $scope.accounts) {
					if ($scope.accounts [i] === account) {
						$scope.accounts.splice(i, 1);
					}
				}
			} else {
				$scope.account.$remove(function() {
					$location.path('accounts');
				});
			}
		};

		// Update existing Account
		$scope.update = function() {
			var account = $scope.account;

			account.$update(function() {
				$location.path('accounts/' + account._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Accounts
		$scope.find = function() {
			$scope.accounts = Accounts.query();
		};

		// Find existing Account
		$scope.findOne = function() {
			$scope.account = Accounts.get({
				accountId: $stateParams.accountId
			});
		};
	}
]);
