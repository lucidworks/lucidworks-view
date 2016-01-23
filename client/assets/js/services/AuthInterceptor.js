(function() {
  'use strict';

  angular
    .module('fusionSeedApp.services.authInterceptor', ['fusionSeedApp.services.config'])
    .factory('AuthInterceptor', AuthInterceptor);

  AuthInterceptor.$inject = ['$q', '$log', '$injector'];

  /* @ngInject */
  function AuthInterceptor($q, $log, $injector) {

    return {
      responseError:  responseError,
    };

    //////////////

    function responseError(resp){
      var deferred = $q.defer();
      var $state = $injector.get('$state');
      if(!$state.is('login') && (resp.status === 401 || resp.status === 403)) {
        deferred.reject(resp);
        $state.go('login');
      }

      return deferred.promise;
    }

  }
})();
