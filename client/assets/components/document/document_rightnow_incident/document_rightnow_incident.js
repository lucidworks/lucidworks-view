(function () {
  angular.module('lucidworksView.components.document_RN_incident', ['lucidworksView.services.config',
      'lucidworksView.utils.docs', 'lucidworksView.services.signals'
    ])
      .directive('documentRightnowIncident', documentRightnowIncident);


  function documentRightnowIncident() {
    'ngInject';
    return {
      templateUrl: 'assets/components/document/document_rightnow_incident/document_rightnow_incident.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '=',
        highlight: '='
      },
      replace: true
    };
  }

  function Controller($log, $scope, DocsHelper, ConfigService, SignalsService,$filter, Orwell) {
    'ngInject';
    var vm = this;
    vm.postSignal = SignalsService.postClickSignal;
    var perDocumentObservable = Orwell.getObservable('perDocument');

    activate();

    ///////////

    function activate() {
      vm.doc = processDocument(DocsHelper.concatMultivaluedFields(vm.doc));
      vm.postClickSignal = processClick;
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
      
      if(doc.Updated){
        doc.Updated_dtFormatted = $filter('date')(doc.Updated,'short');
      }
      if(doc.Created){
        doc.Created_dtFormatted = $filter('date')(doc.Created,'short');
      }

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
    function processClick(element, docId, position, score){
      //SnowplowService.postClickSignal(element, docId, position, score);
      var payload = {
        "docId": '"' + docId + '"'
      };
      perDocumentObservable.setContent(payload);
    }

  }
})();
