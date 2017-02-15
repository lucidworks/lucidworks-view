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

  function Controller(SignalsService, PaginateService, DocumentService) {
    'ngInject';
    var vm = this;
    var templateFields = ['title', 'url', 'id', 'keywords', 'description', 'og_description', 'content', 'body'];

    activate();

    function activate() {
      vm.postSignal = postSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);
      doc._templateDisplayFields._lw_id_decoded = doc._templateDisplayFields.id ? decodeURIComponent(doc._templateDisplayFields.id) : doc._templateDisplayFields.id;
      doc._templateDisplayFields._lw_url_decoded = _.has(doc, '_templateDisplayFields.url[0]') ? decodeURIComponent(doc._templateDisplayFields.url) : doc._templateDisplayFields.url;

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
