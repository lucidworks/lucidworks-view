(function() {
  'use strict';
  angular.module('fusionSeedApp.controllers.home', ['fusionSeedApp.services','angucomplete-alt'])
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
      //Only to make the default value work, as Angular tracks by Object
      hc.resultsPerPageSelection = _.map([10,20,50,100],function(item){
        return {value: item};
      });
      hc.resultsPerPage = hc.resultsPerPageSelection[0]; //Setting the default

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
  }
})();
