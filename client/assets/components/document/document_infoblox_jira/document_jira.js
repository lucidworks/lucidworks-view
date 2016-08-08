(function() {
  'use strict';

  angular
    .module('lucidworksView.components.infoblox.document_jira', ['lucidworksView.services.signals'])
    .directive('documentInfobloxJira', documentJira);

  function documentJira() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_infoblox_jira/document_jira.html',
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


  function Controller(SignalsService, $filter) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postClickSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      if(doc.Updated){
        doc.Updated_dtFormatted = $filter('date')(doc.Updated,'short');
      }
      if(doc.Created){
        doc.Created_dtFormatted = $filter('date')(doc.Created,'short');
      }
      return doc;
    }
  }
})();
