(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_file', ['lucidworksView.services.signals', 'angular-humanize'])
    .directive('documentFile', documentFile);

  function documentFile() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_file/document_file.html',
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

  function Controller(SignalsService, $filter, PaginateService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      vm.postSignal = SignalsService.postClickSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.length_lFormatted = $filter('humanizeFilesize')(doc.length_l);
      doc.lastModified_dtFormatted = $filter('date')(doc.lastModified_dt);
      doc.position = vm.position;
      doc.page = PaginateService.getNormalizedCurrentPage();
      return doc;
    }
  }
})();
