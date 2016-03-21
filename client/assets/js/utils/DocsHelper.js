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
     * Returns human readable field names for a document
     *
     * @param  {object} document [description]
     * @param  {object} fieldMap [description]
     * @return {[type]}          [description]
     */
    function populateFieldLabels(document, fieldMap) {
      //TODO: populate the field names from the map

      var unzippedDocuments = _.chain(document)
        .map(function (value, key) {
          return fieldMap.hasOwnProperty(key) ? {
            key: fieldMap[key],
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
