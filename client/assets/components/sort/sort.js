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
  function Controller($scope, ConfigService, QueryService, URLService) {
    'ngInject';
    var vm = this;
    vm.switchSort = switchSort;

    activate();

    /////////////

    function activate() {
      createSortList();

      $scope.$watch('vm.selectedSort', handleSelectedSortChange);
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

    function handleSelectedSortChange(newValue, oldValue){
      if(newValue === oldValue) return;

      switchSort(newValue);
    }

    function switchSort(sort){
      var query = QueryService.getQueryObject();
      switch(sort.type) {
      case 'text':
        if(angular.isUndefined(query.sort)){
          query.sort = sort.label+'%20'+sort.order;
          URLService.setQuery(query);
        }
        break;
      default:
        delete query.sort;
        URLService.setQuery(query);
      }
    }
  }
})();
