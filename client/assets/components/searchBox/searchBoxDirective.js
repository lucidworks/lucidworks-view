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

  function Controller($scope, $q, ConfigService, QueryService,
    SearchBoxDataService) {
    'ngInject';
    var ta = this;
    ta.typeaheadField = ConfigService.getTypeaheadField();
    ta.doTypeaheadSearch = doTypeaheadSearch;
    ta.selectedSomething = selectedSomething;
    ta.updateSearchQuery = updateSearchQuery;
    ta.initialValue = _.isArray(ta.query)?ta.query[0]:ta.query;

    function selectedSomething(object) {
      if (object) {
        var newValue = object.originalObject[ta.typeaheadField];
        ta.query = _.isArray(newValue)?newValue[0]:newValue;
      }
    }

    function updateSearchQuery(inputString) {
      ta.query = inputString;
    }

    function doTypeaheadSearch(userInputString, timeoutPromise) {
      var deferred = $q.defer();

      SearchBoxDataService
        .getTypeaheadResults({q: ta.query, wt: 'json'})
        .then(function (resp) {
          if(resp.hasOwnProperty('response')) {
            var objectToResolve = {
              data: resp.response.docs
            };
            deferred.resolve(objectToResolve);
          } else {
            deferred.reject('No response docs');
          }
        })
        .catch(function (error) {
          timeoutPromise.reject(error);
        });

      return deferred.promise;
    }


  }

})();
