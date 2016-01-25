(function(){
  'use strict';
  angular.module('fusionSeedApp.controllers.home',['fusionSeedApp.services'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$scope', 'ConfigService', 'QueryService', 'Orwell'];

  function HomeController($log, $scope, ConfigService, QueryService, Orwell){
    var self = this;//eslint-disable-line
    var queryObservable;

    var init = function(){
      self.searchQuery = '*:*';
      self.search = doSearch;

      queryObservable = Orwell.getObservable('query');
      queryObservable.addObserver(function(data){
        if(data.hasOwnProperty('response')){
          self.numFound = data.response.numFound;
        } else {
          self.numFound = 0;
        }
      });
    };

    init();
    doSearch();

    function doSearch(){
      $log.info('Searching...');
      var queryObject = {
        q: self.searchQuery
      };

      QueryService.getQuery(queryObject).then(function(resp){
        queryObservable.setContent(resp);
      });
    }
  }
})();
