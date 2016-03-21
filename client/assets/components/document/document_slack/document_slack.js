(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.document_slack', ['fusionSeedApp.services.signals'])
    .directive('documentSlack', documentSlack);

  /* @ngInject */
  function documentSlack() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_slack/document_slack.html',
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
      doc.timestamp_tdtFormatted = $filter('date')(vm.doc.timestamp_tdt, 'short');
      return doc;
    }
  }
})();
