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
    var templateFields = Object.keys(vm.doc);
    vm.getTemplateDisplayFieldName = getTemplateDisplayFieldName;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);
      doc._templateDisplayFields._lw_id_decoded = DocumentService.decodeFieldValue(doc._templateDisplayFields, 'id');

      //set properties needed for signals
      doc._signals = DocumentService.setSignalsProperties(doc, vm.position);

      return doc;
    }

    function getTemplateDisplayFieldName(field){
      return DocumentService.getTemplateDisplayFieldName(vm.doc, field);
    }
  }
})();
