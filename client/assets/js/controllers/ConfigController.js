(function () {
  'use strict';

  angular
    .module('lucidworksView.controllers.config', ['lucidworksView.services.config'])
    .controller('configController', ['$scope', 'ConfigService',
      function ($scope, ConfigService) {

        $scope.configTitle = "Hello, yo!";
        //console.log(JSON.stringify(ConfigService.config, null, "  "));
      }])

})();
