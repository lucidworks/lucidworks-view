(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.documentList', ['fusionSeedApp.services.config',
      'ngOrwell', 'fusionSeedApp.services.landingPage'
    ])
    .directive('documentList', documentList);

  function documentList() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/documentList/documentList.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {},
      scope: true,
      replace: true
    };

  }


  function Controller($sce, $anchorScroll, Orwell, SignalsService) {
    'ngInject';
    var vm = this;
    vm.docs = [];
    vm.highlighting = {};
    vm.getDocType = getDocType;
    vm.decorateDocument = decorateDocument;

    activate();

    ////////

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function (data) {
        vm.docs = parseDocuments(data);
        vm.highlighting = parseHighlighting(data);
        vm.getDoctype = getDocType;
        $anchorScroll('topOfMainContent');
      });
    }

    /**
     * Get the document type for the document.
     * @param  {object} doc Document object
     * @return {string}     Type of document
     */
    function getDocType(doc){
      // Change to your collection datasource type name
      // if(doc['_lw_data_source_s'] === 'MyDatasource-default'){
      //   return doc['_lw_data_source_s'];
      // }
      return doc['_lw_data_source_type_s'];
    }

    /**
     * Decorates the document object before sending to the document directive.
     * @param  {object} doc Document object
     * @return {object}     Document object
     */
    function decorateDocument(doc){
      doc.__signals_doc_id__ = SignalsService.getSignalsDocumentId(doc);
      return doc;
    }

    /**
     * Get the documents from
     * @param  {object} data The result data.
     * @return {array}       The documents returned
     */
    function parseDocuments(data){
      var docs = [];
      if (data.hasOwnProperty('response')) {
        docs = data.response.docs;
      }
      return docs;
    }

    /**
     * Get highlighting from a document.
     * @param  {object} data The result data.
     * @return {object}      The highlighting results.
     */
    function parseHighlighting(data) {
      var highlighting = {};
      if (data.hasOwnProperty('highlighting')){
        _.each(data.highlighting, function(value, key){
          var vals = {};
          if (value) {
            _.each(Object.keys(value), function (key) {
              var val = value[key];
              _.each(val, function(high){
                vals[key] = $sce.trustAsHtml(high);
              });
            });
            highlighting[key] = vals;
          }
        });
      }
      return highlighting;
    }
  }
})();
