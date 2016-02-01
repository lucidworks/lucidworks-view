/*global _*/
(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetList', ['fusionSeedApp.services.config'])
    .directive('facetList', facetList);

  function facetList() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/facetList/facetList.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {}
    };

    return directive;

  }

  function Controller(ConfigService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.facets = ConfigService.config.facets;
    }

  }
})();
