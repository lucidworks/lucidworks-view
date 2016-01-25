(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.login', ['fusionSeedApp.services.auth',
      'ui.router'
    ])
    .directive('login', login);

  /* @ngInject */
  function login($log, ConfigService) {
    return {
      controller: Controller,
      templateUrl: 'assets/components/login/login.html',
      controllerAs: 'vm',
      bindToController: true
    };

  }

  Controller.$inject = ['$log', 'ConfigService', 'Orwell', 'AuthService', '$state'];

  /* @ngInject */
  function Controller($log, ConfigService, Orwell, AuthService, $state) {
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.error = null;
    vm.submitting = false;

    vm.submit = submit;

    $log.info('Daymn');

    function submit() {
      vm.error = null;
      vm.submitting = true;
      AuthService
        .createSession(vm.username, vm.password)
        .then(success, failure);

      function success() {
        vm.submitting = false;
        $state.go('home');
      }

      function failure(err) {
        vm.submitting = false;
        vm.error = err;
      }

    }
  }
})();
