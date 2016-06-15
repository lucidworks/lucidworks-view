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

  function Controller(ConfigService, Orwell, LocalParamsService) {
    'ngInject';
    var vm = this;
    var resultsObservable = Orwell.getObservable('queryResults');
    vm.facets = [];
    vm.facetNames = {};
    vm.facetLocalParams = {};

    activate();

    function activate() {
      resultsObservable.addObserver(function (data) {
        // Exit early if there are no facets in the response.
        if (!data.hasOwnProperty('facet_counts')) return;
        vm.facetLocalParams = LocalParamsService.getLocalParams(data.responseHeader.params);

        // Iterate through each facet type.
        _.forEach(data.facet_counts, resultFacetParse);

        function resultFacetParse(resultFacets, facetType){
          // Keep a list of facet names and only reflow facets based on changes to this list.
          var facetFields = Object.keys(resultFacets);
          if (!_.isEqual(vm.facetNames[facetType], facetFields)) {
            var oldFields = _.difference(vm.facetNames[facetType], facetFields);
            var newFields = _.difference(facetFields, vm.facetNames[facetType]);

            // Creating temp facet so that we don't have to change the model in Angular
            var tempFacets = _.clone(vm.facets);

            //removing old fields
            _.forEach(oldFields, function(field){
              _.remove(tempFacets, function(item){
                return item.name === field && item.type === facetType;
              });
            });

            // Adding new facet entries
            var newFacets = [];
            _.forEach(newFields, function(value){
              var facet = {
                name: value,
                type: facetType,
                autoOpen: true,
                label: ConfigService.getFieldLabels()[value]||value,
                tag: LocalParamsService.getLocalParamTag(vm.facetLocalParams[retrieveFacetType(facetType)], value) || null
              };
              newFacets.push(facet);
            });

            // Updating the list till the end.
            tempFacets = _.concat(tempFacets, newFacets);
            vm.facets = tempFacets;

            // Updating the reflow deciding list.
            vm.facetNames[facetType] = facetFields;
          }
        }
      });
    }

    /**
     * Retrieves the facet type from the facetType variable
     * @param  {string} facetType facet type present in responseHeader.params
     * @return {string}           facet type split frmo the initial string
     */
    function retrieveFacetType(facetType){
      //example: @param: facet_fields, @return: field
      return facetType.split('_')[1].slice(0,-1);
    }

  }
})();
