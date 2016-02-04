/*global _*/
(function() {
  'use strict';
  angular.module('fusionSeedApp.controllers.home', ['fusionSeedApp.services','angucomplete-alt'])
    .controller('HomeController', HomeController);


  function HomeController($log, $scope, ConfigService, QueryService, Orwell, AuthService) {
    'ngInject';
    var hc = this; //eslint-disable-line
    var resultsObservable;

    activate();
    // initializes a search.
    doSearch();

    ////////////////

    function activate() {
      hc.searchQuery = '*:*';
      hc.search = doSearch;
      hc.lastQuery = '*:*';
      hc.logout = logout;

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
    }

    /**
     * Initializes a new search.
     */
    function doSearch() {
      $log.info('Searching...');
      var queryObject = {
        q: hc.searchQuery,
        start: 0,
      };

      QueryService
        .setQuery(queryObject);
    }

    /**
     * Logs a user out of a session.
     */
    function logout(){
      AuthService.destroySession();
    }
  }
})();
