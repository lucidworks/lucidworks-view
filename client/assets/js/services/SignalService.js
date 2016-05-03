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

    /**
     * Helper method to document click events.
     * @param  {string} docId   The document id
     * @param  {object} params  An object containing parameter overrides and options.
     *   query         -  an override of the query to return to the signal.
     *   type          -  the signal type to use for the signal
     *
     * @return {promise}
     */
    function postClickSignal(docId, params) {
      var defaults = {
        query: QueryService.getQueryObject().q,
        type: ConfigService.config.signal_type
      };
      _.defaults(defaults, params);

      var date = new Date(),
        data = [{
          type: ConfigService.config.signal_type,
          timestamp: date.toISOString(),
          pipeline: ConfigService.config.signals_pipeline
        }];

      // Add in params including defaults.
      data['params'] = defaults;

      return postSignalData(data);
    }

    //Use if you want to post a raw signal where you have control of every signal entry.  See postClickSignal for an example data structure
    function postSignalData(data) {
      var deferred = $q.defer();
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
      var documentIdField = ConfigService.config.signals_document_id;
      if (doc.hasOwnProperty(documentIdField)) {
        return doc[documentIdField];
      }
      return null;
    }
  }
})();
