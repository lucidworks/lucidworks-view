(function() {
  'use strict';
  angular
    .module('fusionSeedApp.controllers.home', ['fusionSeedApp.services', 'angucomplete-alt'])
    .controller('HomeController', HomeController);


  function HomeController($log, $scope, ConfigService, QueryService, LinkService, Orwell, AuthService, _) {

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

      query = LinkService.getQueryFromUrl();
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
      });

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
    }

    /**
     * Logs a user out of a session.
     */
    function logout(){
      AuthService.destroySession();
    }
  }
})();
