(function(){
  'use strict';
  angular.module('fusionSeedApp.controllers.home',['fusionSeedApp.services'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$scope', 'ConfigService', 'QueryService', 'Orwell'];

  function HomeController($log, $scope, ConfigService, QueryService, Orwell){
    var self = this;

    var init = function(){
      self.searchQuery = '*:*';
      self.search = doSearch;

      Orwell.createObservable('query',{});
    };

    init();

    function doSearch(){
      $log.info("Searching...");
      var queryObject = {
        q: self.searchQuery
      };

      QueryService.getQuery(queryObject).then(function(resp){
        $log.info(resp); //Getting the solr response
        //TODO: Get something to do with the data
      });
    }
  }
})();
