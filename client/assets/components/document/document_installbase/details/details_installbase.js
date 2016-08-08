(function () {
  angular.module('lucidworksView.components.details_installbase', ['lucidworksView.services.config',
      'lucidworksView.utils.docs', 'lucidworksView.services.signals'
    ])
    .directive('detailsInstallbase', detailsInstallbase);

  function detailsInstallbase() {
    'ngInject';
    return {
      //templateUrl: 'assets/components/document/document_installbase/document_installbase.html',
      templateUrl: 'assets/components/document/document_installbase/details/details_installbase.html',
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

      if(doc.install_date_dt){
        doc.install_date_dtFormatted = $filter('date')(doc.install_date_dt,'short');
      }
      if(doc.max_maintenance_end_date_dt){
        doc.max_maintenance_end_date_dtFormatted = $filter('date')(doc.max_maintenance_end_date_dt,'short');
      }
      if(doc.last_update_date_dt){
        doc.last_update_date_dtFormatted = $filter('date')(doc.last_update_date_dt,'short');
      }
      if(doc.creation_date_dt){
        doc.creation_date_dtFormatted = $filter('date')(doc.creation_date_dt,'short');
      }
      if(doc.start_date_dt){
        doc.start_date_dtFormatted = $filter('date')(doc.start_date_dt,'short');
      }
      if(doc.end_date_dt){
        doc.end_date_dtFormatted = $filter('date')(doc.end_date_dt,'short');
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

  }
})();
