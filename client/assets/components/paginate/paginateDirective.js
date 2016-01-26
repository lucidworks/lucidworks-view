(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.paginate')
    .directive('paginate', paginate);

  /* @ngInject */
  function paginate() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'assets/components/paginate/paginate.html',
      controller: Controller,
      controllerAs: 'vm',
      bindToController: true,
      scope: true
    };

    return directive;

  }

  Controller.$inject = ['Orwell', 'PaginateService'];

  /* @ngInject */
  function Controller(Orwell, PaginateService) {
    var vm = this;
    vm.page = 0;
    vm.totalPages = 0;
    vm.getNormalizedPage = getNormalizedPage;



    activate();

    function activate() {
      var queryObservable = Orwell.getObservable('queryResults');

      queryObservable.addObserver(function(data){
        if(data.hasOwnProperty('response')){
          vm.page = PaginateService.getCurrentPage();
          vm.totalPages = PaginateService.getTotalPages();
        } else {
          vm.page = 0;
          vm.totalPages = 0;
        }
      });
    }

    function getNormalizedPage(){
      return vm.page + 1;
    }

  }
})();
