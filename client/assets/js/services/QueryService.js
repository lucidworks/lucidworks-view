(function(){
  angular.module('fusionSeedApp.services.query',
    ['fusionSeedApp.services.config', 'fusionSeedApp.services.apiBase'])
    .config(Config)
    .provider('QueryService', QueryService);

    Config.$inject = ['OrwellProvider'];

    function Config(OrwellProvider){
      OrwellProvider.createObservable('query',{});
    }

    function QueryService(){

      this.$get = ['$q', '$http', 'ConfigService', 'ApiBase', $get];

      /////////////

      function $get($q, $http, ConfigService, ApiBase){
        return {
          getQuery: getQuery
        };

        // Internal functions
        function getQueryUrl(isProfiles){
          var profilesEndpoint = ApiBase.getEndpoint() +
            '/api/apollo/collections/' +
            ConfigService.getCollectionName() +
            '/query-profiles/' +
            ConfigService.getQueryProfile() +
            '/select';

          var pipelinesEndpoint = ApiBase.getEndpoint() +
            '/api/apollo/query-pipelines/' +
            ConfigService.getQueryPipeline() +
            '/collection/' +
            ConfigService.getCollectionName() +
            '/select';

          return isProfiles?profilesEndpoint:pipelinesEndpoint;
        }

        /**
         * Make a query to the query profiles endpoint
         * @param  {object} query  Should have all the query params, like
         * For select?q=query&fq=blah you need to pass in an object
         * {'q': 'query', 'fq': 'blah'}
         * @return {Promise}       Promise that resolve with a Fusion response coming from Solr
         */
        function getQuery(query){
          var deffered = $q.defer();

          var queryObject = angular.copy(query);
          queryObject.wt='json'; //Force JSON returns
          var queryString = _.reduce(queryObject, function(str, value, key){
            return str + ((str!=='')?'&':'') + key + '=' + value;
          },'');

          var fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;

          $http.get(fullUrl)
            .then(function(response){
              deffered.resolve(response.data);
            })
            .catch(function(err){
              deffered.reject(err.data);
            });

          return deffered.promise;
        }
      }
    }
})();
