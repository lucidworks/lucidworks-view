(function () {
  'use strict';

  angular
    .module('fusionSeedApp.services.link', [])
    .constant('BLANK_QUERY', blankQuery)
    .constant('QUERY_PARAM', 'query')
    .factory('LinkService', LinkService);

  var blankQuery = {
    q: '*:*',
    start: 0
  };

  function LinkService($log, $rison, $location, QueryService, BLANK_QUERY, QUERY_PARAM) {
    'ngInject';
    return {
      setQuery: setQuery,
      getQueryFromUrl: getQueryFromUrl
    };

    function setQuery(queryObject){
      var queryObjectString = $rison.stringify(queryObject);
      $location.search(QUERY_PARAM, queryObjectString)
      QueryService.setQuery(queryObject);
    }

    function getQueryFromUrl(){
      var urlQuery = $location.search()[QUERY_PARAM];
      if(urlQuery){
        return $rison.parse($location.search().query);
      }
      else{
        return BLANK_QUERY;
      }
    }
  }
})();
