'use strict';

angular.module('grids').directive('cellEditNew', ['$compile',
	function($compile) {
		return {
			templateUrl: 'modules/grids/views/cell-edit-new.client.partial.html',
			restrict: 'E',
            scope: {
              columnName: '=columnName'
            },
			link: function postLink(scope, element, attrs) {
              console.log(scope.columnName);
              scope.cell = scope.$parent.placeholderRow[scope.columnName];
              scope.placeholderCell = angular.copy(scope.cell);
              $(element).popover({
                html: true,
                title: false,
                placement: 'bottom',
                content: function() {
                  return $compile($('.cell-edit-form').html())(scope);
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
                console.info('cell update >>> ', scope.cell);
                console.log(scope.$parent.placeholderRow);
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
			}
		};
	}
]);
