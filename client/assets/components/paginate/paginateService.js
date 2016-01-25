(function() {
  'use strict';

  angular
    .module('fusionSeedApp.components.paginate')
    .factory('PaginationService', PaginationService);

  PaginationService.$inject = [];

  /* @ngInject */
  function PaginationService() {
    var service = {
      pageToStartRow: pageToStartRow
    };

    return service;

    /**
     * Return the number of pages per row
     * @param  {integer} page        The page index
     * @param  {integer} rowsPerPage The number of rows on each page.
     * @return {integer}             The start row
     */
    function pageToStartRow(page, rowsPerPage){
      return (page-1) * rowsPerPage;
    }
  }
})();
