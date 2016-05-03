(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_web', ['lucidworksView.services.signals'])
    .directive('documentWeb', documentWeb);

  function documentWeb() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_web/document_web.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '=',
        highlight: '='
      }
    };

    return directive;

  }

  function Controller(SignalsService) {
    'ngInject';
    var vm = this;

    activate();

    /////////

    function activate() {
      vm.postSignal = SignalsService.postClickSignal;
    }
  }
})();
