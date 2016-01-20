(function(){
  'use strict';
  angular.module('fusionSeedApp.controllers.home',['fusionSeedApp.services'])
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$log', '$scope', 'ConfigService', 'QueryService'];

  function HomeController($log, $scope, ConfigService, QueryService){
    var self = this;

    self.searchQuery = '';
    self.search = function(){
      $log.info("Searching...");
      var queryObject = {
        q: self.searchQuery
      };

      QueryService.getQuery(queryObject).then(function(resp){
        $log.info(resp); //Getting the solr response
      });
    };

    var init = function(){

    };
  }
})();
