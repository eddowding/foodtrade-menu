'use strict';

angular.module('grids').directive('itemEdit', ['$compile',
  function($compile) {
    return {
      templateUrl: 'modules/grids/views/item-edit.client.partial.html',
      restrict: 'E',
      scope: {
        rowNumber: '=rowNumber'
      },
      link: function postLink(scope, element, attrs) {
        scope.row = scope.$parent.grid.tableData[scope.rowNumber];

        $(element).popover({
          html: true,
          title: false,
          placement: 'bottom',
          content: function() {
            return $compile($('.item-' + scope.rowNumber).html())(scope);
          }
        });

				scope.cancelItemEditFn = function() {
					$(element).popover('hide');
				};

				scope.saveItemEditFn = function() {
					$(element).popover('hide');
				};
      }
    };
  }
]);
