(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetRange')
    .directive('facetRange', facetRange);

  function facetRange() {
    'ngInject';
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/facetRange/facetRange.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        formattingHandler: '=',
        facetName: '@',
        facetLabel: '@',
        facetAutoOpen: '@'
      }
    };
  }

  function Controller(ConfigService, QueryService, QueryDataService, Orwell, FoundationApi, URLService, $log, $filter) {
    'ngInject';
    var vm = this;
    vm.facetCounts = [];
    vm.toggleFacet = toggleFacet;
    vm.toggleMore = toggleMore;
    vm.getLimitAmount = getLimitAmount;
    vm.more = false;
    vm.clearAppliedFilters = clearAppliedFilters;
    var resultsObservable = Orwell.getObservable('queryResults');
    vm.facetCounts = [];

    activate();
    //////////////

    /**
     * Activate the controller.
     */
    function activate() {
      // Add observer to update data when we get results back.
      resultsObservable.addObserver(parseFacets);
      // initialize the facets.
      // parseRangeFacets(resultsObservable.getContent());
      parseFacets(resultsObservable.getContent());

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
          var titleVal;
          if (vm.formattingHandler){
            titleVal = vm.formattingHandler(result[result.length - 1]);
          } else {
            titleVal = result[result.length - 1];
          }
          result[result.length - 1] = {
            title: titleVal,
            amount: value,
            amountFormatted: $filter('humanizeNumberFormat')(value, 0),
            hash: FoundationApi.generateUuid(),
            active: isFacetActive(vm.facetName, result[result.length - 1])
          };
        } else {
          result.push(value);
        }
      });
    }

    /**
     * [transformObjectArray Adds start,end to array items according to the facet data]
     * @param  {Array} arr            [array of facet objects]
     * @param  {Object} rangeFacetData [rangeFacetData]
     * @return {Array}                [array of facet objects]
     */
    function transformObjectArray(arr, rangeFacetData){
      var end;
      if (vm.formattingHandler){
        end = vm.formattingHandler(rangeFacetData.end);
      } else {
        end = rangeFacetData.end
      }
      return _.map(arr, function(item, index){
        // TODO: Detect more data types and do proper display of the buckets
        var startOfRange = item.title;
        var endOfRange = (index + 1 >= arr.length)?end:arr[index + 1].title;
        return _.assign(item, {start: startOfRange, end: endOfRange});
      });
    }

    /**
     * [parseFacets Parse facets and get stuff going in the scope]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function parseFacets(data){
      if(!_.has(data.facet_counts, 'facet_ranges.' + vm.facetName)){
        return;
      }
      else {
        var rangeFacet = data.facet_counts.facet_ranges[vm.facetName];
        var rangeFacetsObjects = arrayToObjectArray(rangeFacet.counts);
        vm.facetCounts = transformObjectArray(rangeFacetsObjects, rangeFacet);
        setActiveState();
      }
    }

    /**
     * Toggles a facet on or off depending on it's current state.
     * @param  {object} facet The facet object
     */
    function toggleFacet(facet) {
      var key = vm.facetName;
      var query = QueryService.getQueryObject();
      // CASE: fq exists.
      if (!query.hasOwnProperty('fq')) {
        query = addRangeFacet(query, key, facet.start, facet.end);
      } else {
        // Remove the key object from the query.
        // We will re-add later if we need to.
        var keyArr = _.remove(query.fq, {key: key, transformer: 'fq:range', values: getQueryObjectValues(facet.start, facet.end)});

        // CASE: facet key exists in query.
        if (keyArr.length > 0) {
          var keyObj = keyArr[0];
          var removed = _.remove(keyObj.values, function (value) {
            return doesValueMatch(value, facet.start);
          });
          // CASE: value didn't previously exist add to values.
          if (removed.length === 0) {
            query.fq.push(getRangeFacetObject(key, facet.start, facet.end));
          }
          // CASE: there are still values in facet attach keyobject back to query.
          if (keyObj.values.length > 0) {
            query.fq.push(keyObj);
          }
          // Delete 'fq' if it is now empty.
          if (query.fq.length === 0) {
            delete query.fq;
          }
        } else { // CASE: Facet key doesnt exist ADD key AND VALUE.
          query = addRangeFacet(query, key, facet.start, facet.end);
        }

      }
      // Set the query and trigger the refresh.
      updateFacetQuery(query);
    }

    /**
     * Sets the facet query and sets start row to beginning.
     * @param  {object} query The query object.
     */
    function updateFacetQuery(query) {
      query.start = 0;
      URLService.setQuery(query);
    }

    /**
     * Adds range facet object to the `query` object passed as arg
     */
    function addRangeFacet(query, key, start, end) {
      if (!query.hasOwnProperty('fq')) {
        query.fq = [];
      }
      var keyObj = getRangeFacetObject(key, start, end);
      query.fq.push(keyObj);
      return query;
    }

    /**
     * Determine if a facet is currently active.
     * @param  {string}  key   The key for the facet
     * @param  {object}  value the facet
     * @return {Boolean}       [description]
     */
    function isFacetActive(key, value) {
      var query = QueryService.getQueryObject();
      if (!query.hasOwnProperty('fq')) {
        return false;
      }

      var keyObjArr = _.filter(query.fq, {key: key, transformer: 'fq:range'});
      if (_.isEmpty(keyObjArr)) {
        return false;
      }
      if (_.isEmpty(_.filter(keyObjArr, function (obj) {
        return doesValueMatch(obj.values[0], value);
      }))) {
        return false;
      }
      return true;
    }

    /**
     * Sets the facet panel open
     */
    function setActiveState(){
      var active = true;
      // If we have autoOpen set active to this state.
      if (angular.isDefined(vm.facetAutoOpen) && vm.facetAutoOpen === 'false') {
        active = false;
      }
      vm.active = active;
    }

    /**
     * Toggles the more button for the facet.
     */
    function toggleMore(){
      vm.more = !vm.more;
    }

   /**
    * Gets the amount to limit by
    * @return {integer|undefined} The amount to return or undefined.
    */
    function getLimitAmount(){
      if(vm.more){
        return undefined;
      }
      return 5;
    }

    //////////////
    ///UTILS
    /**
     * Checks if the query object's queryObject.fq item matches the associated value
     */
    function doesValueMatch(objectValue, start){
      return objectValue.values[0] === start;
    }

    /**
     * Spits out range facet queryObject portion
     */
    function getRangeFacetObject(key, start, end){
      return {
        key: key,
        values: getQueryObjectValues(start, end),
        transformer: 'fq:range'
      };
    }

    /**
     * Spits out queryObject compatible value for range facet entity
     */
    function getQueryObjectValues(start, end){
      return [
        {
          values: [start, end],
          transformer: 'TO'
        }
      ];
    }

    /**
     * remove all filters applied on a facet
     * @param  {object} e event object to stopPropagation of click
     */
    function clearAppliedFilters(e){
      e.stopPropagation();
      var query = QueryService.getQueryObject();
      if(query.hasOwnProperty('fq')){
        var clearedFilter = _.remove(query.fq, {key: vm.facetName, transformer: 'fq:range'});
        if(clearedFilter.length){
          updateFacetQuery(query);
        }
      }
    }
  }
})();
