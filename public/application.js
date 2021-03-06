'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]).config(['ngClipProvider', '$httpProvider', 'uiGmapGoogleMapApiProvider', function(ngClipProvider, $httpProvider, uiGmapGoogleMapApiProvider) {
  ngClipProvider.setPath("lib/zeroclipboard/dist/ZeroClipboard.swf");
  $httpProvider.useApplyAsync(true);
  uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
       v: '3.17',
       libraries: 'weather,geometry,visualization,places'
   });
}]).run(function($rootScope, $state, $stateParams) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
}).run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') window.location.hash = '#!';

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
