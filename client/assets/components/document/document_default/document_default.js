(function () {
  angular.module('lucidworksView.components.document', ['lucidworksView.services.config',
    'lucidworksView.utils.docs', 'lucidworksView.services.signals'
  ])
  .directive('documentDefault', documentDefault);


  function documentDefault() {
    'ngInject';
    return {
      templateUrl: 'assets/components/document/document_default/document_default.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '=',
        position: '=',
        highlight: '='
      },
      replace: true
    };
  }

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService, PaginateService, DocumentService) {
    'ngInject';
    var vm = this;
    vm.postSignal = postSignal;
    var templateFields = [];
    var specialFields = ['head', 'subhead', 'description', 'image', 'head_url'];

    activate();

    ///////////

    function activate() {
      vm.doc = processDocument(DocsHelper.concatMultivaluedFields(vm.doc));
      _.forEach(specialFields, function(fieldType) {
        templateFields.push(ConfigService.getFields.get(fieldType));
      });
    }

    /**
     * Processes a document prepares fields from the config for display.
     * @param  {object} doc A single document record
     * @return {object}     The document record with processed properties.
     */
    function processDocument(doc) {

      // Populate the additional fields to display

      // Get fields from config service.
      var fieldsToDisplay = ConfigService.getFieldsToDisplay();
      // Parse any wildcards in the config.
      fieldsToDisplay = DocsHelper.parseWildcards(fieldsToDisplay, doc);
      // turn fields to display into a list of params.
      doc.fieldsToDisplay = DocsHelper.populateFieldLabels(
        DocsHelper.selectFields(doc, fieldsToDisplay),
        ConfigService.getFieldLabels()
      );

      doc.lw_head = {
        key: getTemplateDisplayFieldName(ConfigService.getFields.get('head')),
        value: getField('head', doc) ? getField('head', doc) : 'Title Field Not Found'
      };

      doc.lw_subhead = {
        key: getTemplateDisplayFieldName(ConfigService.getFields.get('subhead')),
        value: getField('subhead', doc)
      };

      doc.lw_description = {
        key: getTemplateDisplayFieldName(ConfigService.getFields.get('description')),
        value: getField('description', doc)
      };

      doc.lw_image = {
        key: getTemplateDisplayFieldName(ConfigService.getFields.get('image')),
        value: getField('image', doc) ? DocumentService.decodeFieldValue(doc, ConfigService.getFields.get('image')) : null
      };

      doc.lw_url = {
        key: getTemplateDisplayFieldName(ConfigService.getFields.get('head_url')),
        value: getField('head_url', doc) ? DocumentService.decodeFieldValue(doc, ConfigService.getFields.get('head_url')) : null
      };

      doc._signals = DocumentService.setSignalsProperties(doc, vm.position);

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

    function postSignal(options){
      DocumentService.postSignal(vm.doc._signals, options);
    }

    function getTemplateDisplayFieldName(field){
      return DocumentService.getTemplateDisplayFieldName(vm.doc, field);
    }
  }
})();
