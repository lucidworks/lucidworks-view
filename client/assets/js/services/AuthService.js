(function () {
  'use strict';

  angular
    .module('lucidworksView.services.auth', ['lucidworksView.services.apiBase',
      'lucidworksView.services.config'
    ])
    .factory('AuthService', AuthService);

  function AuthService($q, $log, $http, $rootScope, ApiBase, ConfigService) {
    'ngInject';
    var config = ConfigService.config;
    var realmName = config.connection_realm;
    var loginUserName;

    return {
      createSession: createSession,
      getSession: getSession,
      destroySession: destroySession,
      getUserName: getUserName
    };

    //////////////


    function createSession(username, password) {
      var deferred = $q.defer();
      $http
        .post(ApiBase.getEndpoint() + 'api/session?realmName=' + realmName, {
          username: username,
          password: password
        })
        .then(function (resp) {
          deferred.resolve(resp);
          loginUserName = username;
        }, function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function getSession() {
      var deferred = $q.defer();
      $http
        .get(ApiBase.getEndpoint() + 'api/session?realmName=' + realmName)
        .then(function (resp) {
          deferred.resolve(resp);
          loginUserName = _.get(resp, 'data.user.username');
        }, function (err) {
          deferred.reject(err);
        });
      return deferred.promise;
    }

    function destroySession() {
      var deferred = $q.defer();
      $http
        .delete(ApiBase.getEndpoint() + 'api/session?realmName=' + realmName)
        .then(function (resp) {
          deferred.resolve(resp);
        });

      return deferred.promise;
    }

    function getUserName() {
      return loginUserName ? $q.when(loginUserName) : getSession().then(function() { return loginUserName; });
    }
  }
})();
