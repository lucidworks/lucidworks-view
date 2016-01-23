(function(){
  angular.module('fusionSeedApp.services.query',
    ['fusionSeedApp.services.config', 'fusionSeedApp.services.apiBase'])
    .config(Config)
    .constant('QUERY_OBJECT_DEFAULT', {
      // Force return of JSON
      wt: 'json'
    })
    .provider('QueryService', QueryService);

  Config.$inject = ['OrwellProvider'];

  function Config(OrwellProvider){
    OrwellProvider.createObservable('query',{});
  }

  function QueryService(){

    this.$get = ['$q', '$http', 'ConfigService', 'ApiBase', 'Orwell', 'QUERY_OBJECT_DEFAULT', $get];

    /////////////

    function $get($q, $http, ConfigService, ApiBase, Orwell, QUERY_OBJECT_DEFAULT){
      var queryObservable = Orwell.getObservable('query');
      return {
        getQuery: getQuery
      };

      /**
       * Make a query to the query profiles endpoint
       * @param  {object} query  Should have all the query params, like
       *                         For select?q=query&fq=blah you need to pass in an object
       *                         {'q': 'query', 'fq': 'blah'}
       * @return {Promise}       Promise that resolve with a Fusion response coming from Solr
       */
      function getQuery(query){
        var deferred = $q.defer();

        var queryObject = _.assign({}, QUERY_OBJECT_DEFAULT, query);

        var queryString = QueryObjectToString(queryObject);

        var fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;

        $http.get(fullUrl)
          .then(success)
          .catch(failure);

        function success(response){
          // Set the content to populate the rest of the ui.
          queryObservable.setContent(response.data);
          deferred.resolve(response.data);
        }

        function failure(err){
          deferred.reject(err.data);
        }

        return deferred.promise;
      }

      /**
       * Returns the appropriate base url for an endpoint
       *
       * @param  {Boolean} isProfiles Determines which endpoint type to return;
       * @return {string}             The URL endpoint for the query without parameters.
       */
      function getQueryUrl(isProfiles){
        var profilesEndpoint = ApiBase.getEndpoint() +
          'api/apollo/collections/' +
          ConfigService.getCollectionName() +
          '/query-profiles/' +
          ConfigService.getQueryProfile() +
          '/select';

        var pipelinesEndpoint = ApiBase.getEndpoint() +
          'api/apollo/query-pipelines/' +
          ConfigService.getQueryPipeline() +
          '/collection/' +
          ConfigService.getCollectionName() +
          '/select';

        return isProfiles?profilesEndpoint:pipelinesEndpoint;
      }

      /**
       * Turns a Query Object into a String
       * @param {object} obj The query object to turn into a string
       * @return {string}
       */
      function QueryObjectToString(obj){
        return _.reduce(obj, function(str, value, key){
          return str + ((str!=='')?'&':'') + key + '=' + value;
        },'');
      }

    }
  }
})();
