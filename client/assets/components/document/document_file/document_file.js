(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.document_file', ['fusionSeedApp.services.signals'])
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

  function Controller(SignalsService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.length_lFormatted = bytesToHumanReadableSize(doc.length_l);
      return doc;
    }

    function bytesToHumanReadableSize(bytes){
      var i = Math.floor(Math.log(bytes) / Math.log(1024));
      return !bytes && '0 Bytes' || (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][i];
    }
  }
})();
