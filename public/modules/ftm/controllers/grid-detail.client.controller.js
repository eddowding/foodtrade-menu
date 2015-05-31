'use strict';

angular.module('ftm').controller('GridDetailController', ['$scope', 'Authentication', '$stateParams', 'Grids', '$location',
  function($scope, Authentication, $stateParams, Grids, $location) {
    $scope.shareUrl = $location.absUrl();
    $scope.authentication = Authentication;

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
      veggie: {
        type: null
      },
    };

    $scope.gridColumns.forEach(function(column, index) {
      $scope.placeholderRow[column] = {
        allergenType: 'No allergen'
      };
    });

    $scope.resetRow = angular.copy($scope.placeholderRow);

    $scope.updatePlaceholderRowCellFn = function(columnName, cell) {
      $scope.placeholderRow[columnName] = cell;
    };

    $scope.saveGridFn = function() {
      var tmpGrid = angular.copy($scope.grid);
      try {
        tmpGrid.updated = new Date();
        tmpGrid.$save();
        console.info('Saving grid');
      } catch (err) {
        console.error(err);
      }
    };

    $scope.updateTableDataRowCellFn = function(columnName, rowNumber, cell) {
      $scope.grid.tableData[rowNumber][columnName] = cell;
			$scope.updateSectionsFn();
      $scope.saveGridFn();
    };

    $scope.updateSectionsFn = function() {
      var columnValues = null;
      for (var i = $scope.grid.tableData.length - 1; i >= 0; i--) {
        var row = $scope.grid.tableData[i];
        if (row.item.type == 1) {
          if (columnValues) {
            for (var col in columnValues) {
							if (columnValues[col].indexOf('Fixed') > -1) {
								row[col].allergenType = 'Fixed';
							} else if (columnValues[col].indexOf('Removable') > -1) {
								row[col].allergenType = 'Removable';
							} else {
								row[col].allergenType = 'No allergen';
							}
            }
						columnValues = null;
						continue;
          } else {
            continue;
          }
        }
        if (!columnValues) {
          columnValues = {};
          $scope.gridColumns.forEach(function(value, index) {
            columnValues[value] = [];
          });
        }
        for (var col in columnValues) {
          columnValues[col].push(row[col].allergenType);
        }
      }
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

			$scope.updateSectionsFn();

      $scope.saveGridFn();

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

    $scope.characterList = ['MSC 5', 'MSC 4', 'MSC 3', 'MSC 2', 'MSC 1', 'Organic', 'Local 30m/50km', 'Local 50m/80km', 'Local 100m/160km', 'Fairtrade'];

    $scope.loadCharTagFn = function($query) {
      var retList = [];
      var regex = new RegExp('^' + $query, 'i');
      $scope.characterList.forEach(function(value, index) {
        if (regex.test(value)) {
          retList.push({
            text: value
          });
        }
      });
      return retList;
    };

    $scope.addToCharFn = function(val) {
      $scope.placeholderRow.item.characteristic.push({
        text: val
      });
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

    $scope.saveItemEditFn = function($event, $index, item) {
      if ($event.keyCode == 13 || $event.keyCode == 10) {
        $scope.toggleItemEditFn(item);
        if (!item.name) {
          $scope.grid.tableData.splice($index, 1);
        } else if (item.name.length == 0) {
          $scope.grid.tableData.splice($index, 1);
        } else {
          $scope.grid.tableData.splice($index + 1, 0, angular.copy($scope.resetRow));
          $scope.grid.tableData[$index + 1].item.isEdit = true;
        }
				$scope.updateSectionsFn();
        $scope.saveGridFn();
      }
    };

    $scope.deleteRowFn = function($index) {
      $scope.grid.tableData.splice($index, 1);
			$scope.updateSectionsFn();
      $scope.saveGridFn();
    };

    $scope.charEditStatus = {};

    $scope.toggleCharEditFn = function($index) {
      if ($scope.charEditStatus[$index]) {
        $scope.charEditStatus[$index] = false;
      } else {
        $scope.charEditStatus[$index] = true;
      }
    };
  }
]);
