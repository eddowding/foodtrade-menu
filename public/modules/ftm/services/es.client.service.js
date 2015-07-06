'use strict';

angular.module('ftm').factory('Es', ['esFactory',

  function(esFactory) {
    // Es service logic
    // ...

    // Public API
    return {
      client: function() {
        return esFactory({
          host: 'localhost:9200'
        });
      }
    };
  }
]);
