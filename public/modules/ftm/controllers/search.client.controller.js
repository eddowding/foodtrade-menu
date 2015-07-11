// 'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es', 'uiGmapGoogleMapApi', '$timeout',
  function($scope, Es, uiGmapGoogleMapApi, $timeout) {
    $scope.isSearchView = true;
    $scope.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(location) {
        $scope.myLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        };
        $scope.map.center.latitude = location.coords.latitude;
        $scope.map.center.longitude = location.coords.longitude;
      });
    } else {
      $scope.myLocation = {
        latitude: 45,
        longitude: -73
      };
      console.info('Geo Location is not supported');
    }

    var esClient = Es.client();

    $scope.mapControl = {};
    $scope.hitMarkers = [];
    $scope.markerControl = {};

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

    $scope.getAddressByEstablishmentFn = function(establishment) {
      if (!establishment) {
        return '';
      }
      var address = [];
      if (establishment._source.AddressLine1) {
        address.push(establishment._source.AddressLine1);
      }
      if (establishment._source.AddressLine2) {
        address.push(establishment._source.AddressLine2);
      }
      if (establishment._source.AddressLine3) {
        address.push(establishment._source.AddressLine3);
      }
      if (establishment._source.AddressLine4) {
        address.push(establishment._source.AddressLine4);
      }
      if (establishment._source.PostCode) {
        address.push(establishment._source.PostCode);
      }
      return address.join(', ');
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
        $scope.markerControl.clean();
        $scope.hits.forEach(function(value, index) {
          if (value._source.geocode) {
            $scope.hitMarkers.push({
              longitude: value._source.geocode[0],
              latitude: value._source.geocode[1],
              id: value._source._id,
              title: value._source.BusinessName
            });
            $scope.markerControl.managerDraw();
          } else {
            $scope.getLocationByAddressFn($scope.getAddressByEstablishmentFn(value), function(err, location) {
              if (location) {
                value._source.geocode = [location.longitude, location.latitude];
                $scope.hitMarkers.push({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  id: value._source._id,
                  title: value._source.BusinessName
                });
                $scope.markerControl.managerDraw();
              }
            });
          }
        });
        $scope.markerControl.managerDraw();
        $timeout(function() {
          $scope.mapControl.refresh();
        }, 500);
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

    $scope.showDetailViewFn = function(hit) {
      $scope.isSearchView = false;
      $scope.detailViewHit = hit;
      $scope.hitMarkers = [{
        longitude: hit._source.geocode[0],
        latitude: hit._source.geocode[1],
        id: hit._source._id,
        title: hit._source.BusinessName
      }];
      $scope.map.center.latitude = hit._source.geocode[1];
      $scope.map.center.longitude = hit._source.geocode[0];
    };

    $scope.showSearchViewFn = function() {
      $scope.isSearchView = true;
      $scope.searchFn();
    };
  }
]);
