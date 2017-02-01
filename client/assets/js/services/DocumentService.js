(function () {
  'use strict';

  angular
    .module('lucidworksView.services.document', [])
    .factory('DocumentService', DocumentService);

  function DocumentService(PaginateService, SignalsService) {
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

      //TODO: nasty! refactor
      _.forEach(fieldsList,function(field) {
        var fieldValue = _.find(doc,function(value,key) {  
          return _.startsWith(key,field);
        });
        displayFields[field] = _.isArray(fieldValue) ? fieldValue[0] : fieldValue;
      });

      return displayFields;
    }
  }
})();
