(function () {
  angular.module('fusionSeedApp.services.queryData', [
      'fusionSeedApp.services.config',
      'fusionSeedApp.services.apiBase',
      'fusionSeedApp.utils.dataTransform'
    ])
    .config(Config)
    .provider('QueryDataService', QueryDataService);

  Config.$inject = ['OrwellProvider'];

  function Config(OrwellProvider) {
    OrwellProvider.createObservable('queryResults', {});
  }

  function QueryDataService() {

    this.$get = ['$log', '$q', '$http', 'ConfigService', 'ApiBase', 'Orwell',
      'QueryBuilder',
      $get
    ];

    /////////////

    function $get($log, $q, $http, ConfigService, ApiBase, Orwell,
      QueryBuilder) {
      var queryResultsObservable = Orwell.getObservable('queryResults');
      return {
        getQueryResults: getQueryResults
      };

      /**
       * Make a query to the query profiles endpoint
       * @param  {object} query  Should have all the query params, like
       *                         For select?q=query&fq=blah you need to pass in an object
       *                         {'q': 'query', 'fq': 'blah'}
       * @return {Promise}       Promise that resolve with a Fusion response coming from Solr
       */
      function getQueryResults(query) {
        var deferred = $q.defer();

        var queryString = QueryBuilder.objectToURLString(query);

        var fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;

        $http
          .get(fullUrl)
          .then(success)
          .catch(failure);

        function success(response) {
          // Set the content to populate the rest of the ui.
          queryResultsObservable.setContent(response.data);
          deferred.resolve(response.data);
        }

        function failure(err) {
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
      function getQueryUrl(isProfiles) {
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

        return isProfiles ? profilesEndpoint : pipelinesEndpoint;
      }

    }
  }
})();
