(function () {
  angular
    .module('lucidworksView.utils.docs', [])
    .factory('DocsHelper', DocsHelper);

  /**
   * DocsHelper
   *
   * @param {Service} _    lodash
   * @return {Object}      The properties
   */
  function DocsHelper(_) {
    'ngInject';
    return {
      populateFieldLabels: populateFieldLabels,
      concatMultivaluedFields: concatMultivaluedFields,
      parseWildcards: parseWildcards,
      selectFields: selectFields
    };

    /**
     * Select Fields given a document and fieldArray
     * @param  {object} document   [description]
     * @param  {array} fieldArray  [description]
     * @return {object}            The selected fields
     */
    function selectFields(document, fieldArray) {
      return _.pick(document, fieldArray);
    }

    /**
     * Parse a fields list for a wildcard, if present return an array of all fields.
     * @param  {array}  fieldsList List of fields and/or wildcards.
     * @param  {object} doc        The document fields.
     * @return {array}             A list of all applicable fields.
     */
    function parseWildcards(fieldsList, doc){
      var wildcardId = _.indexOf(fieldsList, '*');
      if(wildcardId > -1){
        // Slice the list to just the fields before the first wildcard to order them first.
        var fieldsBeforeWildcard = _.slice(fieldsList, 0, wildcardId);
        // Add all existing fields to wildcard.
        fieldsList = _.union(fieldsBeforeWildcard, Object.keys(doc));
        // Remove the angular hashKey.
        _.remove(fieldsList, function(n) {
          switch(n){
          case '$$hashKey':
            return true;
          }
          return false;
        });
      }
      return fieldsList;
    }

    /**
     * Returns human readable field names for a document
     *
     * @param  {object} document      The document objects to populate.
     * @param  {object} fieldLabelMap The field to label map.
     * @return {object}               A version of the document with populated labels.
     */
    function populateFieldLabels(document, fieldLabelMap) {
      //TODO: populate the field names from the map

      var unzippedDocuments = _.chain(document)
        .map(function (value, key) {
          return fieldLabelMap.hasOwnProperty(key) ? {
            key: fieldLabelMap[key],
            value: value
          } : {
            key: key,
            value: value
          };
        })
        .value();
      var blankDocument = {};
      _.forEach(unzippedDocuments, function (pair) {
        blankDocument[pair.key] = pair.value;
      });
      return blankDocument;
    }

    /**
     * concatMultivaluedFields Concats all multi-value Solr fields
     * @param  {Object} document The document
     * @return {Object}          the document with joined mulitvalued fields
     */
    function concatMultivaluedFields(document) {
      var blankDocument = {};
      _.forEach(document, function (value, key) {
        blankDocument[key] = (value instanceof Array) ? value.join(' ') : value;
      });
      return blankDocument;
    }
  }
})();
