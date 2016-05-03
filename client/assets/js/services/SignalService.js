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
     * @param  {string} docId      The document id
     * @param  {object} options     An object containing parameter overrides and options.
     *   - The object can be any parameter which will be passed through, including parameters.
     *     Ex: {type: 'custom', params: {filterQueries: ['something']}}
     * @return {promise}
     */
    function postClickSignal(docId, options) {
      var date = new Date(),
        data = {
          type: ConfigService.config.signal_type,
          timestamp: date.toISOString(),
          pipeline: ConfigService.config.signals_pipeline,
          params: {
            docId: docId,
            query: QueryService.getQueryObject().q
          }
        };

      _.defaultsDeep(data, options);


      return postSignalData([data]);
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
