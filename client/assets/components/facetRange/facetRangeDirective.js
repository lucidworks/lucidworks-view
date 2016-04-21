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
        facetName: '@facetName',
        facetLabel: '@facetLabel',
        facetAutoOpen: '@facetAutoOpen'
      }
    };
  }

  function Controller(ConfigService, QueryService, QueryDataService, Orwell, FoundationApi, LinkService) {
    'ngInject';
    var vm = this;
    console.log("in frd");
    console.log(vm);
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
      resultsObservable.addObserver(parseRangeFacets);
      // initialize the facets.
      parseRangeFacets(resultsObservable.getContent());
    }

    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "June", "July",
      "Aug", "Sept", "Oct",
      "Nov", "Dec"
    ];

    function processGap(date, gap) {
      return gap;//TODO:
    }

    /**
     * Parses the facets from an observable into an array of facets.
     * @param  {object} data The data from the observable.
     */
    function parseRangeFacets(data) {
      // Exit early if there are no facets in the response.
      if (!data.hasOwnProperty('facet_counts')) return;
      // Determine if facet exists.
      var facetRanges = data.facet_counts.facet_ranges;
      //console.log("facetRanges");
      //console.log(vm.facetName);
      //console.log(facetRanges);
      if (facetRanges.hasOwnProperty(vm.facetName)) {
        // Transform an array of values in format [‘aaaa’, 1234,’bbbb’,2345] into an array of objects.
        var facet_bucket = facetRanges[vm.facetName];
        var start = facet_bucket.start;
        var end = facet_bucket.end;
        var gap = facet_bucket.gap;


        console.log(facet_bucket);
        var range_facets = [];
        if (facet_bucket.counts.length > 0) {
          var new_facet_bucket = [];
          for (var i = 0; i < facet_bucket.counts.length; i++) {
            var facet_line = {};
            if (i % 2 == 0) {
              var lower = "";//may be a date
              var upper = "";
              if (facet_bucket.counts[i].indexOf('Z') != -1) {
                //we have a date
                var date = new Date(Date.parse(facet_bucket.counts[i]));

                lower = monthNames[date.getMonth()] + " " + date.getDay();
                upper = processGap(date, gap);
              } else {
                lower = facet_bucket.counts[i];
                upper = (parseInt(facet_bucket.counts[i]) + gap);
              }

              facet_line.label = lower + ' - ' + (upper) + ' (' + facet_bucket.counts[i + 1] + ')';
              //TODO: fix this
              facet_line.name = facet_bucket[i];
              facet_line.hash = FoundationApi.generateUuid();
              facet_line.fq = vm.facetName + ':"[' + lower + " TO " + upper + ']"';
              facet_line.active = isFacetActive(vm.facetName, facet_line.name);
              range_facets.push(facet_line);
              //new_facet_bucket.push(facet_line);
            }
          }
          //facet_ranges[facet] = new_facet_bucket;
        }
        //put this on first
        if (facet_bucket.after > 0) {
          var after_bucket = {};
          after_bucket.name= "After";
          after_bucket.label = '(' + facet_bucket.after + ')';
          after_bucket.hash = FoundationApi.generateUuid();
          after_bucket.fq = vm.facetName + ':"[' + upper + " TO *]";
          after_bucket.active = isFacetActive(vm.facetName, "After");
          range_facets.push(after_bucket);
        }
        //reverse, as we want newest first
        range_facets = range_facets.reverse();//arrayToObjectArray(facetRanges[vm.facetName]);


        if (facet_bucket.before > 0) {
          var before_bucket = {};
          before_bucket.name= "Before";
          before_bucket.label = '(' + facet_bucket.before + ')';
          before_bucket.hash = FoundationApi.generateUuid();
          before_bucket.fq = vm.facetName + ':"[*  TO ' + upper + "]";
          before_bucket.active = isFacetActive(vm.facetName, "Before");
          range_facets.push(before_bucket);
        } else {

        }
        vm.facetCounts = range_facets;


      }

      // Set inital active state
      var active = true;
      // If we have autoOpen set active to this state.
      if (angular.isDefined(vm.facetAutoOpen) && vm.facetAutoOpen === 'false') {
        active = false;
      }
      vm.active = active;
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


    /**
     * Toggles a facet on or off depending on it's current state.
     * @param  {object} facet The facet object
     */
    function toggleFacet(facet) {
      var key = vm.facetName;
      var query = QueryService.getQueryObject();

      // CASE: fq exists.
      if (!query.hasOwnProperty('fq')) {
        query = addRangeFacet(query, key, facet.title);
      } else {
        // Remove the key object from the query.
        // We will re-add later if we need to.
        var keyArr = _.remove(query.fq, {key: key, transformer: 'fq:field'});

        // CASE: facet key exists in query.
        if (keyArr.length > 0) {
          var keyObj = keyArr[0];
          var removed = _.remove(keyObj.values, function (value) {
            return value === facet.title;
          });
          // CASE: value didn't previously exist add to values.
          if (removed.length === 0) {
            keyObj.values.push(facet.title);
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
          query = addRangeFacet(query, key, facet.title);
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
      LinkService.setQuery(query);
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
      var keyObj = _.find(query.fq, {key: key, transformer: 'fq:field'});
      if (_.isEmpty(keyObj)) {
        return false;
      }
      if (_.isEmpty(_.find(keyObj.values, function (data) {
          return data === value;
        }))) {
        return false;
      }
      return true;
    }

    //TODO: fix this
    function addRangeFacet(query, key, title) {
      if (!query.hasOwnProperty('fq')) {
        query.fq = [];
      }
      var keyObj = {
        key: key,
        values: [title],
        transformer: 'fq:field'
      };
      query.fq.push(keyObj);
      return query;
    }

  }
})();
