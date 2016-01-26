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

  Controller.$inject = ['$log', '$scope', 'DocsHelper', 'ConfigService',
    'SignalsService'
  ];

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService) {
    var dc = this;
    dc.postSignal = SignalsService.postSignal;

    activate();

    ///////////

    function activate() {
      dc.doc = processDocument(DocsHelper.concatMultivaluedFields(dc.doc));
    }

    function processDocument(doc) {
      var returnDoc = {};

      //Populate the additional fields to display
      returnDoc.fieldsToDisplay = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(doc, ConfigService.getFieldsToDisplay()),
        ConfigService.getFieldLabels()
      );

      returnDoc.lw_head = getField('head', doc) ?
        getField('head', doc) : 'Title Field Not Found';

      returnDoc.lw_subhead = getField('subhead', doc);

      returnDoc.lw_description = getField('description', doc);

      returnDoc.lw_image = getField('image', doc);

      returnDoc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(doc);

      return returnDoc;
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
