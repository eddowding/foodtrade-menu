'use strict';

angular.module('ftm').controller('GridDetailController', ['$scope', 'Authentication', '$stateParams', 'Grids', '$location',
  function($scope, Authentication, $stateParams, Grids, $location) {
    $scope.shareUrl = $location.absUrl();
    $scope.authentication = Authentication;
    $scope.gridId = $stateParams.gridId;

    // Find existing Grid
    Grids.get({
      gridId: $scope.gridId
    })
    .$promise
    .then(function(grid) {
      $scope.grid = grid;
      $('#allergygrid').floatThead();
    });
  }
]);
