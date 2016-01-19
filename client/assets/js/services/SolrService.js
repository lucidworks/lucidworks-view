angular.module('fusionSeedApp.services.solr', ['fusionSeedApp.services.config'])
  .service('SolrService', function(ConfigService){
    console.log(ConfigService.getFusionURL());

    var makeQuery = function(query, queryParams){
      return $http.get(ConfigService.getFusionURL()); //TODO
    };

    return {
      makeQuery: makeQuery
    };
  });
