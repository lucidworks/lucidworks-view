

(function() {
    'use strict';

    angular
        .module('fusionSeedApp.services.apiBase', ['fusionSeedApp.services.config'])
        .provider('ApiBase', ApiBase);

    //ApiBase.$inject = [];

    /* @ngInject */
    function ApiBase() {
      var self = this;
      self.endpoint =  '';
      this.$get = get;
      this.setEndpoint = setEndpoint;
      this.getEndpoint = getEndpoint;

      function setEndpoint(endoint) {
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
