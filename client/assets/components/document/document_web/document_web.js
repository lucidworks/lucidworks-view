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

  function Controller(SignalsService, PaginateService) {
    'ngInject';
    var vm = this;

    activate();


    function activate() {
      vm.postSignal = postSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc._lw_id_decoded = doc.id ? decodeURIComponent(doc.id) : doc.id;
      doc._lw_url_decoded = _.has(doc, 'url[0]') ? decodeURIComponent(doc.url) : doc.url;
      doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(vm.doc);
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
