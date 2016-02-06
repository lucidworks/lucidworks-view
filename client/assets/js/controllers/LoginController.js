(function() {
  'use strict';

  angular
    .module('fusionSeedApp.controllers.login', ['fusionSeedApp.services.config'])
    .controller('LoginController', LoginController);

  function LoginController(ConfigService) {
    'ngInject';
    var vm = this;
    vm.appName = ConfigService.config.searchAppTitle;
  }
})();
