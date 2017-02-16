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


  function Controller($filter, DocumentService) {
    'ngInject';
    var vm = this;
    var templateFields = ['text', 'channel', 'user', 'timestamp', 'id'];
    vm.postSignal = postSignal;
    vm.getTemplateDisplayFieldName = getTemplateDisplayFieldName;

    activate();

    function activate() {
      vm.doc = processDocument(vm.doc);
    }

    function processDocument(doc) {
      //set properties needed for display
      doc._templateDisplayFields = DocumentService.setTemplateDisplayFields(doc, templateFields);

      doc._templateDisplayFields.timestamp_Formatted = $filter('date')(vm.doc._templateDisplayFields.timestamp, 'M/d/yy h:mm:ss a');
      // For multivalued fields
      doc._templateDisplayFields.text = _.isArray(doc._templateDisplayFields.text) ? _.join(doc._templateDisplayFields.text, ' ') : doc._templateDisplayFields.text;
      doc._templateDisplayFields._lw_id_decoded = DocumentService.decodeFieldValue(doc._templateDisplayFields, 'id');

      //set properties needed for signals
      doc._signals = DocumentService.setSignalsProperties(doc, vm.position);

      return doc;
    }

    function postSignal(options){
      DocumentService.postSignal(vm.doc._signals, options);
    }

    function getTemplateDisplayFieldName(field){
      return DocumentService.getTemplateDisplayFieldName(vm.doc, field);
    }
  }
})();
