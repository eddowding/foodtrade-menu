'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es',
  function($scope, Es) {
    var esClient = Es.client();
    esClient.search({
      index: 'twitter',
      type: 'tweets',
      body: ejs.Request().query(ejs.MatchQuery('body', 'elasticsearch'))
    }).then(function(resp) {
      var hits = resp.hits.hits;
    }, function(err) {
      console.error(err);
    });
  }
]);
