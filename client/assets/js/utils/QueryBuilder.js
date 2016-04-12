(function() {
  'use strict';

  angular
    .module('lucidworksView.utils.queryBuilder', [])
    .provider('QueryBuilder', QueryBuilder);

  function QueryBuilder() {
    'ngInject';
    /** @type object QueryTransformer defaults */
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

    function $get(){
      'ngInject';//eslint-disable-line
      return {
        registerTransformer: registerTransformer,
        keyValueString: keyValueString,
        arrayJoinString: arrayJoinString,
        objectToURLString: objectToURLString,
        escapeSpecialChars: escapeSpecialChars,
        encodeURIComponentPlus: encodeURIComponentPlus
      };
    }

    /**
     * Turns an Object into a URL String
     * @param {object} obj The query object to turn into a string
     *
     * @return {string}    The query string.
     * @public
     */
    function objectToURLString(obj){
      // Reduce then replace any hashes with the URI compatible equivelent so
      // we don't clobber the rest of the query.
      return _.reduce(obj, outerReducer, '').replace(/\#/g, '%23');
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
     * @public
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
    * @public
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
     *
     * @param  {string} str The string to URL component to encode
     *
     * @return {string}     The encoded string.
     * @public
     */
    function encodeURIComponentPlus(str){
      return encodeURIComponent(str).replace(/%20/g, '+');
    }

    /**
     * A helper function to consitantly concatanate a key, value, and join.
     *
     * @param  {String} key   Key to concatanate
     * @param  {String} value Value to concatanate
     * @param  {String} join  string to join the key and the value (ex. =).
     *
     * @return {String}       The joined string.
     * @public
     */
    function keyValueString(key, value, join) {
      return key + join + value;
    }

    /**
     * Concatanates an array of strings to a string using joins.
     * @param  {string} str  The initial string to start with.
     * @param  {Array}  arr  The array to concatenate with joins
     * @param  {string} join The string to join the array and strings together
     * @return {string}      The concatenated string.
     * @public
     */
    function arrayJoinString(str, arr, join) {
      if(angular.isString(arr)){
        return str + join + arr;
      }
      return _.reduce(arr, arrayJoinStringReducer, str);
      function arrayJoinStringReducer(str, value){
        return str + ((str!=='')?join:'') + value;
      }
    }

    //////////////////////////
    /// Internal functions ///
    //////////////////////////

    /**
     * Simple reducer only handles top level url concatenation.
     * @param  {String} str   String with which to concatenate onto.
     * @param  {array|String} value The value of this object property
     * @param  {String} key   key of the property.
     * @return {String}       A concatenated query string.
     */
    function outerReducer(str, value, key) {
      var parameters;
      var ret;
      // get transformer functions;
      var keyValue = getTransformerFn('keyValue', key, QueryDataTransformers.keyValue.default);
      var preEncodeWrapper = getTransformerFn('preEncodeWrapper', key, false);
      var encode = getTransformerFn('encode', key, false);
      var wrapper = getTransformerFn('wrapper', key, false);
      var join = getTransformerFn('join', key, QueryDataTransformers.join.default);

      var wrappedValue = value;

      // If this is an array join all the properties.
      if(angular.isArray(value)){
        parameters = arrayReducer(key, value, keyValue, preEncodeWrapper, encode, wrapper, join, 0);
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
      return ret;
    }

    /**
     * Reduces an array into a string.
     * @param  {string}         key              key in a key value pair.
     * @param  {array}          values           An array of values.
     * @param  {Function}       keyValue         The key value function for this
     *                                           array.
     * @param  {Function|false} preEncodeWrapper The preEncodeWrapper function for
     *                                           this array.
     * @param  {Function|false} encode           The encode function for this
     *                                           array.
     * @param  {Function|false} wrapper          The wrapper function for this
     *                                           array.
     * @param  {Function}       join             The join function for this array.
     * @param  {integer}        level            The level of recurion in the
     *                                           tree.
     * @return {string}                  A reduced string from the array.
     */
    function arrayReducer(key, values, keyValue, preEncodeWrapper, encode, wrapper, join, level){
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

    /**
     * Given an object parses the keys and values and reduces the values into a string.
     * @param  {object} obj   The object to parse.
     * @param  {integer} level How far are we into the tree.
     * @return {string}       The reduced string.
     */
    function parseKeyValueStore(obj, level){
      var transformer = obj.hasOwnProperty('transformer') ? obj.transformer : '_use_default_';

      var keyValue = getTransformerFn('keyValue', transformer, QueryDataTransformers.keyValue.default);
      var preEncodeWrapper = getTransformerFn('preEncodeWrapper', transformer, false);
      var encode = getTransformerFn('encode', transformer, false);
      var wrapper = getTransformerFn('wrapper', transformer, false);
      var join = getTransformerFn('join', transformer, QueryDataTransformers.join.default);
      return arrayReducer(obj.key, obj.values, keyValue, preEncodeWrapper, encode, wrapper, join, level);
    }

    /**
     * Simple function to determine which transformer to return.
     * @param  {string} type                       The type of transformer.
     * @param  {string} key                        The key of the transformer.
     * @param  {function|false} defaultTransformer The default transformer function
     * @return {function}                          The transformer function.
     */
    function getTransformerFn(type, key, defaultTransformer){
      return QueryDataTransformers[type].hasOwnProperty(key) ? QueryDataTransformers[type][key] : defaultTransformer;
    }

  }
})();
