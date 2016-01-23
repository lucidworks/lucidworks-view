(function(){
  angular.module('fusionSeedApp.utils.docs',[])
  .factory('DocsHelper', DocsHelper);

  DocsHelper.$inject = ['$log','_'];
  function DocsHelper($log, _){
    return {
      populateFieldLabels: populateFieldLabels,
      concatMultivaluedFields: concatMultivaluedFields,
      selectFields: selectFields
    };

    function selectFields(document, fieldArray){
      return _.pick(document, fieldArray);
    }

    /**
     * Returns human readable field names for a document
     */
    function populateFieldLabels(document, fieldMap){
      //TODO: populate the field names from the map

      var unzippedDocuments = _.chain(document)
      .map(function(value, key){
        return fieldMap.hasOwnProperty(key)?{key: fieldMap[key], value: value}:{key: key, value: value};
      })
      .value();
      var blankDocument = {};
      _.forEach(unzippedDocuments, function(pair){
        blankDocument[pair.key] = pair.value;
      });
      return blankDocument;
    }

    /**
     * [concatMultivaluedFields Concats all multi-value Solr fields]
     * @param  {[Object]} document [the document]
     * @return {[Object]}          [the document with joined mulitvalued fields]
     */
    function concatMultivaluedFields(document){
      var blankDocument = {};
      _.forEach(document, function(value, key){
        blankDocument[key] = (value instanceof Array)?value.join(' '):value;
      });
      return blankDocument;
    }
  }
})();
