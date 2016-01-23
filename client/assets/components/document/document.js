(function(){
  angular.module('fusionSeedApp.components.document', ['fusionSeedApp.services.config', 'fusionSeedApp.utils.docs'])
    .directive('document', documentListItem);

  documentListItem.$inject = [];
  function documentListItem(){
    return {
      templateUrl: 'assets/components/document/document.html',
      link: linkFunc,
      scope: {
        doc: '='
      },
      controller: Controller,
      controllerAs: 'dc',
      bindToController: true,
    };
  }

  Controller.$inject = ['$log', '$scope', 'DocsHelper', 'ConfigService'];
  function Controller($log, $scope, DocsHelper, ConfigService){
    var self = this;

    init();

    function processDocument(doc){
      //Populate the labels
      var returnDoc = {};
      returnDoc.actualDocument = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(doc,ConfigService.getFieldsToDisplay()),
        ConfigService.getFieldLabels());
      returnDoc.lw_title = doc.hasOwnProperty(ConfigService.getFields.get('title'))?
        doc[ConfigService.getFields.get('head')]:'Title Field Not Found';
      returnDoc.lw_subtitle = doc.hasOwnProperty(ConfigService.getFields.get('subtitle'))?
        doc[ConfigService.getFields.get('subhead')]:null;
      returnDoc.lw_thumbnail = doc.hasOwnProperty(ConfigService.getFields.get('thumbnail'))?
        doc[ConfigService.getFields.get('thumbnail')]:null;
      return returnDoc;
    }

    function init(){
      self.doc = processDocument(DocsHelper.concatMultivaluedFields(self.doc));
    }
    // $log.info(DocsHelper);
  }

  function linkFunc(scope, elem){
    // $log.info(DocsHelper);
  }
})();
