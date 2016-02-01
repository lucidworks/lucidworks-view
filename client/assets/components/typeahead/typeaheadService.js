(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.typeahead')
    .service('TypeaheadService', TypeaheadService);

  TypeaheadService.$inject = ['$log', '$http', '$q', 'ConfigService', 'ApiBase', 'QueryBuilder'];
  function TypeaheadService($log, $http, $q, ConfigService, ApiBase, QueryBuilder){
    var endpoint = ApiBase.getEndpoint();
    var collectionName = ConfigService.getCollectionName();
    var requestHandler = ConfigService.getTypeaheadRequestHandler();
    var profile = ConfigService.getTypeaheadProfile();
    var pipeline = ConfigService.getTypeaheadPipeline();

    return {
      getQueryResults: getQueryResults
    };

    function getQueryResults(query){
      var deferred = $q.defer();
      var queryString = QueryBuilder.objectToURLString(query);
      var fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;

      $http
        .get(fullUrl)
        .then(success)
        .catch(failure);

      function success(response) {
        // Set the content to populate the rest of the ui.
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
      var profileUrl = endpoint +
        'api/apollo/collections/' +
        collectionName +
        '/query-profiles/' +
        profile + '/' +
        requestHandler;

      var pipelineUrl = endpoint +
        'api/apollo/query-pipelines/' +
        pipeline +
        '/collection/' +
        collectionName + '/' +
        requestHandler;

      return isProfile?profileUrl:pipelineUrl;
    }

  }
})();
