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

  function Controller($log,DocumentService) {
    'ngInject';
    var vm = this;
    // $log.info('high',vm.highlight);
    var templateFields = ['length','mimeType','owner','lastModified'];

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc,templateFields);
      // $log.info('doc',doc);
      return doc;
    }
  }
})();
