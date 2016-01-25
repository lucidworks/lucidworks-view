(function() {
  'use strict';
  angular.module('fusionSeedApp.controllers.home', ['fusionSeedApp.services'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$scope', 'ConfigService', 'QueryService',
    'Orwell'
  ];

  function HomeController($log, $scope, ConfigService, QueryService, Orwell) {
    var self = this; //eslint-disable-line
    var resultsObservable;

    var init = function() {
      self.searchQuery = '*:*';
      self.search = doSearch;

      resultsObservable = Orwell.getObservable('queryResults');
      resultsObservable.addObserver(function(data) {
        if (data.hasOwnProperty('response')) {
          self.numFound = data.response.numFound;
        } else {
          self.numFound = 0;
        }
      });
    };

    init();
    doSearch();

    function doSearch() {
      $log.info('Searching...');
      var queryObject = {
        q: self.searchQuery,
        start: 0
      };

      QueryService
        .setQuery(queryObject);
    }
  }
})();
