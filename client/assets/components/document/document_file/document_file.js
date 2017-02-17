(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_file', ['lucidworksView.services.signals', 'angular-humanize'])
    .directive('documentFile', documentFile);

  function documentFile() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_file/document_file.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '=',
        position: '=',
        highlight: '='
      }
    };

    return directive;

  }

  function Controller(DocumentService) {
    'ngInject';
    var vm = this;
    var templateFields = ['id', 'length', 'mimeType', 'owner', 'lastModified'];
    vm.getTemplateDisplayFieldName = getTemplateDisplayFieldName;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);

      return doc;
    }

    function getTemplateDisplayFieldName(field){
      return DocumentService.getTemplateDisplayFieldName(vm.doc, field);
    }
  }
})();
