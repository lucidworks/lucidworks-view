(function() {
  'use strict';

  angular
    .module('lucidworksView.components.document_slack', ['lucidworksView.services.signals'])
    .directive('documentSlack', documentSlack);

  function documentSlack() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/document/document_slack/document_slack.html',
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
      vm.postSignal = postSignal;
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      doc.timestamp_tdtFormatted = $filter('date')(vm.doc.timestamp_tdt, 'M/d/yy h:mm:ss a');
      // For multivalued fields
      doc.text = _.isArray(doc.text)?_.join(doc.text,' '):doc.text;
      doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(doc);
      doc.position = vm.position;
      doc.page = PaginateService.getNormalizedCurrentPage();
      return doc;
    }

    function postSignal(options){
      var paramsObj = {
        params: {
          position: vm.doc.position,
          page: vm.doc.page
        }
      };
      _.defaultsDeep(paramsObj, options);
      SignalsService.postClickSignal(vm.doc.__signals_doc_id__, paramsObj);
    }
  }
})();
