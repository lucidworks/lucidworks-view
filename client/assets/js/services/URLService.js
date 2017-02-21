(function () {
  'use strict';

  angular
    .module('lucidworksView.services.url', ['rison'])
    .constant('BLANK_QUERY', blankQuery)
    .constant('QUERY_PARAM', 'query')
    .factory('URLService', URLService);

  var blankQuery = {
    q: '*',
    start: 0,
    wt: 'json'
  };

  function URLService(ConfigService, $log, $rison, $injector, $location,
    QUERY_PARAM) {
    'ngInject';
    return {
      setQueryToURLAndGo: setQueryToURLAndGo,
      convertQueryToStateObject: convertQueryToStateObject,
      getQueryFromUrl: getQueryFromUrl,

      /// deprecated
      setQuery:setQuery
    };

    //////////

    /**
     * setQuery
     * DEPRECATED in 1.4 use QueryService.setQuery() instead
     **/
    function setQuery(query) {
      $log.error('The function URLService.setQuery() was deprecated in Lucidworks View 1.4 use QueryService.setQuery() instead. Will be removed in version 1.5 release.');
      var QueryService = $injector.get('QueryService');
      QueryService.setQuery(query);
    }

    /**
     * Sets the URL bar
     * @param {object} queryObject The query object
     */
    function convertQueryToStateObject(queryObject) {
      var queryObjectToBeStringed = _.clone(queryObject,true);
      //Only need the slashes to get encoded, so that app state doesn't change
      queryObjectToBeStringed = encodeSlashes(queryObjectToBeStringed);
      var queryObjectString = $rison.stringify(queryObjectToBeStringed);
      var newStateObject = {};
      newStateObject[QUERY_PARAM] = queryObjectString;
      return newStateObject;
    }

    function setQueryToURLAndGo(queryObject) {
      var newStateObject = convertQueryToStateObject(queryObject);
      var $state = $injector.get('$state');
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
        queryObject = queryString ? $rison.parse(decodeURIComponent(queryString)):ConfigService.config.default_query;
      }
      catch(e){
        $log.error('Cannot parse query URL');
        queryObject = ConfigService.config.default_query;
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
