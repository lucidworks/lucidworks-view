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

  function Controller(SignalsService, PaginateService, $log, $filter) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = postSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.createdAtFormatted = $filter('date')(doc.createdAt[0]);
      doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(doc);
      doc.position = vm.position;
      doc.page = PaginateService.getNormalizedCurrentPage();
      return doc;
    }

    function postSignal(options){
      var paramsObj = {
        params: {
          position: vm.doc.position,
          page: vm.doc.page
        }
      };
      _.defaultsDeep(paramsObj, options);
      SignalsService.postClickSignal(vm.doc.__signals_doc_id__, paramsObj);
    }
  }
})();
