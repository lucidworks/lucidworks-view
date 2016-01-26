(function () {
  'use strict';

  angular
    .module('fusionSeedApp.service.signals', ['fusionSeedApp.services.apiBase',
      'fusionSeedApp.services.config'
    ])
    .factory('SignalsService', SignalsService);

  SignalsService.$inject = ['ApiBase', 'ConfigService', '$http', '$q', 'QueryService'];

  /* @ngInject */
  function SignalsService(ApiBase, ConfigService, $http, $q, QueryService) {
    var service = {
      postSignal: postSignal
    };

    return service;

    function postSignal(doc) {
      var deferred = $q.defer(),
        date = new Date(),
        data = [{
          params: {
            query: QueryService.getQueryObject().q,
            docId: getSignalsDocumentId(doc)
          },
          type: ConfigService.config.signalType,
          timestamp: date.toISOString(),
          pipeline: ConfigService.config.signalsPipeline
        }];

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
