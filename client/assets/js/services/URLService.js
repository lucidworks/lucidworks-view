(function () {
  'use strict';

  angular
    .module('lucidworksView.services.url', ['rison'])
    .constant('BLANK_QUERY', blankQuery)
    .constant('QUERY_PARAM', 'query')
    .factory('URLService', URLService);

  var blankQuery = {
    q: '*',
    start: 0
  };

  function URLService($log, $rison, $state, $location, QueryService, BLANK_QUERY,
    QUERY_PARAM) {
    'ngInject';
    return {
      setQuery: setQuery,
      getQueryFromUrl: getQueryFromUrl
    };

    //////////

    /**
     * Sets the query object that will be updated
     * on the URL bar and get passed
     * on to QueryService
     * for a search
     * @param {object} queryObject The query object
     */
    function setQuery(queryObject) {
      QueryService.setQuery(queryObject);
      var queryObjectToBeStringed = _.clone(QueryService.getQueryObject(),true);
      //Only need the slashes to get encoded, so that app state doesn't change
      queryObjectToBeStringed = encodeSlashes(queryObjectToBeStringed);
      var queryObjectString = $rison.stringify(queryObjectToBeStringed);
      var newStateObject = {};
      newStateObject[QUERY_PARAM] = queryObjectString;
      // Adding reloadOnSearch:false for now fixes the double reload bug SU-60
      // @see http://stackoverflow.com/a/22863315
      $state.go('home', newStateObject, {notify: false, reloadOnSearch: false});
    }

    /**
     * Gets query object from URL
     */
    function getQueryFromUrl() {
      var queryString = $location.search()[QUERY_PARAM];
      var queryObject;
      try{
        queryObject = queryString ? $rison.parse(decodeURIComponent(queryString)):BLANK_QUERY;
      }
      catch(e){
        $log.error('Cannot parse query URL');
        queryObject = BLANK_QUERY;
      }
      var temp = convertTreeArrays(queryObject);
      return temp;
    }

    //////////////////////////
    /// Internal functions ///
    //////////////////////////

    /**
     * Traverses the whole object tree and encodes slashes
     */
    function encodeSlashes(queryObject){
      var newQueryObject = {};
      _.forIn(queryObject, function(item, key){
        if(_.isArray(item) || _.isObject(item)){
          newQueryObject[key] = encodeSlashes(item);
        }
        else if(_.isString(item)){
          newQueryObject[key] = item.replace(/\//g,'%2F');
        }
        else{
          newQueryObject[key] = item;
        }
      });
      return newQueryObject;
    }

    /**
     * Checks if the `item` is a possible array.
     */
    function isArrayable(item){
      if(item instanceof Object && !(item instanceof String)){
        var stuff = _.keys(item);
        var stuffToCheck = _.chain(stuff).map(function(value){
          return _.parseInt(value);
        })
        .filter(function(value){
          return !_.isNaN(value);
        })
        .value();
        return stuff.length === stuffToCheck.length;
      }
      else{
        return false;
      }
    }

    /**
     * Converts an object to an array.
     */
    function objectToArray(item){
      var newArray = [];
      var newArrayLength = 0;
      _.forIn(item, function(item, key){
        newArrayLength++;
        newArray[key] = item;
      });
      newArray.length = newArrayLength;
      return newArray;
    }

    /**
     * Traverses the whole object tree, if there is a possible array converts
     * that to an array.
     * Checking if the object could be an array by checking all the keys are integers.
     * Rison specs are inadequate to decide, hence this piece of function
     */
    function convertTreeArrays(queryObject){
      var newQueryObject = {};

      var arrayer = function(item){
        if(isArrayable(item)){
          return objectToArray(item);
        }
        else{
          return item;
        }
      };

      _.forEach(queryObject, function(item, key){
        if(_.isObject(item)){
          newQueryObject[key] = arrayer(convertTreeArrays(item));
        }
        else{
          newQueryObject[key] = item;
        }
      });

      return newQueryObject;
    }
  }
})();
