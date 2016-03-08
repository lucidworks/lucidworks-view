(function () {
  angular.module('fusionSeedApp.components.document', ['fusionSeedApp.services.config',
      'fusionSeedApp.utils.docs', 'fusionSeedApp.services.signals'
    ])
    .directive('document', documentListItem);


  function documentListItem() {
    'ngInject';
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

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService) {
    'ngInject';
    var dc = this;
    dc.postSignal = SignalsService.postSignal;

    activate();

    ///////////

    function activate() {
      dc.doc = processDocument(DocsHelper.concatMultivaluedFields(dc.doc));
      dc.doc_type = dc.doc["_lw_data_source_type_s"];
      $log.info("Doc Type: " + dc.doc_type);
    }



    function processDocument(doc) {

      //Populate the additional fields to display
      doc.fieldsToDisplay = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(doc, ConfigService.getFieldsToDisplay()),
        ConfigService.getFieldLabels()
      );

      doc.lw_head = getField('head', doc) ?
        getField('head', doc) : 'Title Field Not Found';

      doc.lw_subhead = getField('subhead', doc);

      doc.lw_description = getField('description', doc);

      doc.lw_image = getField('image', doc);

      doc.lw_url = getField('head_url', doc);

      doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(doc);
      $log.info(doc);
      return doc;
    }

    /**
     * Given a field type get the actual field value.
     * @param  {String} fieldType The Field type.
     * @param  {object} doc       The document object
     * @return {String|null}       The field value.
     */
    function getField(fieldType, doc) {
      var fieldName = ConfigService.getFields.get(fieldType);
      if (doc.hasOwnProperty(fieldName)) {
        return doc[fieldName];
      }
      return null;
    }

  }
})();
