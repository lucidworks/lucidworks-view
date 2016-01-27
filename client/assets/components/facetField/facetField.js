(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetField', ['fusionSeedApp.services.config',
      'foundation.core'
    ])
    .directive('facetField', facetField);

  /* @ngInject */
  function facetField() {
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/facetField/facetField.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        facetName: '@facetName',
        facetLabel: '@facetLabel'
      }
    };

  }

  Controller.$inject = ['ConfigService', 'Orwell', 'FoundationApi'];

  /* @ngInject */
  function Controller(ConfigService, Orwell, FoundationApi) {
    var vm = this;
    vm.facetCounts = [];
    vm.toggleFacet = toggleFacet;
    var resultsObservable = Orwell.getObservable('queryResults');

    activate();

    function activate() {
      resultsObservable.addObserver(function (data) {
        var facetFields = data.facet_counts.facet_fields;
        if (facetFields.hasOwnProperty(vm.facetName)) {
          // Transform an array of values in format [‘aaaa’, 1234,’bbbb’,2345] into an array of objects.
          vm.facetCounts = _.transform(facetFields[vm.facetName], function (result,
            value, index) {
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
      });
    }

    function toggleFacet(){

    }
  }

})();
