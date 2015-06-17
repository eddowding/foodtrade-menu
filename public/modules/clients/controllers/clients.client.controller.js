'use strict';

// Clients controller
angular.module('clients').controller('ClientsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Clients', '$http', 'Upload',
  function($scope, $stateParams, $location, Authentication, Clients, $http, Upload) {
    $scope.authentication = Authentication;
		$scope.uploadMsg = 'Click to upload asset';
		
    $http.get('/s3/policy')
      .success(function(data) {
        $scope.policy = data.policy;
        $scope.signature = data.signature;
      });

    $scope.upload = function(files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          Upload.upload({
            url: 'https://foodtrademenu.s3-website-eu-west-1.amazonaws.com/', //S3 upload url including bucket name
            method: 'POST',
            fields: {
              key: 'logos/' + file.name, // the key to store the file on S3, could be file name or customized
              AWSAccessKeyId: 'AKIAJCJT3UGC75BPM72Q',
              acl: 'public-read', // sets the access to the uploaded file in the bucket: private or public
              policy: $scope.policy, // base64-encoded json policy (see article below)
              signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
              "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
              "Content-Length": ''
            },
            file: file,
          }).progress(function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.uploadMsg = 'progress: ' + progressPercentage + '% ' + evt.config.file.name;
          }).success(function(data, status, headers, config) {
            $scope.uploadMsg = 'file ' + config.file.name + ' uploaded.';
            $scope.client.logo = 'https://s3.amazonaws.com/foodtrademenu/logos/' + config.file.name;
          });
        }
      }
    };
    // Create new Client
    $scope.create = function() {
      // Create new Client object
      var client = new Clients($scope.client);

      // Redirect after save
      client.$save(function(response) {
        $location.path('clients/' + response._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Client
    $scope.remove = function(client) {
      if (client) {
        client.$remove();

        for (var i in $scope.clients) {
          if ($scope.clients[i] === client) {
            $scope.clients.splice(i, 1);
          }
        }
      } else {
        $scope.client.$remove(function() {
          $location.path('clients');
        });
      }
    };

    // Update existing Client
    $scope.update = function() {
      var client = $scope.client;

      client.$update(function() {
        $location.path('clients/' + client._id);
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Clients
    $scope.find = function() {
      $scope.clients = Clients.query();
    };

    // Find existing Client
    $scope.findOne = function() {
      $scope.client = Clients.get({
        clientId: $stateParams.clientId
      });
    };
  }
]);
