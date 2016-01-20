angular.module('fusionSeedApp.services.solr', ['fusionSeedApp.services.config', 'fusionSeedApp.services.apiBase'])

  .service('SolrService', function(ConfigService){
    return {
      makeQuery: makeQuery
    };

    function makeQuery(query, queryParams){
      return $http.get(ApiBase.getEndpoint()); //TODO
    }

  });
