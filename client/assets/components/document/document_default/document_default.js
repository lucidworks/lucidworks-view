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
        doc: '=bind',
        highlight: '='
      },
      replace: true
    };
  }

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService) {
    'ngInject';
    var vm = this;
    vm.postSignal = SignalsService.postSignal;

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

      //Populate the additional fields to display
      var fieldsToDisplay = ConfigService.getFieldsToDisplay();
      $log.debug('fieldsToDisplayPre', fieldsToDisplay);
      fieldsToDisplay = DocsHelper.parseWildcards(fieldsToDisplay, doc);
      $log.debug('fieldsToDisplayPost', fieldsToDisplay);
      doc.fieldsToDisplay = DocsHelper.populateFieldLabels(
        doc,
        DocsHelper.selectFields(doc, fieldsToDisplay)
      );
      // doc.fieldsToDisplay = fieldsToDisplay;
      $log.debug('fieldsToDisplayPopulated', doc.fieldsToDisplay);

      doc.lw_head = getField('head', doc) ?
        getField('head', doc) : 'Title Field Not Found';

      doc.lw_subhead = getField('subhead', doc);

      doc.lw_description = getField('description', doc);

      doc.lw_image = getField('image', doc);

      doc.lw_url = getField('head_url', doc);

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
