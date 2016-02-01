(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.typeahead')
    .service('TypeaheadService', TypeaheadService);

  TypeaheadService.$inject = ['$log', '$http', 'ConfigService', 'ApiBase'];
  function TypeaheadService($log, $http, ConfigService, ApiBase){
    console.log();
    var endpoint = ApiBase.getEndpoint();

    return {
      makeRequest: makeRequest
    };

    function makeRequest(){
      var isProfile = ConfigService.getIfTypeaheadProfile() || null;

    }

    function buildUrl(isProfile){
      var profileUrl = endpoint;
    }

  }
})();
