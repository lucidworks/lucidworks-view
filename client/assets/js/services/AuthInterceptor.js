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
    var tryingAnon = false;
    return {
      responseError: responseError
    };

    //////////////

    function responseError(resp) {
      var deferred = $q.defer();
      var $state = $injector.get('$state');
      if (!$state.is('login') && (resp.status === 401)) {
        if(useAnonCreds && !tryingAnon) {
          getAnonSession();
          deferred.reject(resp);
        } else {
          deferred.reject(resp);
          $state.go('login');
        }
      } else if(resp.status === 403){
        // TODO handle unauthorized users.
        $log.warn('You are unauthorized to access that endpoint');
      }

      function useAnonCreds(){
        var ConfigService = $injector.get('ConfigService'),
          anonAccess = ConfigService.config.anonymous_access;

        return !(anonAccess.username === '' || anonAccess.password === '');
      }

      function getAnonSession(){
        var ConfigService = $injector.get('ConfigService'),
          AuthService = $injector.get('AuthService'),
          QueryService = $injector.get('QueryService');

        tryingAnon = true;
        AuthService.createSession(ConfigService.config.anonymous_access.username, ConfigService.config.anonymous_access.password)
          .then(function(){
            tryingAnon = false;
            QueryService.setQuery({});
          }, function(){
            tryingAnon = false;
          });

      }

      return deferred.promise;
    }

  }
})();
