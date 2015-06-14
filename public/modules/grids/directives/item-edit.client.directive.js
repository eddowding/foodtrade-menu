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
					scope.$parent.updateTableDataRowCellFn('item', scope.rowNumber, angular.copy(scope.row.item));
					$(element).popover('hide');
				};

				scope.characterList = ['MSC 5', 'MSC 4', 'MSC 3', 'MSC 2', 'MSC 1', 'Organic', 'Local 30m/50km', 'Local 50m/80km', 'Local 100m/160km', 'Fairtrade'];

	      scope.loadCharTagFn = function($query) {
	        var retList = [];
	        var regex = new RegExp('^' + $query, 'i');
	        scope.characterList.forEach(function(value, index) {
	          if (regex.test(value)) {
	            retList.push({
	              text: value
	            });
	          }
	        });
	        return retList;
	      };
      }
    };
  }
]);
