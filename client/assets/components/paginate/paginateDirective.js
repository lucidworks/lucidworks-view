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

    /**
     * Get the page number (normalized for viewers from a 1 base)
     * @return {integer} normalized page number
     */
    function getNormalizedPage() {
      return vm.page + 1;
    }

    /**
     * Get the last page (0 start based)
     * @return {integer} The last page from 0 base.
     */
    function getLastPage() {
      return vm.totalPages - 1;
    }

    /**
     * Updates the query parameters to the next page.
     */
    function gotoNextPage() {
      gotoPage(PaginateService.getCurrentPage() + 1);
    }

    /**
     * Updates the query parameters to the previous page.
     */
    function gotoPreviousPage() {
      gotoPage(PaginateService.getCurrentPage() - 1);
    }

    /**
     * Actually updates the page to go to.
     * @param  {integer} page The page to do to
     */
    function gotoPage(page) {
      if (page < 0) return;
      if (page > PaginateService.getTotalPages()) return;
      if (page === PaginateService.getCurrentPage()) return;
      // This will change the query and cause the interface to make an http call.
      QueryService.setQuery({
        start: PaginateService.pageToStartRow(page)
      });
    }

  }
})();
