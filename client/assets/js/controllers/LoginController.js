(function() {
  'use strict';

  angular
    .module('lucidworksView.controllers.login', ['lucidworksView.services.config'])
    .controller('LoginController', LoginController);

  function LoginController(ConfigService) {
    'ngInject';
    var vm = this;
    vm.appName = ConfigService.config.search_app_title;
    vm.logoLocation = ConfigService.config.logo_location;
  }
})();
