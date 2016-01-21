(function() {
    'use strict';

    angular
        .module('fusionSeedApp.services.auth', ['fusionSeedApp.services.apiBase', 'fusionSeedApp.services.config'])
        .service('AuthService', AuthService);

    AuthService.$inject = ['$q', '$log', '$http', 'ApiBase', 'ConfigService'];

    /* @ngInject */
    function AuthService($q, $log, $http, ApiBase, ConfigService) {
      var config = ConfigService.config;
      var realmName = config.connectionReam;

      return {
        createSession:  createSession,
        getSession:     getSession,
        destroySession: destroySession
      };

      //////////////


      function createSession(username, password){
        var deferred = $q.defer();
        $http
          .post(ApiBase.getEndpoint()+'session?realmName='+realmName, {username: username, password: password})
          .then(function(resp) {
            deferred.resolve(resp);
          }, function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
      }

      function getSession(){
        var deferred = $q.defer();
        $http
          .get(ApiBase.getEndpoint()+'session?realmName='+realmName)
          .then(function(resp){
            deferred.resolve(resp);
          }, function(err){
            deferred.reject(err);
          });
        return deferred.promise;
      }

      function destroySession(){
        var deferred = $q.defer();
        $http
          .delete(ApiBase.getEndpoint()+'session?realmName='+realmName)
          .then(function(resp){
            deferred.resolve(resp);
          });

        return deferred.promise;
      }
    }
})();
