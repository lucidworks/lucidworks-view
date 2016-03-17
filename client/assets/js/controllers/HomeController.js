(function() {
  'use strict';
  angular
    .module('fusionSeedApp.controllers.home', ['fusionSeedApp.services', 'angucomplete-alt'])
    .controller('HomeController', HomeController);


  function HomeController($scope, $log, ConfigService, QueryService, URLService, Orwell, AuthService, _, $timeout, $rootScope) {

    'ngInject';
    var hc = this; //eslint-disable-line
    var resultsObservable;
    var query;

    hc.searchQuery = '*:*';

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

      query = URLService.getQueryFromUrl();
      //Setting the query object... also populating the the view model
      hc.searchQuery = _.get(query,'q','*:*');

      // Use an observable to get the contents of a queryResults after it is updated.
      resultsObservable = Orwell.getObservable('queryResults');
      resultsObservable.addObserver(function(data) {
        if (data.hasOwnProperty('response')) {
          hc.numFound = data.response.numFound;
          hc.lastQuery = data.responseHeader.params.q;
        } else {
          hc.numFound = 0;
        }
        updateStatus();
      });

      URLService.setQuery(query);
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
     * Logs a user out of a session.
     */
    function logout(){
      AuthService.destroySession();
    }
  }
})();
