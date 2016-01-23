(function() {
  'use strict';

  angular
      .module('fusionSeedApp.components.fieldFilter', ['fusionSeedApp.services.config'])
      .directive('fieldFilter', fieldFilter);

  /* @ngInject */
  function fieldFilter() {
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/fieldFilter/fieldFilter.html',
      scope: {
        filterName: '@filterName'
      },
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true
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
