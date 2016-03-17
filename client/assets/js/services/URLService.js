(function () {
  'use strict';

  angular
    .module('fusionSeedApp.services.url', ['rison'])
    .constant('BLANK_QUERY', blankQuery)
    .constant('QUERY_PARAM', 'query')
    .factory('URLService', URLService);

  var blankQuery = {
    q: '*:*',
    start: 0
  };

  /**
   * Service to provide URL-bar get and set functionalities
   */
  function URLService($log, $rison, $state, $location, QueryService, BLANK_QUERY,
    QUERY_PARAM) {
    'ngInject';
    return {
      setQuery: setQuery,
      getQueryFromUrl: getQueryFromUrl
    };

    //////////

    /**
     * [setQuery Sets the query object that will be updated
     * on the URL bar and get passed
     * on to QueryService
     * for a search]
     * @param {} queryObject
     * [Query object that is to be
     * stored in the URL and queried with]
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
     * [getQueryFromUrl gets app state query object from the URL bar]
     *
     * @return {} [Query object that can be used in QueryService.setQuery()]
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
     * [encodeSlashes HTTP encodes slashes in an object values
     * This is to ensure that state doesn't change when URL changes]
     *
     * @param  {Object} queryObject [The object to scan and encode the slashes]
     * @return {Object} [An object with all the slashes encoded]
     */
    function encodeSlashes(queryObject){
      var newQueryObject = {};
      _.forIn(queryObject, function(item, key){
        // CASE: In case `item` is an iterable, iterate over them
        if(_.isArray(item) || _.isObject(item)){
          newQueryObject[key] = encodeSlashes(item);
        }
        // CASE: In case `item` is a string, just URL encode the slashes
        else if(_.isString(item)){
          newQueryObject[key] = item.replace(/\//g,'%2F');
        }
        // CASE: Leave the `item` as it
        else{
          newQueryObject[key] = item;
        }
      });
      return newQueryObject;
    }

    /**
     * [isArrayable Checks if `item` could be an array]
     * @param  {Object|String}  item [The Object to check for array-fiability]
     * @return {Boolean}  [If `item` could be an array]
     */
    function isArrayable(item){
      // In case of Rison objects and the scope of this function's functionality
      // `item` can be a plain JS object or a `String` instance.
      //
      // Checking if the object could be an array by checking all the keys are integers.
      // Rison specs are inadequate to decide, hence this piece of function
      if(item instanceof Object && !(item instanceof String)){
        var stuff = _.keys(item);
        var stuffToCheck = _.chain(stuff).map(function(value){
          // Maps to all the integer values for the keys
          return _.parseInt(value);
        })
        .filter(function(value){
          // Remove all the NaN
          return !_.isNaN(value);
        })
        .value();
        // Checks if the number of original keys matches the number of integer keys
        return stuff.length === stuffToCheck.length;
      }
      else{
        return false;
      }
    }

    /**
     * [objectToArray Converts `item` to ar array]
     *
     * @param  {} item [The Object to convert]
     * @return {[Array]} [The Array that came out of Object]
     */
    function objectToArray(item){
      var newArray = [];
      var newArrayLength = 0;
      // This way we can ensure the integer index values are properly mapped to Array indices.
      _.forIn(item, function(item, key){
        newArrayLength++;
        newArray[key] = item;
      });
      newArray.length = newArrayLength;
      return newArray;
    }

    /**
     * [convertTreeArrays Traverses the whole object tree recursively, if there is a possible array converts
     * that to an array.]
     *
     * @param  {Object} queryObject [The object to traverse, and convert arrayable
     * objects to arrays]
     * @return {Object}             [Object with all the possible arrays converted to arrays]
     */
    function convertTreeArrays(queryObject){
      var newQueryObject = {};

      // If `item` can be converted to an array properly, do that.
      var arrayer = function(item){
        if(isArrayable(item)){
          return objectToArray(item);
        }
        else{
          return item;
        }
      };

      _.forEach(queryObject, function(item, key){
        // CASE: If `item` is an object, iterate over it
        // recursively while converting it to array if possible
        if(_.isObject(item)){
          newQueryObject[key] = arrayer(convertTreeArrays(item));
        }
        // CASE: Leave `item` as it, to hald recursion on leaf nodes of the object tree
        else{
          newQueryObject[key] = item;
        }
      });

      return newQueryObject;
    }
  }
})();
