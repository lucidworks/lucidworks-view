(function(){
  'use strict';
  angular.module('fusionSeedApp.controllers.home',['fusionSeedApp.services'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$scope', 'ConfigService', 'QueryService', 'Orwell'];

  function HomeController($log, $scope, ConfigService, QueryService, Orwell){
    var self = this;
    var queryObservable;

    var init = function(){
      self.searchQuery = '*:*';
      self.search = doSearch;

      queryObservable = Orwell.getObservable('query');
    };

    init();
    doSearch();

    function doSearch(){
      $log.info("Searching...");
      var queryObject = {
        q: self.searchQuery,
        start: 0,
        rows: 20
      };

      QueryService.getQuery(queryObject).then(function(resp){
        $log.info(resp); //Getting the solr response
        queryObservable.setContent(resp);
        //TODO: Get something to do with the data
      });
    }
  }
})();
