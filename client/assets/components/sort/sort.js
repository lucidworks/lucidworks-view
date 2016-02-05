(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.sort', [])
    .directive('sort', sort);

  /* @ngInject */
  function sort() {
    var directive = {
      restrict: 'E',
      templateUrl: 'client/assets/compnents/sort/sort.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {}
    };

    return directive;


  }

  /* @ngInject */
  function Controller($log) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {

    }
  }
})();
