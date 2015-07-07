'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es', 'uiGmapGoogleMapApi',
  function($scope, Es, uiGmapGoogleMapApi) {
    var esClient = Es.client();
    esClient.search({
      index: 'ftm',
      type: 'establishment',
      body: ejs.Request().query(ejs.MatchQuery('body', 'elasticsearch'))
    }).then(function(resp) {
      var hits = resp.hits.hits;
    }, function(err) {
      console.error(err);
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
