/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.utils.queryBuilder', [])
    .provider('QueryBuilder', QueryBuilder);

  function QueryBuilder() {
    'ngInject';
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
      keyValue: {
        'default': function(key, value){return keyValueString(key, value, '=');}
      },
      join: {
        'OR': function(str, values){return arrayJoinString(str, values, ' OR ');},
        'AND': function(str, values){return arrayJoinString(str, values, ' AND ');},
        'ampersand': function(str, values){return arrayJoinString(str, values, '&');},
        'default': function(str, values){return arrayJoinString(str, values, '');}
      },
      preEncodeWrapper: {},
      encode: {},
      wrapper: {
        'scope': function(data){return '('+data+')';},
        'default': function(data){return data;}
      }
    };

    this.$get = $get;
    this.registerTransformer = registerTransformer;
    this.arrayJoinString = arrayJoinString;
    this.keyValueString = keyValueString;
    this.escapeSpecialChars = escapeSpecialChars;
    this.encodeURIComponentPlus = encodeURIComponentPlus;

    function $get($log){
      'ngInject';//eslint-disable-line
      return {
        registerTransformer: registerTransformer,
        keyValueString: keyValueString,
        arrayJoinString: arrayJoinString,
        objectToURLString: objectToURLString,
        escapeSpecialChars:escapeSpecialChars,
        encodeURIComponentPlus: encodeURIComponentPlus
      };

      /**
       * Turns an Object into a URL String
       * @param {object} obj The query object to turn into a string
       * @return {string}
       */
      function objectToURLString(obj){
        return _.reduce(obj, reducer, '');

        function reducer(str, value, key) {
          var parameters;
          var ret;
          // get important values;
          var keyValue = QueryDataTransformers.keyValue.hasOwnProperty(key) ? QueryDataTransformers.keyValue[key] : QueryDataTransformers.keyValue.default;
          var join = QueryDataTransformers.join.hasOwnProperty(key) ? QueryDataTransformers.join[key] : QueryDataTransformers.join.default;
          var encode = QueryDataTransformers.encode.hasOwnProperty(key) ? QueryDataTransformers.encode[key] : false;
          var preEncodeWrapper = QueryDataTransformers.preEncodeWrapper.hasOwnProperty(key) ? QueryDataTransformers.preEncodeWrapper[key] : false;
          var wrapper = QueryDataTransformers.wrapper.hasOwnProperty(key) ? QueryDataTransformers.wrapper[key] : false;

          var wrappedValue = value;

          // If this is an array join all the properties.
          if(angular.isArray(value)){
            parameters = arrayReducer(key, value, keyValue, join, preEncodeWrapper, encode, wrapper, 0);
          } else {
            if(preEncodeWrapper){
              wrappedValue = preEncodeWrapper(wrappedValue);
            }
            if(encode){
              wrappedValue = encode(wrappedValue);
            }
            // If this field has a wrapper, apply it here.
            if (wrapper){
              wrappedValue = wrapper(wrappedValue);
            }
            // create a key value pair from the remaining.
            parameters = keyValue(key, wrappedValue);
          }

          // This is the first level and should use ampersand by default.
          if(str !== ''){
            ret = QueryDataTransformers.join.ampersand(str, parameters);
          } else {
            ret = join(str, parameters);
          }
          $log.debug(ret);
          return ret;
        }
      }

      function arrayReducer(key, values, keyValue, join, preEncodeWrapper, encode, wrapper, level){
        return _.reduce(values, arrayReducerFunc, '');
        function arrayReducerFunc(str, value){
          var newVal = value;
          if(angular.isObject(value)){
            newVal = parseKeyValueStore(value, level+1);
          }
          if(preEncodeWrapper){
            newVal = preEncodeWrapper(newVal);
          }
          if(encode){
            newVal = encode(newVal);
          }
          // If this field has a wrapper, apply it here.
          if (wrapper){
            newVal = wrapper(newVal);
          }
          if(str.length > 0){
            var joiner = (level > 0) ? join : QueryDataTransformers.join.ampersand;
            str = joiner(str, keyValue(key, newVal));
          } else {
            str = QueryDataTransformers.join.default(str, keyValue(key, newVal));
          }
          return str;
        }
      }
      function parseKeyValueStore(obj, level){
        var keyValue =  QueryDataTransformers.keyValue.default;
        var join = QueryDataTransformers.join.default;
        var encode = false;
        var wrapper = false;
        var preEncodeWrapper = false;
        if(obj.hasOwnProperty('transformer')){
          keyValue = QueryDataTransformers.keyValue.hasOwnProperty(obj.transformer) ? QueryDataTransformers.keyValue[obj.transformer] : QueryDataTransformers.keyValue.default;
          join = QueryDataTransformers.join.hasOwnProperty(obj.transformer) ? QueryDataTransformers.join[obj.transformer] : QueryDataTransformers.join.default;
          encode = QueryDataTransformers.encode.hasOwnProperty(obj.transformer) ? QueryDataTransformers.encode[obj.transformer] : false;
          preEncodeWrapper = QueryDataTransformers.preEncodeWrapper.hasOwnProperty(obj.transformer) ? QueryDataTransformers.preEncodeWrapper[obj.transformer] : false;
          wrapper = QueryDataTransformers.wrapper.hasOwnProperty(obj.transformer) ? QueryDataTransformers.wrapper[obj.transformer] : false;
        }
        return arrayReducer(obj.key, obj.values, keyValue, join, preEncodeWrapper, encode, wrapper, level);
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

    /**
    * Escape special characters that are part of the query syntax of Lucene
    *
    * @param {String} s The string to escape
    *
    * @return {String}
    */
    function escapeSpecialChars(s){
      return s.replace(/([\+\-!\(\)\{\}\[\]\^"~\*\?:\\])/g, function(match) {
        return '\\' + match;
      })
      .replace(/&&/g, '\\&\\&')
      .replace(/\|\|/g, '\\|\\|');
    }

    /**
     * Encodes a URI using plus instead of %20.
     * @param  {string} str The string to URL component to encode
     * @return {string}     The encoded string.
     */
    function encodeURIComponentPlus(str){
      return encodeURIComponent(str).replace(/%20/g, '+');
    }


  }
})();
