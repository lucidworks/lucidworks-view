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

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService, PaginateService) {
    'ngInject';
    var vm = this;
    vm.postSignal = postSignal;

    activate();

    ///////////

    function activate() {
      vm.doc = processDocument(DocsHelper.concatMultivaluedFields(vm.doc));
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

      doc.lw_head = getField('head', doc) ?
        getField('head', doc) : 'Title Field Not Found';

      doc.lw_subhead = getField('subhead', doc);

      doc.lw_description = getField('description', doc);

      doc.lw_image = getField('image', doc);

      doc.lw_url = getField('head_url', doc);

      doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(doc);
      doc.position = vm.position;
      doc.page = PaginateService.getNormalizedCurrentPage();

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
