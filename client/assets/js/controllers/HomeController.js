(function() {
  'use strict';

  angular
    .module('lucidworksView.controllers.home', ['lucidworksView.services', 'angucomplete-alt', 'angular-humanize'])
    .controller('HomeController', HomeController);


  function HomeController($filter, $timeout, ConfigService, QueryService, URLService, Orwell, AuthService, _, $log) {

    'ngInject';
    var hc = this; //eslint-disable-line
    var resultsObservable;
    var query;
    var sorting;

    hc.searchQuery = '*';

    activate();
    ////////////////
    function loadChecking () {

      var mainBlock = $('#main-hiding-block');
      var insertedBlock = $('.inserted-hiding-block');
      function isDisplayed (element) {
        var display = element.css('display');
          return ((display !== 'none'));
      }
      console.log ('----- rules block load checking ---------');
      console.log("main filter block: " + mainBlock[0]);
      console.log("inserted filter block: " + insertedBlock[0]);
      //if main and inserted blocks not "undefined" - blocks loaded but hidden;
        if (mainBlock && insertedBlock) {
          var isVisibleMain = mainBlock.is(':visible');           //true if block has width and height > 0, and 'display' is not 'none'
          var isVisibleInserted = insertedBlock.is(':visible');
          console.log('main block visible: ' + isVisibleMain);
          console.log('inserted block visible: ' + isVisibleInserted);

          var isDisplayedMain = isDisplayed(mainBlock);           //false if 'display: none'
          var isDisplayedInserted = isDisplayed(insertedBlock);
          console.log('main block displayed: ' + isDisplayedMain);
          console.log('inserted block displayed: ' + isDisplayedInserted);
        }
        if (hc.fusion) {
          console.log('applicable_rules: ');
          console.log(hc.fusion.applicable_rules);
          //if applicable_rules - "undefined", inserted block gets class hidden');
        } else {
          console.log('applicable_rules not loaded');
        }
      console.log ('----- end rules block load checking ---------');
    }

    /**
     * Initializes a search from the URL object
     */
    function activate() {
      hc.search = doSearch;
      hc.logout = logout;
      hc.appName = ConfigService.config.search_app_title;
      hc.logoLocation = ConfigService.config.logo_location;
      hc.status = 'loading';
      hc.lastQuery = '';
      hc.sorting = {};
      hc.grouped = false;
      hc.simulation = {
        'rules.exclude': [],
        tags: [],
        tags_exclude: [],
        now: null
      };

      query = URLService.getQueryFromUrl();
      hc.simulation = _.pick(query, 'rules.exclude', 'tags', 'tags_exclude', 'now');
      console.log('==== Page loaded ====');

      //Setting the query object... also populating the the view model
      hc.searchQuery = _.get(query,'q','*');
      // Use an observable to get the contents of a queryResults after it is updated.
      resultsObservable = Orwell.getObservable('queryResults');
      resultsObservable.addObserver(function(data) {
        // updateStatus();
        checkResultsType(data);
        updateStatus();
        // Initializing sorting
        sorting = hc.sorting;
        sorting.switchSort = switchSort;
        createSortList();

        hc.fusion = data.fusion;
        console.log('---after getting fusion');
        loadChecking();
      });

      /**
       *
       * @param range DateRange string that looks like "[2016-08-02T00:00 TO 2016-08-26T00:00]"
       * */
      hc.parseRange = function (range) {
        var res = range.match(/(\d\d\d\d-\d\d-\d\d)T([^\s]+) TO (\d\d\d\d-\d\d-\d\d)T(\d\d:\d\d)/);
        if (!res) {
          return {};
        }

        return {
          startDate: res[1],
          startTime: res[2],
          endDate:   res[3],
          endTime:   res[4]
        };
      };

      hc.getUIId = function (id) {
        return id && id.replace(/[^\d\w]/gi, "");
      };

      function createAndPushOrPull(array, value) {
        if (!array) {
          array = [];
        }

        if (!array.length) {
          array = _.values(array);
        }

        var index = array.indexOf(value);
        if (index == -1) {
          array.push(value);
        } else {
          array.splice(index, 1);
        }

        return array;
      }

      hc.includeRulesWithTag = function (ruleTag, include) {
        console.log("======== includeRulesWithTag =========", ruleTag, include);

        var optionName = include === true ? 'tags' : 'tags_exclude';
        hc.simulation[optionName] = createAndPushOrPull(hc.simulation[optionName], ruleTag);

        doSearch();
      };

      hc.updateRules = function ($event, rule) {
        console.log("updateRules -1- ", rule, hc.simulation);
        $event.stopPropagation();

        hc.simulation['rules.exclude'] = createAndPushOrPull(hc.simulation['rules.exclude'], rule.id);

        console.log("updateRules -2- ", hc.simulation);
        doSearch();
      };

      // Force set the query object to change one digest cycle later
      // than the digest cycle of the initial load-rendering
      // The $timeout is needed or else the query to fusion is not made.
      $timeout(function(){

        console.log('---before getting fusion');
        loadChecking();
        URLService.setQuery(query);
      });


    }

    function checkResultsType(data){
      if (data.hasOwnProperty('response')) {
        hc.numFound = data.response.numFound;
        hc.numFoundFormatted = $filter('humanizeNumberFormat')(hc.numFound, 0);
        hc.lastQuery = data.responseHeader.params.q;
        if(_.has(data, 'facet_counts')){
          return hc.showFacets = !_.isEmpty(data.facet_counts.facet_fields);
        }
        // Make sure you check for all the supported facets before for empty-ness
        // before toggling the `showFacets` flag
      }
      else if(_.has(data, 'grouped')){
        hc.lastQuery = data.responseHeader.params.q;
        $log.debug(data.grouped, 'grouppeeeddd');
        var numFoundArray = [];
        _.each(data.grouped, function(group){
          numFoundArray.push(group.matches);
        });
        // For grouping, giving total number of documents found
        hc.numFound = _.sum(numFoundArray);
        hc.numFoundFormatted = $filter('humanizeNumberFormat')(hc.numFound, 0);
        if(_.has(data, 'facet_counts')){
          return hc.showFacets = !_.isEmpty(data.facet_counts.facet_fields);
        }
      }
      else {
        hc.numFound = 0;
      }
    }

    function updateStatus(){
      var status = '';
      if(hc.numFound === 0){
        status = 'no-results';
        if(hc.lastQuery === ''){
          status = 'get-started';
        }
      } else {
        status = 'normal';
      }
      hc.status = status;
    }


    function removeArray(query, name) {
      if (!query[name] || query[name].length == 0) {
        delete query[name]
      }
    }

    /**
     * Initializes a new search.
     */
    function doSearch() {
      var prevSearchQuery = query.q;
      var newSearchQuery = hc.searchQuery;
      if (prevSearchQuery != newSearchQuery) {
        hc.simulation = {};
      }

      console.log("-- doSearch --", prevSearchQuery);


      query = {
        q: hc.searchQuery,
        start: 0,
        fq: [] // TODO better solution for turning off fq on a new query
      };

      _.extend(query, hc.simulation);
      if (!query.now) {
        delete query.now
      }

      removeArray(query, 'tags');
      removeArray(query, 'tags_exclude');
      removeArray(query, 'rules.exclude');
      removeArray(query, 'fq');

      console.log('doSearch', query);
      URLService.setQuery(query);
    }
    hc.doSearch = doSearch;

    /**
     * Creates a sorting list from ConfigService
     */
    function createSortList(){
      var sortOptions = [{label:'default sort', type:'default', order:'', active: true}];
      _.forEach(ConfigService.config.sort_fields, function(value){
        sortOptions.push({label: value, type: 'text', order: 'asc', active: false});
        sortOptions.push({label: value, type: 'text', order: 'desc', active: false});
      });
      sorting.sortOptions = sortOptions;
      sorting.selectedSort = sorting.sortOptions[0];
    }

    /**
     * Switches sort parameter in the page
     */
    function switchSort(sort){
      sorting.selectedSort = sort;
      var query = QueryService.getQueryObject();
      switch(sort.type) {
        case 'text':
          query.sort = sort.label+' '+sort.order;
          URLService.setQuery(query);
          break;
        default:
          delete query.sort;
          URLService.setQuery(query);
      }
    }

    /**
     * Logs a user out of a session.
     */
    function logout(){
      AuthService.destroySession();
    }
  }
})();
