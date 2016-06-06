(function () {
  'use strict';

  angular
    .module('lucidworksView.components.paginate')
    .factory('PaginateService', PaginateService);


  function PaginateService(Orwell) {
    'ngInject';
    var queryObservable, resultsObservable,
      service = {
        pageToStartRow: pageToStartRow,
        getRowsPerPage: getRowsPerPage,
        getCurrentPage: getCurrentPage,
        getTotalPages: getTotalPages,
        getNormalizedCurrentPage: getNormalizedCurrentPage
      };

    activate();

    return service;

    ////////////////

    /**
     * Activate the service.
     */
    function activate(){
      queryObservable = Orwell.getObservable('query');
      resultsObservable = Orwell.getObservable('queryResults');
    }

    /**
     * Turn a page into a start row.
     * @param  {integer} page        The page index
     * @return {integer}             The start row
     */
    function pageToStartRow(page) {
      return page * getRowsPerPage();
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

    /**
     * Get the current page
     * @return {integer} The page number
     */
    function getCurrentPage() {
      return getPage(getCurrentStartRow());
    }

    /**
     * Get the total number of pages for the query.
     * @return {integer} The number of pages
     */
    function getTotalPages() {
      if (getRowsPerPage() === 0) return 0;
      // total pages = CEIL(ALL ROWS / ROWS PER PAGE)
      return (getTotalResultRows() > 0) ? (Math.ceil(getTotalResultRows() /
        getRowsPerPage())) : 0;
    }

    /////////////////////
    // Private Methods //
    /////////////////////

    /**
     * Get the current start row.
     * @return {integer} The start row
     */
    function getCurrentStartRow() {
      var query = queryObservable.getContent();
      return query.start;
    }

    /**
     * Get the total number of results rows for the current query.
     * @return {integer} Number of result rows.
     */
    function getTotalResultRows() {
      var results = resultsObservable.getContent();
      if (results.hasOwnProperty('response')) {
        return results.response.numFound;
      }
      return 0;
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
     * Get the current page and normalize it wrt 1
     * @return {integer} [Normalized current page value]
     */
    function getNormalizedCurrentPage(){
      return getCurrentPage() + 1;
    }


  }
})();
