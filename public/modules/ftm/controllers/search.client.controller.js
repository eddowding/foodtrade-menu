// 'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es', 'uiGmapGoogleMapApi',
  function($scope, Es, uiGmapGoogleMapApi) {
    var esClient = Es.client();

    $scope.hitMarkers = [];

    $scope.searchFn = function() {
      esClient.search({
        index: 'ftm',
        type: 'establishment',
        body: ejs.Request().query(ejs.MatchQuery('BusinessName', $scope.query))
      }).then(function(resp) {
        $scope.hits = resp.hits.hits;
        $scope.hits.forEach(function(value, index) {
          if (value._source.geocode) {
            $scope.hitMarkers.push({
              longitude: value._source.geocode[0],
              latitude: value._source.geocode[1],
              id: value._source._id,
              title: value._source.BusinessName
            });
          }
        });
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

    $scope.markerClickEvent = function(marker, eventName, model, arguments) {
			$scope.clickedMarker = model;
    };

    $scope.markerEvents = {
      click: $scope.markerClickEvent
    };
  }
]);
