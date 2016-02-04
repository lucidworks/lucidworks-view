/*global _*/
(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.typeahead')
    .factory('TypeaheadService', TypeaheadService);

  //TODO: Combine this with queryservice (refactor)

  function TypeaheadService($log, $http, $q, ConfigService, ApiBase, QueryBuilder, QueryDataService){
    'ngInject';

    return {
      getQueryResults: getQueryResults
    };

    ////////////

    function getQueryResults(query){
      var deferred = $q.defer();

      var queryString = QueryBuilder.objectToURLString(_.assign(query,{wt:'json'}));

      var fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;

      $http
        .get(fullUrl)
        .then(success)
        .catch(failure);

      function success(response) {
        deferred.resolve(response.data);
      }

      function failure(err) {
        deferred.reject(err.data);
      }

      return deferred.promise;
    }

    /**
     * Private function
     */
    function getQueryUrl(isProfile){
      var requestHandler = ConfigService.getTypeaheadRequestHandler();

      var profileUrl = QueryDataService.getProfileEndpoint(ConfigService.getTypeaheadProfile(), requestHandler);

      var pipelineUrl = QueryDataService.getPipelineEndpoint(ConfigService.getTypeaheadPipeline(), requestHandler);

      return isProfile?profileUrl:pipelineUrl;
    }

  }
})();
