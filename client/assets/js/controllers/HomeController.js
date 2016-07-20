(function() {
  'use strict';
  var observerHandle = null;
  angular
    .module('lucidworksView.controllers.home', ['lucidworksView.services', 'angucomplete-alt', 'angular-humanize'])
    .config(Config)
    .controller('HomeController', HomeController);

    
   /**
   * register an observable used for triggering the perDocument details pages
   * as per https://github.com/lucidworks/searchhub/tree/GH-28-doc-view
   */
  function Config(OrwellProvider) {
    'ngInject';
    OrwellProvider.createObservable('perDocument', {});
  }
   

  function HomeController($filter, $timeout, ConfigService, QueryService, URLService, Orwell, AuthService, _, $log,$rootScope,$location) {

    'ngInject';
    var hc = this; //eslint-disable-line
    var resultsObservable;
    var perDocumentObservable;
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
      hc.clear = clearSearch;
      hc.appName = ConfigService.config.search_app_title;
      hc.logoLocation = ConfigService.config.logo_location;
      hc.status = 'loading';
      hc.lastQuery = '';
      hc.sorting = {};
      hc.grouped = false;
      // defaults used by perDocument events
      hc.perDocument = false;
      hc.showRecommendations = false;
      hc.showFacets = true;

      query = URLService.getQueryFromUrl();
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

      });

      /*
      * When a the observable has a docId put into it, 
      *  -turn off facets and turn on perDocument 
      *  The perDocument flag will signal the templates/home_main-content-frame.html
      *  to switch to the <perdocument> directive in the main view
      */
      perDocumentObservable = Orwell.getObservable('perDocument');
      if(observerHandle === null) {
        $log.info("HC perD addObserver");
        observerHandle = perDocumentObservable.addObserver(function (data){
          $log.info("HC perD observer triggered: ", data);
          if (data.docId) {
            hc.perDocument = true;
            hc.showFacets = false;
            hc.showRecommendations = true;
          } else {
            hc.perDocument = false;
            hc.showFacets = true;
            hc.showRecommendations = false;
            //detail results will have replaced the results documents from solr
            //with the single detail document.  Rerun query to set it back
            $timeout(function(){
              URLService.setQuery(URLService.getQueryFromUrl());
            });
          }
        });

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
          var x = hc;
          $log.info('routeChangeStart next:' + next + ' current:' + current);
        });

        $rootScope.$on('$locationChangeSuccess', function() {
          var x = hc;
          $log.info('locationchageSuccess');
        });
        $rootScope.$on('$locationChangeStart', function(event, newUrl,oldUrl,newState,oldState) {
          var x = hc;
          var y = URLService.getQueryFromUrl();
          if(hc.perDocument){
            event.preventDefault();
            hc.perDocument = false;
            hc.showFacets = true;
            hc.showRecommendations = false;
            $log.info('setting query to oldUrl:' + oldUrl);

            //detail results will have replaced the results documents from solr
            //with the single detail document.  Rerun query to set it back

            // ALERT: this syntax requires a modification to URLService.getQUeryFromURL
            URLService.setQuery(URLService.getQueryFromUrl(oldUrl));
          }

          $log.info('locationChangeStart');
        });

        $rootScope.$watch(function() { return $location.path() },
          function(newLocation, oldLocation) {
            var x = hc;
            $log.info('location watch newLocation:' + newLocation + ' oldLocation:' + oldLocation);
          }
        );

      }

      // Force set the query object to change one digest cycle later
      // than the digest cycle of the initial load-rendering
      // The $timeout is needed or else the query to fusion is not made.
      $timeout(function(){
        URLService.setQuery(query);
      });
    }

    function checkResultsType(data){
      if (data.hasOwnProperty('response')) {
        hc.numFound = data.response.numFound;
        hc.numFoundFormatted = $filter('humanizeNumberFormat')(hc.numFound, 0);
        hc.lastQuery = data.responseHeader.params.q;
        hc.showFacets = checkForFacets(data);
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
        hc.showFacets = checkForFacets(data);
      }
      else {
        hc.numFound = 0;
      }
    }

    // Checks from data if it has supported facet type.
    // TODO: Refactor this to make sure it detects facet types from available modules.
    function checkForFacets(data){
      if(_.has(data, 'facet_counts')){
        return ((!_.isEmpty(data.facet_counts.facet_fields)) || (!_.isEmpty(data.facet_counts.facet_ranges))) && !hc.perDocument;
      }
      else{
        return false;
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

    function clearSearch(){
      hc.searchQuery = '*';
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
