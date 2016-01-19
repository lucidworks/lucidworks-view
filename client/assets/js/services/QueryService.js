angular.module('fusionSeedApp.services').service('QueryService', function($q, $http, ConfigApiService){

  /**
   * [Make a query to the query profiles endpoint]
   * @param  {[Object]} query [Should have all the query params]
   * @return {[Promise]}       [Promise that resolve with a Fusion response coming from Solr]
   */
  var makeQuery = function(query){
    var def = $q.defer();

    queryObject = query.q;

    var queryObject = angular.copy(query);

    $http.get(
      ConfigApiService.getFusionUrl() +
      '/api/apollo/collections/' +
      ConfigApiService.getCollectionName() +
      '/query-profiles/' +
      ConfigApiService.getQueryProfile() +
      '/select?q=' +
      queryObject.q)
    .then(function(response){
      def.resolve(response);
    })
    .catch(function(err){
      def.reject(err);
    });

    return def.promise;
  };

  return {
    makeQuery: makeQuery
  };
});
