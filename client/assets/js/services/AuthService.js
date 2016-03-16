(function () {
  'use strict';

  angular
    .module('fusionSeedApp.services.auth', ['fusionSeedApp.services.apiBase',
      'fusionSeedApp.services.config'
    ])
    .factory('AuthService', AuthService);

  function AuthService($q, $log, $http, ApiBase, ConfigService) {
    'ngInject';
    var config = ConfigService.config;
    var realmName = config.connection_realm;

    return {
      createSession: createSession,
      getSession: getSession,
      destroySession: destroySession
    };

    //////////////

    /**
     * [createSession Creates a session with Fusion]
     * @param  {[String]} username
     * @param  {[String]} password
     * @return {[Angular Promise]} [Response promise after HTTP request gets resolved]
     */
    function createSession(username, password) {
      var deferred = $q.defer();
      $http
        .post(ApiBase.getEndpoint() + 'api/session?realmName=' + realmName, {
          username: username,
          password: password
        })
        .then(function (resp) {
          deferred.resolve(resp);
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    /**
     * [getSession
     * Gets current session.
     * Rejects returned promise if no-session
     * Resolves returned promise if there is a valid session cookie
     * ]
     *
     * @return {[Angular Promise]} [Response promise]
     */
    function getSession() {
      var deferred = $q.defer();
      $http
        .get(ApiBase.getEndpoint() + 'api/session?realmName=' + realmName)
        .then(function (resp) {
          deferred.resolve(resp);
        }, function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    /**
     * [destroySession destroys the current session]
     */
    function destroySession() {
      var deferred = $q.defer();
      $http
        .delete(ApiBase.getEndpoint() + 'api/session?realmName=' + realmName)
        .then(function (resp) {
          deferred.resolve(resp);
        });

      return deferred.promise;
    }
  }
})();
