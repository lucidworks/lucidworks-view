angular.module('fusionSeedApp.services').service('SolrService', function(ConfigApiService){
  console.log(ConfigApiService.getFusionURL());

  var makeQuery = function(query, extraParams){
    return $http.get(ConfigApiService.getFusionURL()); //TODO
  };

  return {
    makeQuery: makeQuery
  };
});
