(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_jira')
    .directive('jiraIssue', jiraIssue);

  function jiraIssue() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_jira/contentTypes/jiraIssue.html',
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
      vm.postSignal = postSignal;
      vm.doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(vm.doc);
      vm.doc.page = PaginateService.getNormalizedCurrentPage();
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
