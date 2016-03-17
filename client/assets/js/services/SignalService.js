(function () {
  'use strict';

  angular
    .module('fusionSeedApp.services.signals', ['fusionSeedApp.services.apiBase',
      'fusionSeedApp.services.config'
    ])
    .factory('SignalsService', SignalsService);

  function SignalsService(ApiBase, ConfigService, $http, $q, QueryService) {
    'ngInject';
    var service = {
      postSignal: postSignal,
      getSignalsDocumentId: getSignalsDocumentId
    };

    return service;

    /**
     * [postSignal Posts a signal to Fusion associated with a docID
     * https://lucidworks.com/blog/2015/03/23/mixed-signals-using-lucidworks-fusions-signals-api/]
     *
     * @param  {String} docId
     * [The document ID that will be
     * associated with the signal entry]
     * @return {[Angular Promise]}
     * [A promise of the response that we comes from Fusion after the signal post]
     */
    function postSignal(docId) {
      var deferred = $q.defer(),
        date = new Date(),
        data = [{
          params: {
            query: QueryService.getQueryObject().q,
            docId: docId
          },
          type: ConfigService.config.signalType,
          timestamp: date.toISOString(),
          pipeline: ConfigService.config.signalsPipeline
        }];
      // set content header

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
     * [getSignalsDocumentId Given a document return a signals document ID value.]
     * @param  {String} doc [The document]
     * @return {String}     [The document ID value]
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
