'use strict';

// Grids controller
angular.module('grids').controller('GridCreateSignupController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Grids', 'SweetAlert', '$state', 'Users', 'Accounts', 'Establishments', '$http',
  function($scope, $rootScope, $stateParams, $location, Authentication, Grids, SweetAlert, $state, Users, Accounts, Establishments, $http) {
    $scope.authentication = Authentication;

    // Create new Grid
    $scope.grid = {
       name: "My Menu ("+moment().format('Do MMM')+")"
    };
    $scope.user = {};
    $scope.account = {};
    $scope.establishment = {};

    $scope.isSaveBtnClicked = false;
    $rootScope.enableSaveBtn = false;
    $scope.$watch('grid.name', function(newValue, oldValue) {
      if (newValue) {
        $rootScope.enableSaveBtn = true;
      } else {
        $rootScope.enableSaveBtn = false;
      }
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (!$scope.isSaveBtnClicked && $rootScope.$state.includes('createGrid')) {
        event.preventDefault();
        SweetAlert.swal({
            title: "Are you sure?",
            text: "You're about to leave this page without saving!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
          },
          function(isConfirm) {
            if (isConfirm) {
              $scope.isSaveBtnClicked = true;
              $state.go(toState, toParams);
            }
          });
      }
    });

    $scope.create = function() {
      // Create new Grid object
      $scope.isSaveBtnClicked = true;
      var grid = new Grids($scope.grid);

      // Redirect after save
      grid.$save(function(response) {
        analytics.track('Grid Created', {
  				gridId: response._id,
          gridName: response.name
				});
        $location.path('grids/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.signupSubmitFn = function() {
      $scope.user.username = $scope.user.email;
      $http.post('/auth/signup', $scope.user).success(function(response) {
        $scope.authentication.user = response;
        analytics.identify(response._id, {
          name: response.displayName,
          email: response.email
        });
        $scope.account.user = response._id;
        Accounts.save($scope.account)
          .$promise
          .then(function(account) {
            $scope.account = account;
            analytics.track('Account Created', {
      				accountId: account._id
    				});
          });
        $scope.establishment.user = response._id;
        Establishments.save($scope.establishment)
          .$promise
          .then(function(establishment) {
            $scope.establishment = establishment;
            analytics.track('Establishment Created', {
      				establishmentId: establishment._id,
              businessName: establishment.BusinessName
    				});
          });
        $scope.create();
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
        $scope.grid.user = response._id;
        Grids.save($scope.grid)
        .$promise
        .then(function(grid) {
          analytics.track('Grid Created', {
    				gridId: grid._id,
            gridName: grid.name
  				});
          $location.path('/dashboard');
        });
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.establishmentFsaSuggestionFn = function() {
      var postcode = $scope.establishment.PostCode;
      $scope.fsaEstablishments = [];
      if (!postcode) {
        return;
      }
      if (postcode.length >= 2) {
        var fsaReq = {
          method: 'GET',
          url: 'http://api.ratings.food.gov.uk/Establishments',
          params: {address: postcode, pageSize: 10},
          headers: {
            'x-api-version': 2
          }
        };

        $http(fsaReq).success(function(data) {
          $scope.fsaEstablishments = data.establishments;
        });
      }
    };

    $scope.selectFsaEstFn = function(fsaEst) {
      $scope.establishment = fsaEst;
    };
  }
]);
