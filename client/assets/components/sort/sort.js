/*global _*/
(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.sort', [])
    .directive('sort', sort);

  /* @ngInject */
  function sort() {
    var directive = {
      restrict: 'E',
      templateUrl: 'assets/components/sort/sort.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {}
    };

    return directive;


  }

  /* @ngInject */
  function Controller($log, ConfigService) {
    'ngInject';
    var vm = this;

    activate();

    function activate() {
      createSortList();
    }

    function createSortList(){
      var sortOptions = [{label:'default sort', type:'default', order:'', active: true}];
      _.forEach(ConfigService.config.sort_fields, function(value){
        sortOptions.push({label: value, type: 'text', order: 'asc', active: false});
        sortOptions.push({label: value, type: 'text', order: 'desc', active: false});
      });
      vm.sortOptions = sortOptions;
      vm.selectedSort = vm.sortOptions[0];
    }
  }
})();
