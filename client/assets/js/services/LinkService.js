(function () {
  'use strict';

  angular
    .module('fusionSeedApp.services.link', ['rison'])
    .constant('BLANK_QUERY', blankQuery)
    .constant('QUERY_PARAM', 'query')
    .factory('LinkService', LinkService);

  var blankQuery = {
    q: '*:*',
    start: 0
  };

  function LinkService($log, $rison, $state, $location, QueryService, BLANK_QUERY,
    QUERY_PARAM) {
    'ngInject';
    return {
      setQuery: setQuery,
      getQueryFromUrl: getQueryFromUrl
    };

    function setQuery(queryObject) {
      QueryService.setQuery(queryObject);
      var queryObjectToBeStringed = _.clone(QueryService.getQueryObject(),true);
      //Only need the slashes to get encoded, so that app state doesn't change
      queryObjectToBeStringed.q = queryObjectToBeStringed.q.replace(/\//g,'%2F');
      var queryObjectString = $rison.stringify(queryObjectToBeStringed);
      var newStateObject = {};
      newStateObject[QUERY_PARAM] = queryObjectString;
      // Adding reloadOnSearch:false for now fixes the double reload bug SU-60
      // @see http://stackoverflow.com/a/22863315
      $state.go('home', newStateObject, {notify: false, reloadOnSearch: false});
    }

    function getQueryFromUrl() {
      var queryString = $location.search()[QUERY_PARAM];
      return queryString ? $rison.parse(decodeURIComponent(queryString)) : BLANK_QUERY;
    }
  }
})();
