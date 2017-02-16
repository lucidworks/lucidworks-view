(function () {
  'use strict';

  angular
    .module('lucidworksView.services.document', [])
    .factory('DocumentService', DocumentService);

  function DocumentService(PaginateService, SignalsService) {
    'ngInject';

    return {
      setSignalsProperties: setSignalsProperties,
      setTemplateDisplayFields: setTemplateDisplayFields,
      postSignal: postSignal,
      getTemplateDisplayFieldName: getTemplateDisplayFieldName,
      decodeFieldValue: decodeFieldValue
    };

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
        var fieldValue =  _.get(doc,field+'_s')
          || _.get(doc,field+'_l')
          || _.get(doc,field+'_dt')
          || _.get(doc,field+'_t')
          || _.get(doc,field);
        displayFields[field] = _.isArray(fieldValue) ? fieldValue[0] : fieldValue;
      });

      return displayFields;
    }

    function postSignal(_signals, options){
      var paramsObj = {
        params: {
          position: _signals.position,
          page: _signals.page
        }
      };
      _.defaultsDeep(paramsObj, options);
      SignalsService.postClickSignal(_signals.signals_doc_id, paramsObj);
    }

    function getTemplateDisplayFieldName(doc, field){
      if(_.has(doc, field+'_s')){
        return field + '_s';
      } else if (_.has(doc, field+'_l')){
        return field + '_l';
      } else if (_.has(doc, field+'_dt')){
        return field + '_dt';
      } else if (_.has(doc, field+'_t')){
        return field + '_t';
      }
      return field;
    }

    function decodeFieldValue(doc, field){
      if(_.has(doc, field) && _.isArray(doc[field])){
        var x = _.has(doc, field + '[0]') ? decodeURIComponent(doc[field]) : doc[field];
        return x;
      }
      var y = doc[field] ? decodeURIComponent(doc[field]) : doc[field];
      return y;
    }
  }
})();
