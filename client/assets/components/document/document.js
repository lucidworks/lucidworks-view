(function () {
  angular.module('fusionSeedApp.components.document', ['fusionSeedApp.services.config',
      'fusionSeedApp.utils.docs', 'fusionSeedApp.service.signals'
    ])
    .directive('document', documentListItem);

  documentListItem.$inject = [];

  function documentListItem() {
    return {
      templateUrl: 'assets/components/document/document.html',
      scope: true,
      controller: Controller,
      controllerAs: 'dc',
      bindToController: {
        doc: '='
      },
      replace: true
    };
  }

  Controller.$inject = ['$log', '$scope', 'DocsHelper', 'ConfigService', 'SignalsService'];

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService) {
    var dc = this;
    dc.postSignal = SignalsService.postSignal;

    activate();

    ///////////

    function activate() {
      dc.doc = processDocument(DocsHelper.concatMultivaluedFields(dc.doc));
    }

    function processDocument(doc) {
      //Populate the labels
      var returnDoc = {};

      returnDoc.fieldsToDisplay = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(doc, ConfigService.getFieldsToDisplay()),
        ConfigService.getFieldLabels()
      );

      returnDoc.lw_head = doc.hasOwnProperty(ConfigService.getFields.get('head')) ?
        doc[ConfigService.getFields.get('head')] : 'Title Field Not Found';

      returnDoc.lw_subhead = doc.hasOwnProperty(ConfigService.getFields.get('subhead')) ?
        doc[ConfigService.getFields.get('subhead')] : null;

      returnDoc.lw_description = doc.hasOwnProperty(ConfigService.getFields.get(
          'description')) ?
        doc[ConfigService.getFields.get('description')] : null;

      returnDoc.lw_image = doc.hasOwnProperty(ConfigService.getFields.get('image')) ?
        doc[ConfigService.getFields.get('image')] : null;

      return returnDoc;
    }

  }
})();
