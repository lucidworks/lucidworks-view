(function(){
  angular.module('fusionSeedApp.utils.docs',[])
  .service('DocsHelper', DocsHelper);

  DocsHelper.$inject = ['$log','_'];
  function DocsHelper($log, _){
    return {
      populateFieldLabels: populateFieldLabels,
      concatMultivaluedFields: concatMultivaluedFields
    };

    /**
     * Returns human readable field names for a document
     */
    function populateFieldLabels(document, fieldMap){
      //TODO: populate the field names from the map

      var unzippedDocument = _.chain(document)
      .map(function(key, value){
        return fieldMap.hasOwnProperty(key)?{key: fieldMap[key], value: value}:{key: key, value: value};
      })
      .value();
      var blankDocument = {};
      _.forEach(unzippedDocument, function(pair){
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
      _.forEach(document, function(key){
        blankDocument[key] = (document[key] instanceof Array)?document[key].join(' '):document[key];
      });
      return blankDocument;
    }
  }
})();
