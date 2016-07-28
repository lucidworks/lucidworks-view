(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetList', ['lucidworksView.services.config'])
    .directive('facetList', facetList);

  function facetList() {
    'ngInject';

    return {
      restrict: 'EA',
      templateUrl: 'assets/components/facetList/facetList.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {}
    };
  }

  function Controller(ConfigService, Orwell) {
    'ngInject';
    var vm = this;
    var resultsObservable = Orwell.getObservable('queryResults');
    vm.facets = [];
    vm.facetNames = {};

    resultsObservable.addObserver(function (data) {

      if (!data.hasOwnProperty('facet_counts')) {
        return; // Exit early if there are no facets in the response.
      }

      _.forEach(data.facet_counts, function (resultFacets, facetType){
        if(_.isEmpty(resultFacets)){
          return; // Return early if no facets exists for type.
        }

        var facetFields = Object.keys(resultFacets);
        if (_.isEqual(vm.facetNames[facetType], facetFields)) {
          return; // Keep a list of facet names and only reflow facets based on changes to this list.
        }

        vm.facetNames[facetType] = facetFields;

        vm.facets = _.concat(vm.facets, facetFields.map(function (value) {
          return {
            name: value,
            type: facetType,
            autoOpen: true,
            label: ConfigService.getFieldLabels()[value] || value
          };
        }));
      });
    });

  }
})();
