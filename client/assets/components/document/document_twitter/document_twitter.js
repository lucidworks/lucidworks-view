(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.document_twitter', ['fusionSeedApp.services.signals'])
    .directive('documentTwitter', documentTwitter);

  /* @ngInject */
  function documentTwitter() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_twitter/document_twitter.html',
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
      doc.createdAtFormatted = $filter('date')(doc.createdAt[0]);
      return doc;
    }
  }
})();
