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

    function processDocument(document){
      //Populate the labels
      var doc = {};
      doc.actualDocument = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(document,ConfigService.getFieldsToDisplay()),
        ConfigService.getFieldLabels());
      doc.lw_title = document.hasOwnProperty(ConfigService.getFields.get('head'))?
        document[ConfigService.getFields.get('head')]:'Title Field Not Found';
      doc.lw_title2 = document.hasOwnProperty(ConfigService.getFields.get('subhead'))?
        document[ConfigService.getFields.get('subhead')]:null;
      doc.lw_thumbnail = document.hasOwnProperty(ConfigService.getFields.get('thumbnail'))?
        document[ConfigService.getFields.get('thumbnail')]:null;
      return doc;
    }

    function init(){
      self.document = processDocument(DocsHelper.concatMultivaluedFields(self.doc));
    }
    // $log.info(DocsHelper);
  }

  function linkFunc(scope, elem){
    // $log.info(DocsHelper);
  }
})();
