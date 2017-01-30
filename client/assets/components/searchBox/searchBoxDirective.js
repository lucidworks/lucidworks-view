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

    //NEW mass-autocomplete
    ta.dirty = {};

    function suggest_results(responseDocs,term) {
      var results = [];
      results = _.map(responseDocs,function(doc) {
        $log.info(ta.typeaheadField);
        //higlighting
        //$sce.trustAsHtml(highlight(doc[ta.typeaheadField], term)
        return {label:doc[ta.typeaheadField],value:doc[ta.typeaheadField]};
      });
      return results;
    }

    ta.autocomplete_options = {
      suggest: doTypeaheadSearch,
      // on_error:function () {

      // },
      debounce_suggest:300,
      on_select: selectedSomething
    };


    function highlight(str, term) {
      $log.info(str,term);
      var highlight_regex = new RegExp('(' + term + ')', 'gi');
      return str.replace(highlight_regex,
        '<span class="highlight">$1</span>');
    };

    function selectedSomething(object) {
      if (object) {
        var newValue = object.value;
        ta.query = _.isArray(newValue)?newValue[0]:newValue;
      }
    }

    function doTypeaheadSearch(term) {
      var deferred = $q.defer();
      SearchBoxDataService
        .getTypeaheadResults({q: term, wt: 'json'})
        .then(function (resp) {
          if(resp.hasOwnProperty('response')) {
            deferred.resolve(suggest_results(resp.response.docs,term));
          } else {
            return deferred.reject('No response docs');
          }
        })
        .catch(function (error) {
          // return deferred.reject(error)
          //TODO something better than this
          $log.error('errrrrr:',error);
          // timeoutPromise.reject(error);
        });

      return deferred.promise;
    }


  }

})();
