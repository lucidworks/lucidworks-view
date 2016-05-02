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

      query = URLService.getQueryFromUrl();
      //Setting the query object... also populating the the view model
      hc.searchQuery = _.get(query,'q','*');

      // Use an observable to get the contents of a queryResults after it is updated.
      resultsObservable = Orwell.getObservable('queryResults');
      resultsObservable.addObserver(function(data) {
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
          if(_.has(data, 'facet_counts')){
            return hc.showFacets = !_.isEmpty(data.facet_counts.facet_fields);
          }
          // no num found for grouping since pagination doesn't work yet
          // hc.numFound = data.grouped[0].matches;
          // $log.debug(numFound)
          // // hc.numFoundFormatted = $filter('humanizeNumberFormat')(hc.numFound, 0);
          // hc.lastQuery = data.responseHeader.params.q;
        }
        else {
          hc.numFound = 0;
        }
        updateStatus();

        // Initializing sorting
        sorting = hc.sorting;
        sorting.switchSort = switchSort;
        createSortList();

      });

      // Force set the query object to change one digest cycle later
      // than the digest cycle of the initial load-rendering
      // The $timeout is needed or else the query to fusion is not made.
      $timeout(function(){
        URLService.setQuery(query);
      });
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

    /**
     * Initializes a new search.
     */
    function doSearch() {
      query = {
        q: hc.searchQuery,
        start: 0,
        // TODO better solution for turning off fq on a new query
        fq: []
      };

      URLService.setQuery(query);
    }

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
