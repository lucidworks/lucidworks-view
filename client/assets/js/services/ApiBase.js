(function() {
    'use strict';

    angular
        .module('fusionSeedApp.services.apiBase', [])
        .provider('ApiBase', ApiBase);

    ApiBase.$inject = [];

    /* @ngInject */
    function ApiBase() {
      var self = this;
      self.endpoint =  '';
      self.$get = get;
      self.setEndpoint = setEndpoint;
      self.getEndpoint = getEndpoint;

      function setEndpoint(endpoint) {
        self.endpoint = endpoint;
      }

      function getEndpoint(){
        return self.endpoint;
      }

      function get() {
        return {
          getEndpoint: getEndpoint,
          setEndpoint: setEndpoint
        };
      }
    }
})();
