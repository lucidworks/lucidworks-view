(function () {
  angular
    .module('lucidworksView.services.queryData', [
      'lucidworksView.services.config',
      'lucidworksView.services.apiBase',
      'lucidworksView.utils.queryBuilder',
      'ngOrwell'
    ])
    .config(Config)
    .provider('QueryDataService', QueryDataService);


  function Config(OrwellProvider) {
    'ngInject';
    OrwellProvider.createObservable('queryResults', {});
    OrwellProvider.createObservable('mltResults', {});
    OrwellProvider.createObservable('mltResults2', {});
  }

  function QueryDataService() {

    this.$get = $get;

    /////////////

    function $get($q, $http, ConfigService, ApiBase, Orwell, QueryBuilder) {
      'ngInject';
      var queryResultsObservable = Orwell.getObservable('queryResults');
      var mltResultsObservable = Orwell.getObservable('mltResults');
      return {
        getQueryResults: getQueryResults,
        getProfileEndpoint: getProfileEndpoint,
        getPipelineEndpoint: getPipelineEndpoint,
        getMoreLikeThisResults: getMoreLikeThisResults
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
          queryResultsObservable.setContent({
            numFound: 0
          });
          deferred.reject(err.data);
        }

        return deferred.promise;
      }

      /**
       * Make a query to the query profiles endpoint
       * @param  {object} query  Should have all the query params, like
       *                         For select?q=query&fq=blah you need to pass in an object
       *                         {'q': 'query', 'fq': 'blah'}
       * @param {boolean} object Boolean specifying whether to use the default mlt query pipeline
       *                         or not. 
       * @return {Promise}       Promise that resolve with a Fusion response coming from Solr
       */
      function getMoreLikeThisResults(query, pipeline) {
        var deferred = $q.defer();

        var queryString = QueryBuilder.objectToURLString(query);
        var fullUrl; 
        if (pipeline == true) {
          fullUrl = getMltQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;
        }
        else {
          fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;
        }

        $http
          .get(fullUrl)
          .then(success)
          .catch(failure);

        function success(response) {
          mltResultsObservable.setContent(response.data);
          deferred.resolve(response.data);
        }

        function failure(err) {
          mltResultsObservable.setContent({
            numFound: 0
          });
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
        var profilesEndpoint = getProfileEndpoint(ConfigService.getQueryProfile(), 'select');
        var pipelinesEndpoint = getPipelineEndpoint(ConfigService.getQueryPipeline(), 'select');

        return isProfiles ? profilesEndpoint : pipelinesEndpoint;
      }

      /**
       * Returns the appropriate base url for a more like this endpoint, namely the one
       * containing the default_mlt pipeline
       *
       * @param  {Boolean} isProfiles Determines which endpoint type to return;
       * @return {string}             The URL endpoint for the query without parameters.
       */
      function getMltQueryUrl(){
        var pipelinesEndpoint = getPipelineEndpoint(ConfigService.getRecommenderPipeline(), 'select');
        return pipelinesEndpoint;
      }

      function getProfileEndpoint(profile, requestHandler){
        return ApiBase.getEndpoint() + 'api/apollo/collections/' +
          ConfigService.getCollectionName() + '/query-profiles/' +
          profile + '/' + requestHandler;
      }

      function getPipelineEndpoint(pipeline, requestHandler){
        return ApiBase.getEndpoint() + 'api/apollo/query-pipelines/' +
          pipeline + '/collections/' + ConfigService.getCollectionName() +
          '/' + requestHandler;
      }

    }
  }
})();
