angular.module('fusionSeedApp.services.query', ['fusionSeedApp.services.configApi'])
  .service('QueryService', function($q, $http, ConfigApiService){

    return {
      makeQuery: makeQuery
    };

    /**
     * Make a query to the query profiles endpoint
     * @param  {object} query  Should have all the query params
     * @return {Promise}       Promise that resolve with a Fusion response coming from Solr
     */
    function makeQuery(query){
      var deffered = $q.defer();

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
          deffered.resolve(response);
        })
        .catch(function(err){
          deffered.reject(err);
        });

      return deffered.promise;
    }
  });
