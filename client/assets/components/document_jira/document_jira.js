(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.document_jira', ['fusionSeedApp.services.signals'])
    .directive('documentJira', documentJira);

  /* @ngInject */
  function documentJira() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document_jira/document_jira.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '='
      }
    };

    return directive;

  }


  function Controller(SignalsService, $log, $filter) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postSignal;
      vm.doc = processDocument(vm.doc);
      $log.debug('jira');
    }

    function processDocument(doc) {
      doc.timestamp_tdtFormatted = $filter('date')(vm.doc.timestamp_tdt);
      return doc;
    }
  }
})();
