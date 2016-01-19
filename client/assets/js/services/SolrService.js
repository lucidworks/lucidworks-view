angular.module('fusionSeedApp.services.solr', ['fusionSeedApp.services.configApi'])
  .service('SolrService', function(ConfigApiService){
    console.log(ConfigApiService.getFusionURL());

    var makeQuery = function(query, queryParams){
      return $http.get(ConfigApiService.getFusionURL()); //TODO
    };

    return {
      makeQuery: makeQuery
    };
  });
