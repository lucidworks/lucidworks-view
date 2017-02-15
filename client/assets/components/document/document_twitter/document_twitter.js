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

  function Controller(DocumentService, SignalsService) {
    'ngInject';

    var vm = this;

    //define list of fields necessary to display the doc in the template
    var templateFields = ['id', 'createdAt', 'tweet', 'userLang', 'userScreenName'];

    activate();

    function activate() {
      vm.postSignal = postSignal;
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
      var paramsObj = {
        params: {
          position: vm.doc._signals.position,
          page: vm.doc._signals.page
        }
      };
      _.defaultsDeep(paramsObj, options);
      SignalsService.postClickSignal(vm.doc._signals.signals_doc_id, paramsObj);
    }
  }
})();
