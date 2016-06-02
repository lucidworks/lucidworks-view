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
        highlight: '='
      }
    };

    return directive;

  }

  function Controller(SignalsService, $log, $filter) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postClickSignal;
      vm.doc = processDocument(vm.doc);
      vm.doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(vm.doc);
    }

    function processDocument(doc) {
      doc.createdAtFormatted = $filter('date')(doc.createdAt[0]);
      return doc;
    }
  }
})();
