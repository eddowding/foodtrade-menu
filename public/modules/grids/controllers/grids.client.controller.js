'use strict';

// Grids controller
angular.module('grids').controller('GridsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Grids',
	function($scope, $stateParams, $location, Authentication, Grids) {
		$scope.authentication = Authentication;

		// Create new Grid
		$scope.create = function() {
			// Create new Grid object
			var grid = new Grids ({
				name: this.name
			});

			// Redirect after save
			grid.$save(function(response) {
				$location.path('grids/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Grid
		$scope.remove = function(grid) {
			if ( grid ) {
				grid.$remove();

				for (var i in $scope.grids) {
					if ($scope.grids [i] === grid) {
						$scope.grids.splice(i, 1);
					}
				}
			} else {
				$scope.grid.$remove(function() {
					$location.path('grids');
				});
			}
		};

		// Update existing Grid
		$scope.update = function() {
			var grid = $scope.grid;

			grid.$update(function() {
				$location.path('grids/' + grid._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Grids
		$scope.find = function() {
			$scope.grids = Grids.query();
		};

		// Find existing Grid
		$scope.findOne = function() {
			$scope.grid = Grids.get({
				gridId: $stateParams.gridId
			});
		};

        $scope.gridColumnCount = 16;

        $scope.placeholderRow = [{cellType: 1, type: 1, text: $scope.newRowText}];

        for(var i=1; i<$scope.gridColumnCount; i++) {
          $scope.placeholderRow.push({cellType: 2, value: true});
        }

        $scope.addNewRowFn = function($event) {
          if ($event.keyCode == 13) {
            var lineSplit = $scope.newRowText.split('\n');
            lineSplit.forEach(function(line, index) {
              line = line.trim();
              if (line.length == 0) {
                return;
              }
              var isSection = false;
              if (line.charAt(line.length - 1) == ':') {
                isSection = true;
              }

              if (isSection) {
                $scope.placeholderRow[0].type = 1;
              } else {
                $scope.placeholderRow[0].type = 2;
              }

              $scope.placeholderRow[0].text = line;
              var rowEntry = angular.copy($scope.placeholderRow);
              if ($scope.grid.tableData) {
                $scope.grid.tableData.push(rowEntry);
              } else {
                $scope.grid.tableData = [rowEntry];
              }
            });
            $scope.newRowText = '';
          }
        };
	}
]);
