'use strict';

angular.module('ftm').factory('Es', ['esFactory', '$location',

  function(esFactory, $location) {
    // Es service logic
    // ...

    // Public API
    return {
      client: function() {
        return esFactory({
          host: $location.host() + ':9200'
        });
      }
    };
  }
]);
