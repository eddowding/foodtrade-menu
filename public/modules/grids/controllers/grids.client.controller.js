'use strict';

// Grids controller
angular.module('grids').controller('GridsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Grids', 'SweetAlert', '$state', 'Users', 'Accounts', 'Establishments',
	function($scope, $rootScope, $stateParams, $location, Authentication, Grids, SweetAlert, $state, Users, Accounts, Establishments) {
		$scope.authentication = Authentication;

		// Create new Grid
        $scope.grid = {};
        $scope.user = {};
        $scope.account = {};
        $scope.establishment = {};

        $scope.isSaveBtnClicked = false;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          if (!$scope.isSaveBtnClicked && $rootScope.$state.includes('createGrid')) {
            event.preventDefault();
            SweetAlert.swal({
               title: "Are you sure?",
               text: "You're about to leave this page without saving!",
               type: "warning",
               showCancelButton: true,
               confirmButtonColor: "#DD6B55",
               confirmButtonText: "Yes, delete it!",
               closeOnConfirm: true},
            function(isConfirm){
              if (isConfirm) {
                $scope.isSaveBtnClicked = true;
                $state.go(toState, toParams);
              }
            });
          }
        });

		$scope.create = function() {
			// Create new Grid object
			var grid = new Grids ($scope.grid);

			// Redirect after save
			grid.$save(function(response) {
				$location.path('grids/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
                if (!errorResponse) {
                  $scope.isSaveBtnClicked = true;
                }
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
          'nut',
          'peanut',
          'sesameSeed',
          'fish',
          'crustacean',
          'mollusc',
          'egg',
          'milk',
          'cereal',
          'lupin',
          'celery',
          'mustard',
          'soya',
          'sulphurDioxide',
          'other'
        ];


        $scope.placeholderRow = {
          item: {},
          veggie: {},
        };

        $scope.gridColumns.forEach(function(column, index) {
          $scope.placeholderRow[column] = {allergenType: 'No allergen'};
        });

        $scope.resetRow = angular.copy($scope.placeholderRow);

        $scope.updatePlaceholderRowCellFn = function(columnName, cell) {
          $scope.placeholderRow[columnName] = cell;
        };
        $scope.newRowLogicFn = function() {
          if (!$scope.placeholderRow.item.name) {
            return;
          }
            var lineSplit = $scope.placeholderRow.item.name.split('\n');
            lineSplit.forEach(function(line, index) {
              line = line.trim();
              if (line.length == 0) {
                return;
              }
              if (line.charAt(line.length - 1) == ':') {
                $scope.placeholderRow.item.type = 1;
              } else if (line.charAt(0) == '-') {
                line = line.substring(1, line.length);
                $scope.placeholderRow.item.type = 3;
              } else if (line.charAt(0) == '*') {
                line = line.substring(1, line.length);
                $scope.placeholderRow.item.type = 3;
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
        };

        $scope.addNewRowFn = function($event) {
          if ($event.keyCode == 13 || $event.keyCode == 10) {
            if ($event.ctrlKey) {
              $scope.placeholderRow.item.name += '\n';
            } else {
              $event.preventDefault();
              $scope.newRowLogicFn();
            }
          }
        };

        $scope.editCellFn = function(cell) {
          $scope.selectedEditCell = cell;
          $('#cellEditModal').modal('show');
        };

        $scope.toggleNoteFn = function() {
          if ($scope.placeholderRow.item.hasNote) {
            $scope.placeholderRow.item.hasNote = false;
          } else {
            $scope.placeholderRow.item.hasNote = true;
          }
        };

        $scope.togglePriceFn = function() {
          if ($scope.placeholderRow.item.hasPrice) {
            $scope.placeholderRow.item.hasPrice = false;
          } else {
            $scope.placeholderRow.item.hasPrice = true;
          }
        };

        $scope.toggleCharacteristicFn = function() {
          if ($scope.placeholderRow.item.hasCharacteristic) {
            $scope.placeholderRow.item.hasCharacteristic = false;
          } else {
            $scope.placeholderRow.item.hasCharacteristic = true;
          }
        };

        $scope.toggleVeggieEditFn = function(veggie) {
          if (veggie.edit) {
            veggie.edit = false;
          } else {
            veggie.edit = true;
          }
        };

        $scope.characterList = ['MSC 5', 'MSC 4', 'MSC 3', 'MSC 2', 'MSC 1', 'Organic', 'Locally sourced (within 30m/50km)', 'Fairtrade'];

        $scope.loadCharTagFn = function($query) {
          var retList = [];
          var regex = new RegExp('^' + $query, 'i');
          $scope.characterList.forEach(function(value, index) {
            if (regex.test(value)) {
              retList.push({text: value});
            }
          });
          return retList;
        };

        $scope.addToCharFn = function(val) {
          $scope.placeholderRow.item.characteristic.push({text: val});
        };

        $scope.checkIfCharAddedFn = function(val) {
          var retStatus = false;
          if (!$scope.placeholderRow.item.characteristic) {
            return retStatus;
          }

          $scope.placeholderRow.item.characteristic.forEach(function(value, index) {
            if (value.text == val) {
              retStatus = true;
            }
          });

          return retStatus;
        };

        $scope.toggleItemEditFn = function(item) {
          if (item.isEdit) {
            item.isEdit = false;
          } else {
            item.isEdit = true;
          }
        };

        $scope.saveItemEditFn = function($event, item) {
          if ($event.keyCode == 13 || $event.keyCode == 10) {
            $scope.toggleItemEditFn(item);
          }
        };

        $scope.signupSubmitFn = function() {
          Users.save($scope.user)
          .$promise
          .then(function(user) {
            console.log(user);
          });
        };
    }
]);
