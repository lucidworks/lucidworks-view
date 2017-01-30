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
    //TODO change 'ta'.
    var ta = this;
    
    ta.typeaheadField = ConfigService.getTypeaheadField();
    ta.initialValue = _.isArray(ta.query)?ta.query[0]:ta.query;
    ta.noResults = false;

    //NEW mass-autocomplete
    ta.dirty = {};

    function suggest_results(responseDocs,term) {
      var results = [];
      results = _.map(responseDocs,function(doc) {
        // higlighting
        return {label:$sce.trustAsHtml(highlight(doc[ta.typeaheadField][0], term)),value:doc[ta.typeaheadField]};
      });
      return results;
    }

    ta.autocomplete_options = {
      suggest: doTypeaheadSearch,
      on_error: showNoResults,      
      on_select: selectedSomething,
    };

    function showNoResults(message) {
      ta.noResults = true;
      ta.noResultsMessage = message;
    }

    function doTypeaheadSearch(term) {
      ta.noResults = false;
      var deferred = $q.defer();
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
          $log.error('error:',error);
          return deferred.reject(error);
          //TODO something better than this
        });

      return deferred.promise;
    }

    function highlight(str, term) {
      $log.info(str,term);
      var highlight_regex = new RegExp('(' + term + ')', 'gi');
      return str.replace(highlight_regex,
        '<span class="highlight">$1</span>');
    };

    function selectedSomething(object) {
      if (object) {
        var newValue = _.isArray(object.value) ? object.value[0]:object.value;
        setQuery(newValue);
      }
    }

    function setQuery (query) {
      ta.query = query;
    }

    


  }

})();
