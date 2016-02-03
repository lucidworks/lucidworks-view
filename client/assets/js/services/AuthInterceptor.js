/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.services.authInterceptor', ['fusionSeedApp.services.config'])
    .factory('AuthInterceptor', AuthInterceptor)
    .factory('SessionInjector', SessionInjector);


  function SessionInjector(ConfigService) {
    'ngInject';
    var sessionInjector = {
      request: function(config) {
        _.assign(config.headers, ConfigService.getAuthHeader());
        return config;
      }
    };
    return sessionInjector;
  }


  function AuthInterceptor($q, $log, $injector) {
    'ngInject';
    return {
      responseError: responseError
    };

    //////////////

    function responseError(resp) {
      var deferred = $q.defer();
      var $state = $injector.get('$state');
      if (!$state.is('login') && (resp.status === 401)) {
        deferred.reject(resp);
        $state.go('login');
      } else if(resp.status === 403){
        // TODO handle unauthorized users.
        $log.warn('You are unauthorized to access that endpoint');
      }

      return deferred.promise;
    }

  }
})();
