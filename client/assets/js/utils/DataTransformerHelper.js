/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.utils.dataTransform', [])
    .factory('DataTransformHelper', DataTransformHelper);

  DataTransformHelper.$inject = ['$log'];

  function DataTransformHelper($log) {
    var keyValueString = function keyValueString(key, value, join) {
      return key + join + value;
    };

    var arrayJoinString = function arrayJoinString(arr, join) {
      if(angular.isString(arr)){
        return join + arr;
      }
      return _.reduce(arr, arrayJoinStringReducer, '');
      function arrayJoinStringReducer(str, value){
        return str + ((str!=='')?join:'') + value;
      }
    };

    var QueryDataTransformers = {
      keyValue: {
        'default': function(key, value){return keyValueString(key, value, '=');}
      },
      join: {
        'OR': function(values){return arrayJoinString(values, ' OR ');},
        'AND': function(values){return arrayJoinString(values, ' AND ');},
        'ampersand': function(values){return arrayJoinString(values, '&');},
        'default': function(values){return arrayJoinString(values, '');}
      },
      wrapper: {
        'scope': function(data){return '('+data+')';},
        'default': function(data){return data;}
      }
    };
    return {
      registerTransformer: registerTransformer,
      objectToURLString: objectToURLString
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
          if (keyValue || join) {
            parameters = objectToURLString(value.values, 1);
            if(keyValue){
              parameters = keyValue(key, parameters);
            }
            if(join){
              parameters = join(parameters);
            }
          } else {
            parameters = objectToURLString(value, 1);
          }
        }
        // If this is an array join all the properties.
        if(angular.isArray(value)){
          if(join){
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
        if (wrapper){
          parameters = wrapper(parameters);
        }

        // This is the first level and should use ampersand by default.
        if((angular.isUndefined(level) || level === false) && str != ''){
          ret = arrayJoinString(parameters, '&');
        } else if(QueryDataTransformers.join.hasOwnProperty(key)) {
          ret = QueryDataTransformers.join[key](parameters);
        } else {
          ret = arrayJoinString(parameters, '');
        }
        $log.debug(ret);
        return ret;
      }
    }

  }
})();
