'use strict';

angular.module('ftm').controller('DashboardController', ['$scope', 'Grids', 'Authentication', 'SweetAlert',
  function($scope, Grids, Authentication, SweetAlert) {
    $scope.authentication = Authentication;

    Grids.query({
        user: $scope.authentication.user._id
      })
      .$promise
      .then(function(grids) {
        $scope.grids = grids;
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
            grid.$delete();
						$scope.grids.forEach(function(value, index) {
							if (grid._id == value._id) {
								$scope.grids.splice(index, 1);
							}
						});
          }
        });
    };
  }
]);
