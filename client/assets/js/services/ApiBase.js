(function() {
  'use strict';

  angular
    .module('lucidworksView.services.apiBase', [])
    .provider('ApiBase', ApiBase);


  function ApiBase() {
    'ngInject';
    var self = this;
    self.endpoint = '';
    self.$get = get;
    self.setEndpoint = setEndpoint;
    self.getEndpoint = getEndpoint;

    function setEndpoint(endpoint) {
      self.endpoint = endpoint;
    }

    function getEndpoint() {
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
