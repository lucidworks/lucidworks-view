(function () {
  'use strict';

  angular
    .module('lucidworksView.services.user',
      ["lucidworksView.services.config", "lucidworksView.services.apiBase"])
    .provider('UserService', UserService);

  function UserService() {

    this.$get = function ($http, ConfigService, ApiBase) {

      var apiUrl = ApiBase.getEndpoint() + "api/users";
      var user = null;

      return {

        initInfo: function () {
          if (user != null) {
            return;
          }

          $http.get(apiUrl)
            .then(function (response) {
              user = response.data[0];
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
