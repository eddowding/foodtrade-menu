'use strict';

// Grids controller
angular.module('grids').controller('GridCreateSignupController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Grids', 'SweetAlert', '$state', 'Users', 'Accounts', 'Establishments', '$http', '$timeout',
  function($scope, $rootScope, $stateParams, $location, Authentication, Grids, SweetAlert, $state, Users, Accounts, Establishments, $http, $timeout) {
    $scope.authentication = Authentication;
    //onboarding
    $scope.onboardingEnabled = false;

    $timeout(function () {
      $('.cell-edit-new:first').trigger('click');
      $scope.onboardingEnabled = true;
    }, 2000);

    $scope.onboardingSteps = [

        {
      title: "Welcome",
      position: "centered",
      description: "Welcome to FoodTrade. Let's take a 20 second tour so show you how this works."
    }, 

    {
      title: "Dish Input",
      position: "top",
      description: "Just start typing your first dish to get started",
      attachTo: "td.itemname",
      xOffset: "-80",
    }, {
      title: "Detail Links",
      position: "top",
      description: "You can add a description, price, and other characteristics. These are not required.",
      attachTo: ".actions"
    }, {
      title: "Diet Select",
      position: "top",
      description: "Say if the dish is vegetarian, vegan, pescatarian...",
      attachTo: ".veggie-select"
    }, {
      title: "Allergen Box",
      position: "top",
      description: "Click the box if it contains an allergen. Allergens can be removable or fixed, and some require more details",
    //   attachTo: ".cell-edit-new:first"
      attachTo: "#allergygrid .newdish td:nth-child(4)"
    },

    //  {
    //   title: "Menu Name",
    //   position: "centered",
    //   description: "You can change the name of your menu. You can have unlimited menus, so maybe have one for different seasons or times of day",
    //   attachTo: "#name"
    // },
    // {
    //   title: "Share Links",
    //   position: "bottom",
    //   description: "Since we're in the top left corner, please share us if you like it. We're free and your clicks make us want to do more",
    //   attachTo: ".btn-twitter"
    // },

    {
      title: "Save Button",
      position: "centered",
      description: "Save your list by clicking the green 'Save' button at the top of the page",
      attachTo: "#save .save"
    },

    // {
    //   title: "Help Link in Header",
    //   position: "centered",
    //   description: "Click 'help' in the top right for more information and tips"
    // }

    ];
    $scope.onboardingIndex = 0;
    $scope.onboardingFinishFn = function() {
      console.log('Onboard finished');
    };


    // Create new Grid
    $scope.grid = {
      name: "My Menu (" + moment().format('Do MMM') + ")"
    };
    $scope.user = {};
    $scope.account = {};
    $scope.establishment = {};

    $scope.isSaveBtnClicked = false;
    $rootScope.enableSaveBtn = false;
    $scope.$watch('grid.name', function(newValue, oldValue) {
      if (newValue) {
        $rootScope.enableSaveBtn = true;
      } else {
        $rootScope.enableSaveBtn = false;
      }
    });
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (!$scope.isSaveBtnClicked && $rootScope.$state.includes('createGrid')) {
        event.preventDefault();
        SweetAlert.swal({
            title: "Are you sure?",
            text: "You're about to leave this page without saving!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: true
          },
          function(isConfirm) {
            if (isConfirm) {
              $scope.isSaveBtnClicked = true;
              $state.go(toState, toParams);
            }
          });
      }
    });

    $scope.create = function() {
      // Create new Grid object
      $scope.isSaveBtnClicked = true;
      var grid = new Grids($scope.grid);

      // Redirect after save
      grid.$save(function(response) {
        analytics.track('Grid Created', {
          gridId: response._id,
          gridName: response.name
        });
        $location.path('grids/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    $scope.signupSubmitFn = function() {
      $scope.user.username = $scope.user.email;
      $http.post('/auth/signup', $scope.user).success(function(response) {
        $scope.authentication.user = response;
        analytics.identify(response._id, {
          name: response.displayName,
          email: response.email
        });
        $scope.account.user = response._id;
        Accounts.save($scope.account)
          .$promise
          .then(function(account) {
            $scope.account = account;
            analytics.track('Account Created', {
              accountId: account._id
            });
          });
        $scope.establishment.user = response._id;
        Establishments.save($scope.establishment)
          .$promise
          .then(function(establishment) {
            $scope.establishment = establishment;
            analytics.track('Establishment Created', {
              establishmentId: establishment._id,
              businessName: establishment.BusinessName
            });
          });
        $scope.create();
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function() {
      $http.post('/auth/signin', $scope.user).success(function(response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        analytics.identify(response._id, {
          name: response.displayName,
          email: response.email
        });
        $scope.grid.user = response._id;
        Grids.save($scope.grid)
          .$promise
          .then(function(grid) {
            analytics.track('Grid Created', {
              gridId: grid._id,
              gridName: grid.name
            });
            $location.path('/dashboard');
          });
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.establishmentFsaSuggestionFn = function() {
      var postcode = $scope.establishment.PostCode;
      if (!postcode) {
        $scope.fsaEstablishments = [];
        return;
      }
      if (postcode.length >= 3) {
        var fsaReq = {
          method: 'GET',
          url: 'http://api.ratings.food.gov.uk/Establishments',
          params: {
            address: postcode.slice(0, 3)
          },
          headers: {
            'x-api-version': 2
          }
        };

        $http(fsaReq).success(function(data) {
          $scope.establishment.BusinessName = null;
          $scope.fsaEstablishments = data.establishments;
        });
      }
    };

    $scope.selectFsaEstFn = function(fsaEst) {
      $scope.establishment = fsaEst;
    };

    $scope.$watch('fullName', function(newValue, oldValue) {
      if (newValue) {
        var nameSplit = newValue.split(' ');
        if (nameSplit.length > 0) {
          if (nameSplit.length == 1) {
            $scope.user.firstName = nameSplit[0];
          } else {
            $scope.user.firstName = nameSplit[0];
            $scope.user.lastName = nameSplit[nameSplit - 1];
          }
        }
      }
    });
  }
]);
