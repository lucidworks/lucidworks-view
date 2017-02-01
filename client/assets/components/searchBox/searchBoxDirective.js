(function () {
  'use strict';

  angular
    .module('lucidworksView.components.searchbox')
    .directive('searchBox', searchbox);

  function searchbox() {
    'ngInject';
    return {
      restrict: 'EA',
      controller: Controller,
      templateUrl: 'assets/components/searchBox/searchBox.html',
      scope: true,
      controllerAs: 'ta',
      bindToController: {
        query: '='
      },
      require: '^form'
    };
  }

  function Controller($log, $q, $sce, $scope, ConfigService, QueryService, SearchBoxDataService) {
    'ngInject';
    var ta = this;
    
    ta.typeaheadField = ConfigService.getTypeaheadField();
    ta.checkSubmit = checkSubmit;
    ta.initialValue = _.isArray(ta.query)?ta.query[0]:ta.query;
    ta.noResults = undefined;

    //mass-autocomplete config
    ta.dirty = {};
    
    ta.autocomplete_options = {
      suggest: doTypeaheadSearch,
      on_error: showNoResults,      
      on_select: selectedSomething,
    };    

    //TODO: nasty.
    function checkSubmit($event) {
      if ($event.keyCode === 13) {
        suggest_results(null,null);
      }
    }
    //showAutocomplete
    function doTypeaheadSearch(term) {
      $log.info('tadd:',ta.dirty);
      $log.info('term:',term);
      var deferred = $q.defer();
      ta.noResults = false;
      // set this here
      setQuery(term);
      SearchBoxDataService
        .getTypeaheadResults({q: term, wt: 'json'})
        .then(function (resp) {
          if(resp.hasOwnProperty('response') && resp.response.docs.length) {
            deferred.resolve(suggest_results(resp.response.docs,term));
          } else {
            return deferred.reject('No suggestions for '+term);
          }
        })
        .catch(function (error) {
          //TODO better error reporting
          $log.error('typeahead search error:',error);
          // currently don't want to surface these in the UI
          // return deferred.reject('An error occurred: '+error);
        });

      return deferred.promise;
    }


    function highlight(str, term) {
      var highlight_regex = new RegExp('('+_.escapeRegExp(term)+')', 'gi');
      return str.replace(highlight_regex, '<span class="highlight">$1</span>');
    }

    function selectedSomething(object) {
      if (object) {
        var newValue = _.isArray(object.value) ? object.value[0]:object.value;
        setQuery(newValue);
      }
    }

    function setQuery (query) {
      ta.query = query;
    }

    function showNoResults(message) {
      ta.noResults = true;
      ta.noResultsMessage = message;
    }

    function suggest_results(responseDocs,term) {
      var results = [];
      results = _.map(responseDocs,function(doc) {
        return {label:$sce.trustAsHtml(highlight(doc[ta.typeaheadField][0], term)),value:doc[ta.typeaheadField]};
      });
      return results;
    }
  }

})();
