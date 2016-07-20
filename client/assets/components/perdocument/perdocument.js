(function () {
  'use strict';
  var observerHandle = null;
  angular
      .module('lucidworksView.components.perdocument', ['lucidworksView.services',
        'angucomplete-alt', 'angular-humanize'])
      .directive('perdocument', perdocument);

  function perdocument() {
    'ngInject';
    console.log("pd init" );
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/perdocument/perdocument.html',
      controller: DocumentController,
      controllerAs: 'dc',
      bindToController: {
      },
      scope: true,
      replace: true
    };
  }


  function DocumentController(QueryDataService, Orwell, $log,ConfigService,$scope, $rootScope,$location) {
    'ngInject';
    $log.info("DC init");
    var dc = this; //eslint-disable-line
    var perDocumentObservable = Orwell.getObservable('perDocument');
    dc.decorateDocument = decorateDocument;
    dc.getDocType = ConfigService.getDocType;
    dc.backToSearchResults = backToSearchResults;
    dc.docs = [];//TODO: hack so that we can reuse the document template directives
    dc.docType = "";
    activate();

    ////////////////

    /**
     * Initializes a search from the URL object
     */
    function activate() {

      if(observerHandle === null) {
        observerHandle = perDocumentObservable.addObserver(function (data){
          if(data && data.docId) {
            dc.doc_id = data.docId;

            $log.info("PD perD", data, dc.doc_id);
            var query = {
              "q": "id:" + encodeURIComponent(dc.doc_id),
              "wt": "json",
              "rows": 1
            };
            var thePromise = QueryDataService.getQueryResults(query);
            //var thePromise = QueryPipelineService.query(query);
            thePromise.then(function (data){
              parseDocument(data);
              $log.info("resolved", data, dc.docs);
            }, function (reason){
              $log.warn("Unabled to fetch the document", reason);
              perDocumentObservable.setContent({});
            });
          }
        });

      }
    }

    function backToSearchResults(){
      //TODO: send a signal
      perDocumentObservable.setContent({});
    }

    /**
     * Decorates the document object before sending to the document directive.
     * @param  {object} doc Document object
     * @return {object}     Document object
     */
    function decorateDocument(doc) {
      return doc;
    }

    function parseDocument(data) {
      $log.info("parse", data);
      //we only expect one here, since we are querying by ID
      if (data && data.response && data.response.numFound > 0) {
        dc.docs = data.response.docs;

        $log.info("DC.doc", dc.docs);
      } else {
        $log.warn("Unable to retrieve the document")
      }
    }

  }
})();
