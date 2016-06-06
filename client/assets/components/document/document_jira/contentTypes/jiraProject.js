(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_jira')
    .directive('jiraProject', jiraProject);

  function jiraProject() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_jira/contentTypes/jiraProject.html',
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


  function Controller(SignalsService, PaginateService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postClickSignal;
      vm.doc = processDocument(vm.doc);
      vm.doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(vm.doc);
      vm.doc.page = PaginateService.getNormalizedCurrentPage();
    }

    function processDocument(doc) {
      return doc;
    }
  }
})();
