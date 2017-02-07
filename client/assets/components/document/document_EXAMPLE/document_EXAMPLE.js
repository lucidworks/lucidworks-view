(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_EXAMPLE', ['lucidworksView.services.signals'])
    .directive('documentExample', documentExample);

  function documentExample() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_EXAMPLE/document_EXAMPLE.html',
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

    function activate() {
      vm.doc = processDocument(vm.doc);
      vm.postSignal = SignalsService.postClickSignal;
    }

    function processDocument(doc) {
      doc._lw_id_decoded = doc.id ? decodeURIComponent(doc.id) : doc.id;
      return doc;
    }
  }
})();
