(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_jira', ['lucidworksView.services.signals'])
    .directive('documentJira', documentJira);

  function documentJira() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_jira/document_jira.html',
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

    //define list of fields necessary to display the doc in the template (jira issue + jira project)
    var templateFields = ['id', 'summary', 'content', 'name', 'parent', 'jira_content_type', 'key', 'lastModified', 'assignee', 'lead'];

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc,templateFields);

      //set properties needed for signals
      doc._signals = DocumentService.setSignalsProperties(doc,vm.position);

      return doc;
    }

  }
})();
