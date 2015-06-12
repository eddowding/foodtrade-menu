'use strict';

angular.module('ftm').controller('GridDetailController', ['$scope', 'Authentication', '$stateParams', 'Grids', '$location', 'ngProgress',
  function($scope, Authentication, $stateParams, Grids, $location, ngProgress) {
    ngProgress.start();
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
      ngProgress.complete();
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
