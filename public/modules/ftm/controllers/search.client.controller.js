// 'use strict';

angular.module('ftm').controller('SearchController', ['$scope', 'Es', 'uiGmapGoogleMapApi',
  function($scope, Es, uiGmapGoogleMapApi) {
    var esClient = Es.client();

    $scope.hitMarkers = [];
		$scope.markerControl = {};

    $scope.totalItems = 0;
    $scope.currentPage = 1;
    $scope.pageLimit = 2;

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
      console.log('search called');
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
