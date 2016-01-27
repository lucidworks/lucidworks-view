/*global _*/
(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.facetList', ['fusionSeedApp.services.config'])
    .directive('facetList', facetList);

  /* @ngInject */
  function facetList() {
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

  Controller.$inject = ['ConfigService'];

  /* @ngInject */
  function Controller(ConfigService) {
    var vm = this;

    activate();

    function activate() {
      var facets = [];
      // default facet autoOpen to true;
      _.forEach(ConfigService.config.facets, function(facet){
        if(!facet.hasOwnProperty('autoOpen')){
          facet.autoOpen = true;
        }
        // initialize active state.
        facet.active = facet.autoOpen;
        facets.push(facet);
      });
      vm.facets = facets;
    }

  }
})();
