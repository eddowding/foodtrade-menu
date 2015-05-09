'use strict';

angular.module('grids').directive('cellEdit', ['$compile',
	function($compile) {
		return {
			templateUrl: 'modules/grids/views/cell-edit.client.partial.html',
			restrict: 'E',
            scope: {
              rowNumber: '=rowNumber',
              columnName: '=columnName'
            },
			link: function postLink(scope, element, attrs) {
              scope.cell = scope.$parent.grid.tableData[scope.rowNumber][scope.columnName];
              scope.placeholderCell = angular.copy(scope.cell);
              $(element).popover({
                html: true,
                title: false,
                placement: 'bottom',
                content: function() {
                  return $compile($('.cell-' + scope.rowNumber + '-' + scope.columnName).html())(scope);
                }
              });

              scope.inputDismissFn = function($event) {
                if ($event.keyCode == 13) {
                  scope.saveCellEditFn();
                }
              };

              scope.saveCellEditFn = function() {
                scope.cell = angular.copy(scope.placeholderCell);
                scope.placeholderCell = angular.copy(scope.cell);
                $(element).popover('hide');
              };

              scope.cancelCellEditFn = function() {
                $(element).popover('hide');
              };

              scope.$watch('placeholderCell.allergenType', function(newValue, oldValue) {
                if (newValue == 'No allergen') {
                  scope.saveCellEditFn();
                }
              });


              scope.specialColumns = ['cereal', 'crustacean', 'mollusc', 'nut'];

              scope.specialColumnAllergenReqFn = function() {
                var retStatus = null;
                if (scope.specialColumns.indexOf(scope.columnName) == -1) {
                  retStatus = false;
                } else {
                  retStatus = true;
                }
                return retStatus;
              };
			}
		};
	}
]);
