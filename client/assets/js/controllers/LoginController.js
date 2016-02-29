(function() {
  'use strict';

  angular
    .module('fusionSeedApp.controllers.login', ['fusionSeedApp.services.config'])
    .controller('LoginController', LoginController);

  function LoginController($state, ConfigService, AuthService) {
    'ngInject';
    var vm = this;
    vm.appName = ConfigService.config.search_app_title;

    AuthService.getSession().then(function(resp){
      $state.go('home');
    });
  }
})();
