(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_twitter', ['lucidworksView.services.signals'])
    .directive('documentTwitter', documentTwitter);

  function documentTwitter() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_twitter/document_twitter.html',
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
    var templateFields = ['id', 'createdAt', 'tweet', 'userLang', 'userScreenName'];
    vm.postSignal = postSignal;
    vm.getTemplateDisplayFieldName = getTemplateDisplayFieldName;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);

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
