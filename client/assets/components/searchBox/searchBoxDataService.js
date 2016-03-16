(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.searchbox')
    .factory('SearchBoxDataService', SearchBoxDataService);

  function SearchBoxDataService($log, $http, $q, ConfigService, ApiBase, QueryBuilder, QueryDataService){
    'ngInject';

    return {
      getTypeaheadResults: getTypeaheadResults
    };

    ////////////

    /**
     * [getTypeaheadResults Makes a separate query for typeahead response]
     *
     * @param  {} query [The actual query]
     * @return {[Angular promise]} [The response promise that resolves/gets
     * rejected when Fusion returns the typeahead query results]
     */
    function getTypeaheadResults(query){
      var deferred = $q.defer();

      var queryString = QueryBuilder.objectToURLString(query);

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
     * [getQueryUrl Gets the apropriate query URL]
     * @param  {Boolean} isProfile [If the query should be over profiles]
     * @return {[type]}            [If the query should be over pipelines]
     */
    function getQueryUrl(isProfile){
      var requestHandler = ConfigService.getTypeaheadRequestHandler();

      var profileUrl = QueryDataService.getProfileEndpoint(ConfigService.getTypeaheadProfile(), requestHandler);

      var pipelineUrl = QueryDataService.getPipelineEndpoint(ConfigService.getTypeaheadPipeline(), requestHandler);

      return isProfile?profileUrl:pipelineUrl;
    }

  }
})();
