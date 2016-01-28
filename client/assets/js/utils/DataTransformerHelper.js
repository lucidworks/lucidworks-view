/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.utils.dataTransformer', [])
    .factory('DataTransformerHelper', DataTransformerHelper);

  DataTransformerHelper.$inject = [];

  /* @ngInject */
  function DataTransformerHelper() {
    var QueryDataTransformers = {};
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
     * @param  {string}   key  The key of the transformer
     *                         EX: 'fq:field'
     * @param  {Function} cb   The callback function.
     */
    function registerTransformer(key, cb){
      QueryDataTransformers[name] = cb;
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
    function objectToURLString(obj){
      return _.reduce(obj, function(str, value, key) {
        var parameter;
        if (QueryDataTransformers.hasOwnProperty(key)) {
          var data = transformData(key, value);
          key = data.key;
          value = data.value;
        }
        if (angular.isObject(value)) {
          parameter = objectToStringOfSameKey(value);
        } else {
          parameter = '' + key + '=' + value;
        }
        return str + ((str!=='')?'&':'') + parameter;
      },'');
    }

    /**
     * change an array/object into a string of the same key.
     * @param  {array|object} obj The array to change to a query string.
     * @param  {string}       key The key of the object/array
     * @return {string}           The string of key value pairs
     */
    function objectToStringOfSameKey(obj, key) {
      var str = '';
      _.forEach(obj, function(value){
        str += ((str!=='')?'&':'') + key + '=' + value;
      });
      return str;
    }

    /**
     * Turn an object of key value pairs into local parens format.
     * @param  {object} keyValuePairs The object of key value pairs
     * @return {string}               String in the format of localParens.
     */
    function objectToLocalParens(keyValuePairs){
      var str = '';
      _.foreach(keyValuePairs, function(value, key){
        str += ((str!=='')?' ':'') +key+'='+value;
      });
      return '{!'+str+'}';
    }
  }
})();
