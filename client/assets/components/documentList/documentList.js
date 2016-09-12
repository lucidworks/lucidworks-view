(function () {
  'use strict';

  angular
    .module('lucidworksView.components.documentList', ['lucidworksView.services.config',
      'ngOrwell', 'lucidworksView.services.landingPage'
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

  function Controller($sce, $log, $anchorScroll, Orwell, QueryDataService, ConfigService) {
    'ngInject';
    var vm = this;
    vm.docs = [];
    vm.highlighting = {};
    vm.getDocType = getDocType;
    vm.groupedResults = false;
    vm.toggleGroupedResults = toggleGroupedResults;
    vm.showGroupedResults = {};
    vm.getDocPosition = getDocPosition;
    vm.getMoreLikeThisFromObservable = getMoreLikeThisFromObservable;
    vm.getMoreLikeThis = getMoreLikeThis;
    vm.overlay = overlay;

    activate();

    ////////

    function overlay() {
      var el = document.getElementById("overlay");
      el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    }

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

    function isNotGrouped(data){
      return _.has(data, 'response');
    }
    function isGrouped(data){
      return _.has(data, 'grouped');
    }
    /**
     * Get the documents from
     * @param  {object} data The result data.
     * @return {array}       The documents returned
     */
    function parseDocuments(data){
      var docs = [];
      if (isNotGrouped(data)) {
        docs = data.response.docs;
      }
      else if(isGrouped(data)){
        vm.groupedResults = data.grouped;
        parseGrouping(vm.groupedResults);
      }
      return docs;
    }


    function toggleGroupedResults(toggle){
      vm.showGroupedResults[toggle] = !vm.showGroupedResults[toggle];
    }

    function parseGrouping(results){
      _.each(results, function(item){
        _.each(item.groups, function(group){
          if(_.has(group, 'groupValue') && group.groupValue !== null){
            vm.showGroupedResults[group.groupValue] = false;
          }
          else{
            vm.showGroupedResults['noGroupedValue'] = true;
          };
        });
      });
    }

    /**
     * Get highlighting from a document.
     * @param  {object} data The result data.
     * @return {object}      The highlighting results.
     */
    function parseHighlighting(data) {
      if (data.hasOwnProperty('highlighting')){
        _.each(data.highlighting, function(value, key){
          var vals = {};
          if (value) {
            _.each(Object.keys(value), function (key) {
              $log.debug('highlight', value);
              var val = value[key];
              _.each(val, function(high){
                vals[key] = $sce.trustAsHtml(high);
              });
            });
            vm.highlighting[key] = vals;
          }
        });
      }
      else{
        vm.highlighting = {};
      }
      return vm.highlighting;
    }

    /**
     * Get index of the doc in the returned documentList
     * @param  {object} doc  Doc of which the index is required
     * @param  {object} docs List of returned documents
     * @return {number}      The index of the document in the documentList
     */
    function getDocPosition(doc, docs){
      return _.findIndex(docs, doc);
    }

    /*
    * Manipulates the mlt results to make them more readable in the css
    * @returns String parsedMoreLikeThisResults String to supply the html
    */
    function manipulateResults() {
      var rawMoreLikeThisResults = Orwell.getObservable('mltResults').content.response.docs;
      // console.log(rawMoreLikeThisResults);
      var parsedMoreLikeThisResults = ""

      for (var resultIndex in rawMoreLikeThisResults) {
        var moreLikeThisToParse = rawMoreLikeThisResults[resultIndex];
        var index = parseInt(resultIndex) + 1
        if (moreLikeThisToParse.title != null) {
          parsedMoreLikeThisResults += index.toString() + ": " + moreLikeThisToParse.title + "\n";
        }
        else{
          parsedMoreLikeThisResults += moreLikeThisToParse.id + "\n";
        }
      }
      // console.log(parsedMoreLikeThisResults);
      return parsedMoreLikeThisResults;
    }

    /** 
     * Get the moreLikethis recommendations from a query pipeline in Fusion. This particular method gets the results from 
     * an observable that gets populated on page load.
     * @param {object} doc       Doc of which the id is required to return the appropriate mlt results
     * @return {list} moreLikeThisForDoc  List of "more like this" responses to the document in question
     */
    function getMoreLikeThisFromObservable(doc) {
      var mltResultsObservable = Orwell.getObservable('mltResults');
      console.log(mltResultsObservable.content);
      var docs;
      var moreLikeThisForDoc = [];

      if (mltResultsObservable.content == null || mltResultsObservable.content == undefined) {
        console.log("We have no more like This");
        return moreLikeThisForDoc;
      }

      else if (mltResultsObservable.content != null) {
        for (var item in mltResultsObservable.content) {
          if (item == doc.id) {
            docs = mltResultsObservable[item].docs;
            break;
          }
        }
      }
      if (docs != undefined) {
        if (docs.length == 0) {
          return "No Related Items Found!"
        }
        else {
          for (var doc in docs){ 
            moreLikeThisForDoc.push(docs[doc].title);
          }
        }
      }
      console.log(moreLikeThisForDoc);
      return moreLikeThisForDoc;
    }

    /**
     * Get moreLikeThis recommendations from a query pipeline in fusion. This particular method gets the 
     * results by launching the mlt search for the particular doc in question and returning the results.
     * @param {object} doc       Doc of which the id is required to launch the appropriate query 
     * @return {list} mltResults List of "more Like This" responses to the document in question
     */
    function getMoreLikeThis(doc){
      vm.overlay();
      console.log("The Id is", doc.id);
      var idField = ConfigService.getRecommenderIdField();
      
      console.log("The Field we want to Id on is", idField);
      if (idField == null) {
        console.log("We don't have an id field!");
        idField = "id"; 
      }
      else {
        console.log("We have an id field!", idField);  
      }
      
      var obj = {};
      obj[idField] = doc.id;
      obj['wt'] = 'json';

      console.log(obj);
      QueryDataService.getMoreLikeThisResults(obj, true).then(displayResults);
      
      function displayResults(response){
        var parsedMoreLikeThisResults = manipulateResults();
        document.getElementById('MoreLikeThisResultsFromPipeline').innerHTML = parsedMoreLikeThisResults;
      } 
    }
  }
})();
