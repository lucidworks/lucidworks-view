/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetField')
    .directive('facetField', facetField);

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

  function Controller(ConfigService, QueryService, QueryDataService, Orwell, FoundationApi, $log) {
    'ngInject';
    var vm = this;
    vm.facetCounts = [];
    vm.toggleFacet = toggleFacet;
    var resultsObservable = Orwell.getObservable('queryResults');

    activate();

    //////////////

    /**
     * Activate the controller.
     */
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
            hash: FoundationApi.generateUuid(),
            active: isFacetActive(vm.facetName, value)
          };
        } else {
          result.push(value);
        }
      });
    }

    function toggleFacet(facet) {
      var key = vm.facetName;
      var query = QueryService.getQueryObject();

      // CASE: fq exists.
      if(!query.hasOwnProperty('fq')){
        query = addQueryFacet(query, key, facet.title);
      } else {
        // Remove the key object from the query.
        // We will re-add later if we need to.
        var keyObj = _.remove(query.fq, {key: key, transformer:'fq:field'});

        // CASE: facet key exists in query.
        if(angular.isDefined(keyObj)) {
          var removed = _.remove(keyObj.values, facet.title);
          // CASE: value didn't previously exist add to values.
          if(_.isEmpty(removed)){
            keyObj.values.push(facet.title);
          }
          // attach keyobject back to query if there are still values.
          if(keyObj.values.length > 0){
            query.fq.push(keyObj);
          }
          // Delete 'fq' if it is now empty.
          if(query.fq.length < 0){
            delete query.fq;
          }
        } else { // CASE: Facet key doesnt exist ADD key AND VALUE.
          query = addQueryFacet(query, key, facet.title);
          facet.active = true;
        }

      }
      // Set the query and trigger the refresh.
      QueryService.setQuery(query);
    }

    function isFacetActive(key, value){
      var query = QueryService.getQueryObject();
      if(!query.hasOwnProperty('fq')){
        return false;
      }
      var keyObj = _.find(query.fq, {key: key, transformer: 'fq:field'});
      if(_.isEmpty(keyObj)){
        return false;
      }
      if(_.isEmpty(_.find(keyObj.values, value))){
        return false;
      }
      return true;
    }

    function addQueryFacet(query, key, title){
      if(!query.hasOwnProperty('fq')){
        query.fq = [];
      }
      var keyObj = {
        key: key,
        values: [title],
        transformer: 'fq:field'
      };
      return query.fq.push(keyObj);
    }

  }
})();
