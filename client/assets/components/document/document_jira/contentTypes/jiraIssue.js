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


  function Controller(SignalsService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postClickSignal;
    }

  }
})();
