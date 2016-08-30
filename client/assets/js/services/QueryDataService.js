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
    OrwellProvider.createObservable('mltResults', {poop:"poop"});
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
        getMltQueryResults: getMltQueryResults,
        getMltQueryUrl: getMltQueryUrl
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

        console.log("In getqueryresults and trying to access mlt pipeline");
        var fullUrl = getQueryUrl(ConfigService.getIfQueryProfile()) + '?' + queryString;
        console.log(fullUrl);

        $http
          .get(fullUrl)
          .then(success)
          .catch(failure);

        function success(response) {
          console.log("Success!!!! getting response");
          console.log(response);
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


      function getMltQueryResults(query, id) {
        var deferred = $q.defer();

        var queryString = QueryBuilder.objectToURLString(query);

        var fullUrl = getMltQueryUrl() + '?' + queryString;
        console.log('urllll', fullUrl);

        $http
          .get(fullUrl)
          .then(success)
          .catch(failure);

        function success(response) {
          console.log('responseeee', response.data.moreLikeThis);
          mltResultsObservable.setContent(response.data.moreLikeThis);
          deferred.resolve(response.data.moreLikeThis);
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

      function getMltQueryUrl(){
        var pipelinesEndpoint = getPipelineEndpoint(ConfigService.getMltPipeline(), 'select');
        return pipelinesEndpoint;
      }

    }
  }
})();
