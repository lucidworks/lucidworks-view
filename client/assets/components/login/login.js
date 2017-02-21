(function () {
  'use strict';

  angular
    .module('lucidworksView.components.login', ['lucidworksView.services.auth',
      'ui.router'
    ])
    .constant('QUERY_PARAM', 'query')
    .directive('login', login);

  function login() {
    'ngInject';
    return {
      controller: Controller,
      templateUrl: 'assets/components/login/login.html',
      controllerAs: 'vm',
      bindToController: true,
      scope: true
    };

  }

  function Controller(ConfigService, Orwell, AuthService, $state, QUERY_PARAM) {
    'ngInject';
    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.error = null;
    vm.submitting = false;

    vm.submit = submit;

    function submit() {
      vm.error = null;
      vm.submitting = true;
      AuthService
        .createSession(vm.username, vm.password)
        .then(success, failure);

      function success() {
        vm.submitting = false;
        var params = {};
        if ($state.params[QUERY_PARAM]) {
          params[QUERY_PARAM] = $state.params[QUERY_PARAM];
        }
        $state.go('home', params);
      }

      function failure(err) {
        vm.submitting = false;
        vm.error = err;
      }

    }
  }
})();
