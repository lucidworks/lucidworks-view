(function () {
  angular.module('fusionSeedApp.components.document', ['fusionSeedApp.services.config',
      'fusionSeedApp.utils.docs', 'fusionSeedApp.services.signals'
    ])
    .directive('documentDefault', documentDefault);


  function documentDefault() {
    'ngInject';
    return {
      templateUrl: 'assets/components/document/document_default/document_default.html',
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
      $log.info('Doc Type: ' + dc.doc_type);
    }

    /**
     * Processes a document prepares fields from the config for display.
     * @param  {object} doc A single document record
     * @return {object}     The document record with processed properties.
     */
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
