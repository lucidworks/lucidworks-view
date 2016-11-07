(function () {
  'use strict';

  angular
    .module('lucidworksView.services.user',
      ["lucidworksView.services.config", "lucidworksView.services.apiBase"])
    .provider('UserService', UserService);

  function UserService() {

    this.$get = function ($http, ConfigService, ApiBase) {

      var apiUrl = ApiBase.getEndpoint() + "api/session";
      var user = null;

      return {

        init: function () {
          if (user != null) {
            return;
          }

          $http.get(apiUrl)
            .then(function (response) {
              user = response.data.user;
              console.log("-------------------------");
              console.log("-- Current user - " + user.username);
              console.log(user);
            }, function () {
              // TODO error handling
            });
        },

        getUser: function () {
          return user;
        }
      };
    };
  }
})();
