'use strict';

angular.module('ftm').controller('GridCreateController', ['$scope', 'Authentication', '$stateParams', 'Grids', '$state',
  function($scope, Authentication, $stateParams, Grids, $state) {
    $scope.authentication = Authentication;
    $scope.grid = {
      name: "My Menu ("+moment().format('MM')+")"
    };

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
        $state.go('grid-detail', {
          gridId: response._id
        });

        // Clear form fields
        $scope.grid.name = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
