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
        doc: '=bind',
        highlight: '='
      }
    };

    return directive;

  }


  function Controller(SignalsService, $filter) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.lastModified_dtFormatted = $filter('date')(doc.lastModified_dt);
      return doc;
    }
  }
})();
