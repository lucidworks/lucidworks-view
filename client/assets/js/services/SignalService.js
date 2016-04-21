(function () {
  'use strict';

  angular
    .module('lucidworksView.services.signals', ['lucidworksView.services.apiBase',
      'lucidworksView.services.config'
    ])
    .factory('SignalsService', SignalsService);

  function SignalsService(ApiBase, ConfigService, $http, $q, QueryService) {
    'ngInject';
    var service = {
      postClickSignal: postClickSignal,
      postSignalData: postSignalData,
      getSignalsDocumentId: getSignalsDocumentId
    };

    return service;
    //Helper method for document click events
    function postClickSignal(docId, query, filterQueries, weight, type) {
      if (!query){
        query = QueryService.getQueryObject().q
      }
      if (!type){
        type = ConfigService.config.signal_type
      }
      console.log(ConfigService.config);
      var date = new Date(),
        data = [{
          params: {
            query: query,
            docId: docId
          },
          type: type,
          timestamp: date.toISOString(),
          pipeline: ConfigService.config.signals_pipeline
        }];
      if (filterQueries){
        data["params"]["filterQueries"] = filterQueries;
      }
      if (weight){
        data["params"]["weight"] = weight;
      }
      return postSignalData(data);
    }

    //Use if you want to post a raw signal where you have control of every signal entry.  See postClickSignal for an example data structure
    function postSignalData(data) {
      var deferred = $q.defer();
      console.log(data);
      $http
        .post(ApiBase.getEndpoint() + 'api/apollo/signals/' + ConfigService.config.collection,
          data)
        .then(success)
        .catch(failure);

      function success(response) {
        deferred.resolve(response.data);
      }

      function failure(err) {
        deferred.reject(err.data);
      }

      return deferred.promise;
    }

    /**
     * Given a document return a signals document ID value.
     * @param  {object} doc The document
     * @return {string|Number}     The document ID value
     */
    function getSignalsDocumentId(doc) {
      var documentIdField = ConfigService.config.signalsDocumentId;
      if (doc.hasOwnProperty(documentIdField)) {
        return doc[documentIdField];
      }
      return null;
    }
  }
})();
