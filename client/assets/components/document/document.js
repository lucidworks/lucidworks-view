(function(){
  angular.module('fusionSeedApp.components.document', ['fusionSeedApp.services.config', 'fusionSeedApp.utils.docs'])
    .directive('document', documentListItem);

  documentListItem.$inject = [];
  function documentListItem(){
    return {
      templateUrl: 'assets/components/document/document.html',
      scope: {
        doc: '='
      },
      controller: Controller,
      controllerAs: 'dc',
      bindToController: true,
      replace: true
    };
  }

  Controller.$inject = ['$log', '$scope', 'DocsHelper', 'ConfigService'];
  function Controller($log, $scope, DocsHelper, ConfigService){
    var self = this;

    init();

    function processDocument(doc){
      $log.debug('processDocument');
      $log.debug(doc);
      $log.debug(ConfigService.getFields.get('title'));
      //Populate the labels
      var returnDoc = {};

      returnDoc.actualDocument = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(doc, ConfigService.getFieldsToDisplay()),
        ConfigService.getFieldLabels()
      );

      returnDoc.lw_head = doc.hasOwnProperty(ConfigService.getFields.get('head'))?
        doc[ConfigService.getFields.get('head')]:'Title Field Not Found';

      returnDoc.lw_subhead = doc.hasOwnProperty(ConfigService.getFields.get('subhead'))?
        doc[ConfigService.getFields.get('subhead')]:null;

      returnDoc.lw_description = doc.hasOwnProperty(ConfigService.getFields.get('description'))?
        doc[ConfigService.getFields.get('description')]:null;

      returnDoc.lw_image = doc.hasOwnProperty(ConfigService.getFields.get('image'))?
        doc[ConfigService.getFields.get('image')]:null;

      return returnDoc;
    }

    function init(){
      self.doc = processDocument(DocsHelper.concatMultivaluedFields(self.doc));
    }
    // $log.info(DocsHelper);
  }
})();
