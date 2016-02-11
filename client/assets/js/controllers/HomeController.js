(function() {
  'use strict';
  angular
    .module('fusionSeedApp.controllers.home', ['fusionSeedApp.services', 'angucomplete-alt'])
    .controller('HomeController', HomeController);


  function HomeController($log, $scope, ConfigService, QueryService, LinkService, Orwell, AuthService, $rison, $state, $location) {
    'ngInject';
    var hc = this; //eslint-disable-line
    var resultsObservable;
    var query;
    var blankQuery =

    hc.searchQuery = "*:*";

    activate();
    // initializes a search.
    // doSearch();

    ////////////////

    function activate() {
      hc.search = doSearch;
      hc.logout = logout;
      hc.appName = ConfigService.config.searchAppTitle;

      query = LinkService.getQueryFromUrl();

      // Use an observable to get the contents of a queryResults after it is updated.
      resultsObservable = Orwell.getObservable('queryResults');
      resultsObservable.addObserver(function(data) {
        if (data.hasOwnProperty('response')) {
          hc.numFound = data.response.numFound;
          hc.lastQuery = data.responseHeader.params.q;
        } else {
          hc.numFound = 0;
        }
      });

      //Setting the query object that listened as a observable...
      QueryService.setQuery(query);
    }

    /**
     * Initializes a new search.
     */
    function doSearch() {
      $log.info('Searching...');
      query = {
        q: hc.searchQuery,
        start: 0
      };
      LinkService.setQuery(query);
      // var queryObjectString = $rison.stringify(query);
      // $state.go('home', {query: queryObjectString});
    }

    /**
     * Logs a user out of a session.
     */
    function logout(){
      AuthService.destroySession();
    }
  }
})();
