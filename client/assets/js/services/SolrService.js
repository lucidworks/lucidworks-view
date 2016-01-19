angular.module('fusionSeedApp.services.solr', ['fusionSeedApp.services.config'])

  .service('SolrService', function(ConfigService){
    console.log(ConfigService.getFusionURL());

    return {
      makeQuery: makeQuery
    };

    function makeQuery(query, queryParams){
      return $http.get(ConfigService.getFusionURL()); //TODO
    }

  });
