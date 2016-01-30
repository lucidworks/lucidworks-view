/*global _*/
(function() {
 'use strict';

  angular
    .module('fusionSeedApp.utils.dataTransform', [])
    .factory('DataTransformHelper', DataTransformHelper);

  DataTransformHelper.$inject = [];

  /* @ngInject */
  function DataTransformHelper() {
    var QueryDataTransformers = {
      keyValue: {
        'default': function(key, value){return keyValueString(key, value, '=');}
      },
      join: {
        'OR': function(values){return arrayJoinString(values, ' OR ');},
        'AND': function(values){return arrayJoinString(values, ' AND ');},
        'default': function(values){return arrayJoinString(values, '&');}
      },
      wrapper: {
        'scope': function(data){return '('+data+')';},
        'default': function(data){return data;}
      }
    };
    return {
      registerTransformer: registerTransformer,
      objectToURLString: objectToURLString,
      objectToStringOfSameKey: objectToStringOfSameKey,
      objectToLocalParens: objectToLocalParens
    };

    /**
     * Register a Query Data Transformer.
     *
     * Will allow you to transform a key and/or value in the query Observable
     * into the proper format when performing a search query.
     *
     * It operates on either the string level or inside an object.
     *
     * The callback function passes in an object with properties:
     * - key The key
     * - value The value
     *
     * The callback function must also return an object with the properties key and
     * value.
     *
     * @param  {string}   type The type of transformer
     *
     * @param  {string}   key  The key of the transformer
     *                         EX: 'fq:field'
     * @param  {Function} cb   The callback function.
     */
     function registerTransformer(type, key, cb){
      QueryDataTransformers[type][name] = cb;
    }

    /**
     * Transforms data if a Data Transformer exists.
     * @param  {string} key   The key for the transformation
     * @param  {*}      value The value to transform
     * @return {object}       An object containing key and value.
     */
    function transformData(key, value){
      if (QueryDataTransformers.hasOwnProperty(key)) {
        return QueryDataTransformers[key]({key: key, value: value});
      }
      return {
        key: key,
        value: value
      };
    }

    /**
     * Turns an Object into a URL String
     * @param {object} obj The query object to turn into a string
     * @return {string}
     */
    function objectToURLString(obj, level){
      return _.reduce(obj, reducer, '');

      function reducer(str, value, key) {
        var parameters;
        var ret;
        // get important values;
        var keyValue = QueryDataTransformers.keyValue.hasOwnProperty(key) ? QueryDataTransformers.keyValue[key] : false;
        var join = QueryDataTransformers.join.hasOwnProperty(key) ? QueryDataTransformers.join[key] : false;
        var wrapper = QueryDataTransformers.wrapper.hasOwnProperty(key) ? QueryDataTransformers.wrapper[key] : false;

        // If this is an object apply special transformers if appropriate.
        if (angular.isObject(value)) {
          if (!!keyValue || !!join){
            parameters = objectToURLString(value.values, 1);
            if(!!keyValue){
              parameters = keyValue(key, parameters);
            }
            if(!!join){
              parameters = join(parameters);
            }
          } else {
          parameters = objectToURLString(value, 1);
        }
        // If this is an array join all the properties.
        if(angular.isArray(value)){
          if(!!join){
            parameters = join(value);
          } else {
            parameters = QueryDataTransformers.join.default(value);
          }
        }

        // create a key value pair from the remaining.
        if(QueryDataTransformers.keyValue.hasOwnProperty(key)){
          QueryDataTransformers.keyValue[key](value);
        } else {
          parameters = QueryDataTransformers.keyValue.default(key, value);
        }
        // If this field has a wrapper, apply it here.
        if (!!wrapper){
          parameters = wrapper(parameters);
        }

        // This is the first level and should use ampersand by default.
        if(angular.isUndefined(level)|| level === false){
          ret = arrayJoinString(parameters, '&');
        } else if(QueryDataTransformers.join.hasOwnProperty(key)) {
          ret = QueryDataTransformers.join[key](parameters);
        } else {
          ret = arrayJoinString(parameters, '');
        }
        //QueryDataTransformers.process.hasOwnProperty(key)
        // if (QueryDataTransformers.hasOwnProperty(key)) {
        //   var data = transformData(key, value);
        //   key = data.key;
        //   value = data.value;
        // }
        // if (angular.isObject(value)) {
        //   parameter = objectToStringOfSameKey(value);
        // } else {
        // parameter = '' + key + '=' + value;
        // }
        return ret;
      }
    }

    function arrayJoinString(arr, join){
      return _.reduce(arr, arrayJoinStringReducer, '');
      function arrayJoinStringReducer(str, value, key){
        return str + ((str!=='')?join:'') + value;
      }
    }

    function keyValueString(key, value, join){
      return key + join + value;
    }

    // /**
    //  * change an array/object into a string of the same key.
    //  * @param  {array|object} obj The array to change to a query string.
    //  * @param  {string}       key The key of the object/array
    //  * @return {string}           The string of key value pairs
    //  */
    // function objectToStringOfSameKey(obj, key) {
    //   var str = '';
    //   _.forEach(obj, function(value){
    //     str += ((str!=='')?'&':'') + key + '=' + value;
    //   });
    //   return str;
    // }
    //
    // /**
    //  * Turn an object of key value pairs into local parens format.
    //  * @param  {object} keyValuePairs The object of key value pairs
    //  * @return {string}               String in the format of localParens.
    //  */
    // function objectToLocalParens(keyValuePairs){
    //   var str = '';
    //   _.foreach(keyValuePairs, function(value, key){
    //     str += ((str!=='')?' ':'') +key+'='+value;
    //   });
    //   return '{!'+str+'}';
    // }
  }
})();
