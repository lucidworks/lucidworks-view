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

    function doSearch() {
      $log.info('Searching...');
      var queryObject = {
        q: hc.searchQuery,
        start: 0,
        rows: hc.resultsPerPage.value
      };

      QueryService
        .setQuery(queryObject);
    }

    function logout(){
      AuthService.destroySession();
    }
  }
})();
