'use strict';

angular.module('ftm').controller('DashboardController', ['$scope', 'Grids', 'Authentication', 'SweetAlert', '$location', 'ngProgress', 'Establishments',
  function($scope, Grids, Authentication, SweetAlert, $location, ngProgress, Establishments) {
    ngProgress.start();
    $scope.authentication = Authentication;

    Grids.query({
        user: $scope.authentication.user._id
      })
      .$promise
      .then(function(grids) {
        $scope.grids = grids;
        ngProgress.complete();
      });

    Establishments.query({
        user: $scope.authentication.user._id
      })
      .$promise
      .then(function(establishments) {
        if (establishments.length) {
          $scope.establishment = establishments[0];
        } else {
          $scope.establishment = {};
        }
      });

    $scope.deleteGridFn = function(grid) {
      SweetAlert.swal({
          title: "Are you sure?",
          text: "You're about to delete this grid!",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: true
        },
        function(isConfirm) {
          if (isConfirm) {
            analytics.track('Grid Deleted', {
      				gridId: grid._id
    				});
            grid.$delete();
						$scope.grids.forEach(function(value, index) {
							if (grid._id == value._id) {
								$scope.grids.splice(index, 1);
							}
						});
          }
        });
    };

		$scope.getAbsoluteUrlFn = function(grid) {
			var url = $location.protocol() + '://' + $location.host();
			if (!($location.port() == 80 || $location.port() == 443)) {
				url += ':' + $location.port();
			}
			url += '/?_escaped_fragment_=/grid-detail/' + grid._id;
      return url;
			// return window.encodeURIComponent(url);
		};
  }
]);
