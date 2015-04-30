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


        $scope.gridColumns = [
          'celery',
          'cereal',
          'crustacean',
          'egg',
          'fish',
          'lupin',
          'milk',
          'mollusc',
          'mustard',
          'nut',
          'peanut',
          'sesameSeed',
          'soya',
          'sulphurDioxide',
          'other'
        ];


        $scope.placeholderRow = {
          item: {},
          veggie: {},
        };

        $scope.gridColumns.forEach(function(column, index) {
          $scope.placeholderRow[column] = {};
        });

        $scope.resetRow = angular.copy($scope.placeholderRow);

        $scope.addNewRowFn = function($event) {
          if ($event.ctrlKey && ($event.keyCode == 13 || $event.keyCode == 10)) {
            var lineSplit = $scope.placeholderRow.item.name.split('\n');
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
                $scope.placeholderRow.item.type = 1;
              } else {
                $scope.placeholderRow.item.type = 2;
              }

              var rowEntry = angular.copy($scope.placeholderRow);
              rowEntry.item.name = line;

              if ($scope.grid.tableData) {
                $scope.grid.tableData.push(rowEntry);
              } else {
                $scope.grid.tableData = [rowEntry];
              }
            });

            $scope.placeholderRow = angular.copy($scope.resetRow);

            console.info('New grid entry >>>', $scope.grid.tableData);
          }
        };
	}
]);
