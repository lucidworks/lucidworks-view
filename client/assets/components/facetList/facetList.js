(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetList', ['lucidworksView.services.config'])
    .directive('facetList', facetList);

  function facetList() {
    'ngInject';
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/facetList/facetList.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {}
    };

    return directive;

  }

  function Controller(ConfigService, Orwell) {
    'ngInject';
    var vm = this;
    var resultsObservable = Orwell.getObservable('queryResults');
    vm.facets = [];
    vm.facetNames = {};

    activate();

    function activate() {
      resultsObservable.addObserver(function (data) {
        // Exit early if there are no facets in the response.
        if (!data.hasOwnProperty('facet_counts')) return;

        // Iterate through each facet type.
        _.forEach(data.facet_counts, resultFacetParse);

        function resultFacetParse(resultFacets, facetType){
          // Return early if no facets exists for type.
          if(_.isEmpty(resultFacets)){
            return;
          }
          // Keep a list of facet names and only reflow facets based on changes to this list.
          var facetFields = Object.keys(resultFacets);
          if (!_.isEqual(vm.facetNames[facetType], facetFields)) {
            vm.facetNames[facetType] = facetFields;
            var facets = [];
            _.forEach(facetFields, function(value){
              var facet = {
                name: value,
                type: facetType,
                autoOpen: true,
                label: ConfigService.getFieldLabels()[value]||value
              };
              facets.push(facet);
            });
            // only change facets list on finish.
            vm.facets = facets;
          }
        }
      });
    }

  }
})();
