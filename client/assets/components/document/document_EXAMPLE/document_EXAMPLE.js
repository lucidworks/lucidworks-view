(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.document_EXAMPLE', ['fusionSeedApp.services.signals'])
    .directive('documentExample', documentExample);

  /* @ngInject */
  function documentExample() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_EXAMPLE/document_EXAMPLE.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '=bind',
        highlight: '='
      }
    };

    return directive;

  }

  function Controller(SignalsService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postSignal;
    }
  }
})();
