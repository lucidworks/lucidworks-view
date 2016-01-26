(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.paginate')
    .factory('PaginateService', PaginateService);

  PaginateService.$inject = ['Orwell'];

  /* @ngInject */
  function PaginateService(Orwell) {
    var queryObservable = Orwell.getObservable('query');
    var resultsObservable = Orwell.getObservable('queryResults');
    var service = {
      pageToStartRow: pageToStartRow,
      getRowsPerPage: getRowsPerPage,
      getCurrentPage: getCurrentPage,
      getTotalPages: getTotalPages
    };

    return service;

    /**
     * Return the number of pages per row
     * @param  {integer} page        The page index
     * @return {integer}             The start row
     */
    function pageToStartRow(page) {
      return (page - 1) * getRowsPerPage();
    }

    /**
     * Get the number of Rows Per Page
     *
     * @return {integer} Rows per page
     */
    function getRowsPerPage() {
      var query = queryObservable.getContent();
      return query.rows;
    }

    function getStartRow() {
      var query = queryObservable.getContent();
      return query.start;
    }

    /**
     * Get the total rows for a searchQuery
     * @return {integer} [description]
     */
    function getTotalResultRows() {
      var results = resultsObservable.getContent();
      if (results.hasOwnProperty('response')) {
        return results.response.numFound;
      }
      return 0;
    }

    /**
     * Get the current page
     * @return {integer} The page number
     */
    function getCurrentPage() {
      return getPage(getStartRow());
    }

    /**
     * Get a page given a start row.
     * @param  {integer} startRow The row to start the page from
     * @return {integer}          The page number
     */
    function getPage(startRow){
      if (getRowsPerPage() === 0 || startRow === 0) return 0;
      return Math.ceil(startRow / getRowsPerPage());
    }


    /**
     * Get the total number of pages for the query.
     * @return {integer} The number of pages
     */
    function getTotalPages() {
      if (getRowsPerPage() === 0) return 0;
      return (getTotalResultRows() > 0) ? (Math.ceil(getTotalResultRows() /
        getRowsPerPage())) : 0;
    }
  }
})();
