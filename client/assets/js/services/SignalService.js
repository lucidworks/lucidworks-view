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

    function postSignal(documentId) {
      var deferred = $q.defer();
      var date = new Date();
      var data = [{
        params: {
          query: QueryService.getQueryObject().q,
          docId: documentId, //
        },
        type: ConfigService.config.signalType,
        timestamp: date.toISOString()
      }];

      $http
        .post(ApiBase.getEndpoint() + 'api/apollo/signals/' + ConfigService.config.signalsPipeline,
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
  }
})();
