(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetFields', ['fusionSeedApp.services.config'])
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

  Controller.$inject = ['ConfigService', 'Orwell', '$log'];

  /* @ngInject */
  function Controller(ConfigService, Orwell, $log) {
    var vm = this;
    vm.facetCounts = [];
    var resultsObservable = Orwell.getObservable('queryResults');

    activate();

    function activate() {
      resultsObservable.addObserver(function (data) {
        var facetFields = data.facet_counts.facet_fields;
        if (facetFields.hasOwnProperty(vm.facetName)) {
          vm.facetCounts = facetFields.facetName;
        }
        $log.debug('filter observer', data.facet_counts.facet_fields);
      });

    }
  }
})();
