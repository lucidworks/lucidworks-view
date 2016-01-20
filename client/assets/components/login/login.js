(function() {
    'use strict';

  angular
    .module('fusionSeedApp.components.login', [])
    .directive('login', login);

    /* @ngInject */
    function login($log, ConfigService) {
      return {
        controller: Controller,
        link: linkFunc,
        templateUrl: 'assets/components/login/login.html',
        controllerAs: 'vm',
        bindToController: true
      };

      function linkFunc(scope, el, attr, ctrl){

      }

    }

    Controller.$inject = ['$log', 'ConfigService', 'Orwell'];

    /* @ngInject */
    function Controller($log, ConfigService, Orwell){
      var vm = this;

      $log.info("Daymn");
    }
})();
