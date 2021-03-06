'use strict';

// Users controller
angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users', '$http', '$state',
  function($scope, $stateParams, $location, Authentication, Users, $http, $state) {
    $scope.authentication = Authentication;
    if ($scope.authentication.user.roles.indexOf('admin') == -1) {
      $state.go('dashboard');
    }

    // Create new User
    $scope.create = function() {
      // Create new User object
      var user = new Users({
        name: this.name
      });

      // Redirect after save
      user.$save(function(response) {
        $location.path('users/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing User
    $scope.remove = function(user) {
      if (user) {
        user.$remove();

        for (var i in $scope.users) {
          if ($scope.users[i] === user) {
            $scope.users.splice(i, 1);
          }
        }
      } else {
        $scope.user.$remove(function() {
          $location.path('users');
        });
      }
    };

    // Update existing User
    $scope.update = function() {
      var user = $scope.user;

      user.$update(function() {
        $location.path('users/' + user._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Users
    $scope.find = function() {
      $scope.users = Users.query();
    };

    // Find existing User
    $scope.findOne = function() {
      $scope.user = Users.get({
        userId: $stateParams.userId
      });
    };

    $scope.userFetchExtraDataFn = function(user) {
      $http.get('/establishments/by/user/' + user._id)
      .success(function(data) {
        if (data.length) {
          user.establishment = data[0];
        }
      });
      $http.get('/grids/by/user/' + user._id)
      .success(function(data) {
        user.grids = data;
      });
    };
  }
]);
