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
              $(element).popover({
                html: true,
                trigger: 'click focus',
                title: 'Cell edit',
                content: function() {
                  return $compile($('.cell-edit-form').html())(scope);
                }
              });
			}
		};
	}
]);
