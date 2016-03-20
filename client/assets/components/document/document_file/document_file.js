(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.document_file', ['fusionSeedApp.services.signals', 'angular-humanize'])
    .directive('documentFile', documentFile);

  /* @ngInject */
  function documentFile() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_file/document_file.html',
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
      doc.length_lFormatted = $filter('humanizeFilesize')(doc.length_l);
      return doc;
    }
  }
})();
