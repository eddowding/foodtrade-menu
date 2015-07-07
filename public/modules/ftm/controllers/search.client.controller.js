'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es', 'uiGmapGoogleMapApi',
  function($scope, Es, uiGmapGoogleMapApi) {
    var esClient = Es.client();

    $scope.searchFn = function() {
      esClient.search({
        index: 'ftm',
        type: 'establishment',
        body: ejs.Request().query(ejs.MatchQuery('BusinessName', $scope.query))
      }).then(function(resp) {
        $scope.hits = resp.hits.hits;
        console.info('Search Query', ejs.Request().query(ejs.MatchQuery('BusinessName', $scope.query)).toJSON());
      }, function(err) {
        console.error(err);
      });
    };

    $scope.$watch('query', function(newValue, oldValue) {
      if (newValue && newValue.length >= 2) {
        $scope.searchFn();
      } else {
				$scope.hits = [];
			}
    });

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.map = {
        center: {
          latitude: 45,
          longitude: -73
        },
        zoom: 8
      };
    });
  }
]);
