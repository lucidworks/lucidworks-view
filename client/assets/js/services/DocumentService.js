(function () {
  'use strict';

  angular
    .module('lucidworksView.services.document', [])
    .factory('DocumentService', DocumentService);

  function DocumentService($log, PaginateService, SignalsService) {
    'ngInject';


    var DocumentService = {
      setSignalsProperties: setSignalsProperties,
      setTemplateDisplayFields: setTemplateDisplayFields
    };

    return DocumentService;
    function setSignalsProperties(doc,position) {
      var signalsProperties = {};
      signalsProperties.signals_doc_id = SignalsService.getSignalsDocumentId(doc);
      signalsProperties.position = position;
      signalsProperties.page = PaginateService.getNormalizedCurrentPage();

      return signalsProperties;
    }

    function setTemplateDisplayFields(doc,fieldsList) {
      var displayFields = {};
      //TODO: refactor this 
      _.forEach(fieldsList,function(field) {
        var fieldValue = _.get(doc,field+'_s') 
          || _.get(doc,field+'_l') 
          || _.get(doc,field+'_dt') 
           || _.get(doc,field+'_t') 
          || _.get(doc,field);
        displayFields[field] = _.isArray(fieldValue) ? fieldValue[0] : fieldValue;
      });

      return displayFields;
    }
  }
})();
