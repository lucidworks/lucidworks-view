/*global _*/
(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetField', [
      'fusionSeedApp.services.config',
      'foundation.core',
      'fusionSeedApp.utils.queryBuilder'
    ])
    .config(Config)
    .directive('facetField', facetField);

  function Config(QueryBuilderProvider){
    'ngInject';
    // Register a transformer because facet fields can have funky URL syntax.
    QueryBuilderProvider.registerTransformer('keyValue', 'fq:field', fqFieldkeyValueTransformer);
    QueryBuilderProvider.registerTransformer('encode', 'fq:field', fqFieldEncode);
    QueryBuilderProvider.registerTransformer('preEncodeWrapper', 'fq:field', fqFieldPreEncodeWrapper);
    QueryBuilderProvider.registerTransformer('wrapper', 'fq:field', fqFieldWrapper);

    // QueryBuilderProvider.registerTransformer('join', 'localParens', localParenJoinTransformer);
    // QueryBuilderProvider.registerTransformer('wrapper', 'localParens', localParenWrapperTransformer);

    /**
     * Transformers.
     *
     * These will transform the output of the query, when the query is created.
     */

    function fqFieldkeyValueTransformer(key, value) {
      return QueryBuilderProvider.keyValueString(key, value, ':');
    }

    function fqFieldEncode(data){
      return encodeURIComponent(data);
    }

    function fqFieldPreEncodeWrapper(data){
      return '"'+data+'"';
    }

    function fqFieldWrapper(data){
      return '('+data+')';
    }

    // function localParenJoinTransformer(str, values) {
    //   return QueryBuilderProvider.arrayJoinString(str, values, ' ');
    // }
    //
    // function localParenWrapperTransformer(data) {
    //   return '{!' + data + '}';
    // }
  }

  function facetField() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/facetField/facetField.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        facetName: '@facetName',
        facetLabel: '@facetLabel',
        facetAutoOpen: '@facetAutoOpen'
      }
    };

  }

  function Controller(ConfigService, QueryDataService, Orwell, FoundationApi) {
    'ngInject';
    var vm = this;
    vm.facetCounts = [];
    vm.toggleFacet = toggleFacet;
    var resultsObservable = Orwell.getObservable('queryResults');

    activate();

    //////////////

    function activate() {

      // Add observer to update data when we get results back.
      resultsObservable.addObserver(function (data) {
        // Exit early if there are no facets in the response.
        if (!data.hasOwnProperty('facet_counts')) return;

        // Determine if facet exists.
        var facetFields = data.facet_counts.facet_fields;
        if (facetFields.hasOwnProperty(vm.facetName)) {
          // Transform an array of values in format [‘aaaa’, 1234,’bbbb’,2345] into an array of objects.
          vm.facetCounts = arrayToObjectArray(facetFields[vm.facetName]);
        }

        // Set inital active state
        var active = true;
        // If we have autoOpen set active to this state.
        if (angular.isDefined(vm.facetAutoOpen) && vm.facetAutoOpen === 'false') {
          active = false;
        }
        vm.active = active;
      });
    }

    /**
     * Turn a flat array into an object array.
     *
     * Transforms an array of values in format ['aaaa', 1234,'bbbb',2345] into
     * an array of objects.
     * [{title:'aaaa', amount:1234, hash: zf-hs-njkfhdsle},
     *  {title:'bbbb', amount:2345, hash: zf-hs-jkewrkljn}]
     *
     * @param  {array} arr The array to transform
     * @return {array}     An array of objects
     */
    function arrayToObjectArray(arr) {
      return _.transform(arr, function (result, value, index) {
        if (index % 2 === 1) {
          result[result.length - 1] = {
            title: result[result.length - 1],
            amount: value,
            hash: FoundationApi.generateUuid()
          };
        } else {
          result.push(value);
        }
      });
    }

    function toggleFacet() {
      // set facet=true in query if any facet component
      // set facet.field
      // remember to url encode
    }
  }

})();
