(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetFields', ['fusionSeedApp.services.config',
      'foundation.core'
    ])
    .directive('facetFields', facetFields);

  /* @ngInject */
  function facetFields() {
    return {
      restrict: 'EA',
      templateUrl: 'assets/components/facetFields/facetFields.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        facetName: '@facetName'
      }
    };

  }

  Controller.$inject = ['ConfigService', 'Orwell', 'FoundationApi', '$log'];

  /* @ngInject */
  function Controller(ConfigService, Orwell, FoundationApi, $log) {
    var vm = this;
    vm.facetCounts = [];
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
        // $log.debug('filter observer', data.facet_counts.facet_fields[vm.facetName]);
        // $log.debug('filter observer', facetFields[vm.facetName]);
        $log.debug('facet counts', vm.facetCounts);
      });

    }
  }

})();
