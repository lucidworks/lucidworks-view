(function () {
  'use strict';

  angular
    .module('lucidworksView.components.facetRange')
    .factory('FacetRangeService', FacetRangeService);

  function FacetRangeService(){
    return {
      getEnd: getEnd,
      isDateString: isDateString
    };
  }

  function getEnd(start, gapStr){
    var end;
    if(isDateString(start)){
      end = getEndDate(start, gapStr);
    } else if(!(isNaN(start) || isNaN(gapStr))){
      end = Number(start) + Number(gapStr);
    } else {
      end = null;
    }

    return end;
  }

  function isDateString(start){
    var dateStringTestRegex = /\d{4}-\d{2}-\d{2}T\d{2}\:\d{2}\:\d{2}([+-]\d{2}\:\d{2})|Z/;
    if(angular.isString(start)){
      return (start.search(dateStringTestRegex) !== -1);
    } else {
      return false;
    }
  }

  /**
   * solve for End of date range using gap returned from solr
   */
  function getEndDate(start, gapStr) {
    var regex = /([-+])(\d+)(\w+)(\/\w+)?/g;
    var returnDate = new Date(start);
    var match = regex.exec(gapStr);
    while (match != null) {
      var sign = match[1];
      var value = Number(match[2]);
      var unit = match[3];

      /*eslint indent: ["error", 2, { "SwitchCase": 1 }]*/
      switch(unit) {
        case 'MILLI':
        case 'MILLIS':
        case 'MILLISECONDS':
          if (sign === '-') {
            returnDate.setMilliseconds(returnDate.getMilliseconds() - value);
          } else {
            returnDate.setMilliseconds(returnDate.getMilliseconds() + value);
          }
          break;

        case 'SECOND':
        case 'SECONDS':
          if (sign === '-') {
            returnDate.setSeconds(returnDate.getSeconds() - value);
          } else {
            returnDate.setSeconds(returnDate.getSeconds() + value);
          }
          break;

        case 'HOUR':
        case 'HOURS':
          if (sign === '-') {
            returnDate.setHours(returnDate.getHours() - value);
          } else {
            returnDate.setHours(returnDate.getHours() + value);
          }
          break;

        case 'DATE':
        case 'DAY':
        case 'DAYS':
          if (sign === '-') {
            returnDate.setDate(returnDate.getDate() - value);
          } else {
            returnDate.setDate(returnDate.getDate() + value);
          }
          break;

        case 'MONTH':
        case 'MONTHS':
          if (sign === '-') {
            returnDate.setMonth(returnDate.getMonth() - value);
          } else {
            returnDate.setMonth(returnDate.getMonth() + value);
          }
          break;

        case 'YEAR':
        case 'YEARS':
          if (sign === '-') {
            returnDate.setYear(returnDate.getYear() - value);
          } else {
            returnDate.setFullYear(returnDate.getFullYear() + value);
          }
          break;
      }

      match = regex.exec(gapStr);
    }
    return returnDate.toISOString();
  }
})();
