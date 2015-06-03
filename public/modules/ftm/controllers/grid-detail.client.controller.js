'use strict';

angular.module('ftm').controller('GridDetailController', ['$scope', 'Authentication', '$stateParams', 'Grids', '$location',
  function($scope, Authentication, $stateParams, Grids, $location) {
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

    $scope.getPrintAbsoluteUrlFn = function(grid) {
      if (!grid) {
        return '';
      }
      var url = $location.protocol() + '://' + $location.host();
      if (!($location.port() == 80 || $location.port() == 443)) {
        url += ':' + $location.port();
      }
      url += '/grids/' + grid._id + '/print';
      return url;
    };
  }
]);
