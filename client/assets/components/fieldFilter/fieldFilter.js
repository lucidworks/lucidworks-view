(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.fieldFilter', ['fusionSeedApp.services.config'])
    .directive('fieldFilter', fieldFilter);

  /* @ngInject */
  function fieldFilter() {
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/fieldFilter/fieldFilter.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        filterName: '@filterName'
      }
    };

  }

  Controller.$inject = ['ConfigService', 'Orwell'];

  /* @ngInject */
  function Controller(ConfigService, Orwell) {
    var vm = this;

    activate();

    function activate() {

    }
  }
})();
