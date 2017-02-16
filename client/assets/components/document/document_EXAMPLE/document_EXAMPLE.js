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

  function Controller(DocumentService) {
    'ngInject';
    var vm = this;
    var templateFields = ['id'];

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);
      doc._templateDisplayFields._lw_id_decoded = doc._templateDisplayFields.id ? decodeURIComponent(doc._templateDisplayFields.id) : doc._templateDisplayFields.id;

      //set properties needed for signals
      doc._signals = DocumentService.setSignalsProperties(doc, vm.position);
      
      return doc;
    }
  }
})();
