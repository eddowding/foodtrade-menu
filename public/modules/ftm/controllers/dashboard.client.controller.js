'use strict';

angular.module('ftm').controller('DashboardController', ['$scope', 'Grids', 'Authentication',
	function($scope, Grids, Authentication) {
        $scope.authentication = Authentication;
        
        Grids.query({user: $scope.authentication.user._id})
        .$promise
        .then(function(grids) {
            $scope.grids = grids;
        });
	}
]);