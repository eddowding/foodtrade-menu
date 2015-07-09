// 'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es', 'uiGmapGoogleMapApi',
  function($scope, Es, uiGmapGoogleMapApi) {
    var esClient = Es.client();

    $scope.hitMarkers = [];

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.pageLimit = 5;

    $scope.getLocationByAddressFn = function(address, cb) {
      $scope.geocoder.geocode({
        address: address
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          cb(null, {
            longitude: results[0].geometry.location.lng(),
            latitude: results[0].geometry.location.lat()
          });
        } else {
          cb(status, null);
        }
      });
    };

    $scope.searchFn = function() {
      esClient.search({
        index: 'ftm',
        type: 'establishment',
        from: ($scope.currentPage - 1) * $scope.pageLimit,
        size: $scope.pageLimit,
        body: ejs.Request().query(ejs.MatchQuery('BusinessName', $scope.query))
      }).then(function(resp) {
        $scope.totalItems = resp.hits.total;
        $scope.hits = resp.hits.hits;
        $scope.hitMarkers = [];
        $scope.hits.forEach(function(value, index) {
          if (value._source.geocode) {
            $scope.hitMarkers.push({
              longitude: value._source.geocode[0],
              latitude: value._source.geocode[1],
              id: value._source._id,
              title: value._source.BusinessName
            });
          } else {
            var address = [];
            if (value._source.AddressLine1) {
              address.push(value._source.AddressLine1);
            }
            if (value._source.AddressLine2) {
              address.push(value._source.AddressLine2);
            }
            if (value._source.AddressLine3) {
              address.push(value._source.AddressLine3);
            }
            if (value._source.AddressLine4) {
              address.push(value._source.AddressLine4);
            }
            if (value._source.PostCode) {
              address.push(value._source.PostCode);
            }
            $scope.getLocationByAddressFn(address.join(','), function(err, location) {
              location.id = value._source._id;
              location.title = value._source.BusinessName;
              $scope.hitMarkers.push(location);
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
        $scope.totalItems = 0;
        $scope.currentPage = 1;
      }
    });

    uiGmapGoogleMapApi.then(function(maps) {
      $scope.geocoder = new maps.Geocoder();
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

    $scope.setPage = function(pageNo) {
      $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
      $scope.searchFn();
    };
  }
]);
