/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.utils.dataTransform', [])
    .provider('DataTransformHelper', DataTransformHelper);

  function DataTransformHelper() {
    var keyValueString = function keyValueString(key, value, join) {
      return key + join + value;
    };

    var arrayJoinString = function arrayJoinString(str, arr, join) {
      if(angular.isString(arr)){
        return str + join + arr;
      }
      return _.reduce(arr, arrayJoinStringReducer, str);
      function arrayJoinStringReducer(str, value){
        return str + ((str!=='')?join:'') + value;
      }
    };

    var QueryDataTransformers = {
      paramMutator: {},
      encode: {},
      keyValue: {
        'default': function(key, value){return keyValueString(key, value, '=');}
      },
      join: {
        'OR': function(str, values){return arrayJoinString(str, values, ' OR ');},
        'AND': function(str, values){return arrayJoinString(str, values, ' AND ');},
        'ampersand': function(str, values){return arrayJoinString(str, values, '&');},
        'default': function(str, values){return arrayJoinString(str, values, '');}
      },
      wrapper: {
        'scope': function(data){return '('+data+')';},
        'default': function(data){return data;}
      }
    };

    this.$get = ['$log', $get];
    this.registerTransformer = registerTransformer;

    function $get($log){
      return {
        registerTransformer: registerTransformer,
        keyValueString: keyValueString,
        arrayJoinString: arrayJoinString,
        objectToURLString: objectToURLString
      };

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
          var encode = QueryDataTransformers.encode.hasOwnProperty(key) ? QueryDataTransformers.encode[key] : false;
          var paramMutator = QueryDataTransformers.paramMutator.hasOwnProperty(key) ? QueryDataTransformers.paramMutator[key] : false;
          var wrapper = QueryDataTransformers.wrapper.hasOwnProperty(key) ? QueryDataTransformers.wrapper[key] : false;

          var thisKey = key;
          if(paramMutator){
            thisKey = paramMutator(key);
          }

          // If this is an object apply special transformers if appropriate.
          if (angular.isObject(value)) {
            if (keyValue || join) {
              parameters = objectToURLString(value.values, 1);

              if(keyValue){
                parameters = keyValue(thisKey, parameters);
              }
              if(join){
                parameters = join(str, parameters);
              }
            } else {
              parameters = objectToURLString(value, 1);
            }
          }
          // If this is an array join all the properties.
          if(angular.isArray(value)){
            _.forEach(value, function(arrValue){
              if(angular.isObject(arrValue)){
                parameters = objectToURLString(arrValue, 1);
              }
              if(join){
                parameters = join(str, arrValue);
              } else {
                parameters = QueryDataTransformers.join.default(value);
              }
            });
          }
          var wrappedValue = value;
          if(encode){
            wrappedValue = encode(value);
          }
          // If this field has a wrapper, apply it here.
          if (wrapper){
            wrappedValue = wrapper(wrappedValue);
          }

          // create a key value pair from the remaining.
          if(keyValue){
            parameters = keyValue(thisKey, wrappedValue);
          } else {
            parameters = QueryDataTransformers.keyValue.default(thisKey, wrappedValue);
          }

          // This is the first level and should use ampersand by default.
          if((angular.isUndefined(level) || level === false) && str !== ''){
            ret = QueryDataTransformers.join.ampersand(str, parameters);
          } else if(join) {
            ret = join(str, parameters);
          } else {
            ret = QueryDataTransformers.join.default(str, parameters);
          }
          $log.debug(ret);
          return ret;
        }
      }
    }

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
      QueryDataTransformers[type][key] = cb;
    }


  }
})();
