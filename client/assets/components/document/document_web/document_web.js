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
        position: '=',
        highlight: '='
      }
    };

    return directive;

  }

  function Controller(DocumentService) {
    'ngInject';
    var vm = this;
    var templateFields = ['title', 'url', 'id', 'keywords', 'description', 'og_description', 'content', 'body'];
    vm.postSignal = postSignal;
    vm.getTemplateDisplayFieldName = getTemplateDisplayFieldName;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);

      doc._templateDisplayFields._lw_id_decoded = DocumentService.decodeFieldValue(doc._templateDisplayFields, 'id');
      doc._templateDisplayFields._lw_url_decoded = DocumentService.decodeFieldValue(doc._templateDisplayFields, 'url');

      //set properties needed for signals
      doc._signals = DocumentService.setSignalsProperties(doc, vm.position);

      return doc;
    }

    function postSignal(options){
      DocumentService.postSignal(vm.doc._signals, options);
    }

    function getTemplateDisplayFieldName(field){
      return DocumentService.getTemplateDisplayFieldName(vm.doc, field);
    }
  }
})();
