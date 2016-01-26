(function() {
  'use strict';
  angular.module('fusionSeedApp.controllers.home', ['fusionSeedApp.services'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$scope', 'ConfigService', 'QueryService',
    'Orwell'
  ];

  function HomeController($log, $scope, ConfigService, QueryService, Orwell) {
    var hc = this; //eslint-disable-line
    var resultsObservable;

    activate();
    doSearch();

    function activate() {
      hc.searchQuery = '*:*';
      hc.search = doSearch;
      hc.lastQuery = '*:*';

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
        start: 0
      };

      QueryService
        .setQuery(queryObject);
    }
  }
})();
