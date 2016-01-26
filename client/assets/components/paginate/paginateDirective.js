(function () {
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

  Controller.$inject = ['Orwell', 'PaginateService', 'QueryService', '$log'];

  /* @ngInject */
  function Controller(Orwell, PaginateService, QueryService, $log) {
    var vm = this;
    vm.page = 0;
    vm.totalPages = 0;
    vm.getNormalizedPage = getNormalizedPage;
    vm.getLastPage = getLastPage;
    vm.gotoNextPage = gotoNextPage;
    vm.gotoPreviousPage = gotoPreviousPage;



    activate();

    function activate() {
      var resultsObservable = Orwell.getObservable('queryResults');

      resultsObservable.addObserver(function (data) {
        if (data.hasOwnProperty('response')) {
          vm.page = PaginateService.getCurrentPage();
          vm.totalPages = PaginateService.getTotalPages();
        } else {
          vm.page = 0;
          vm.totalPages = 0;
        }
      });
    }

    function getNormalizedPage() {
      return vm.page + 1;
    }

    function getLastPage() {
      return vm.totalPages - 1;
    }

    function gotoNextPage() {
      gotoPage(PaginateService.getCurrentPage() + 1);
    }

    function gotoPreviousPage() {
      gotoPage(PaginateService.getCurrentPage() - 1);
    }

    function gotoPage(page) {
      $log.debug('Going to page' + page);
      if (page < 0) return;
      if (page > PaginateService.getTotalPages()) return;
      if (page === PaginateService.getCurrentPage()) return;
      QueryService.setQuery({
        start: PaginateService.pageToStartRow(page)
      });
    }

  }
})();
