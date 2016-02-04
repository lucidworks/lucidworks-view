(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.typeahead')
    .directive('typeahead', typeahead);

  function typeahead(){
    'ngInject';
    return {
      restrict: 'EA',
      controller: Controller,
      templateUrl: 'assets/components/typeahead/typeahead.html',
      scope: true,
      controllerAs: 'ta',
      bindToController: {
        query: '='
      },
      require: '^form'
    };
  }

  function Controller($log, $scope, $q, ConfigService, TypeaheadService){
    'ngInject';
    $log.info(ConfigService.getTypeaheadConfig());
    var ta = this;
    ta.typeaheadField = ConfigService.getTypeaheadField();
    ta.doTypeaheadSearch = doTypeaheadSearch;
    ta.selectedSomething = selectedSomething;
    ta.updateSearchQuery = updateSearchQuery;

    //////////

    function selectedSomething(object){
      if(object){
        var newValue = object.originalObject[ta.typeaheadField];
        ta.query = newValue;
      }
    }

    function updateSearchQuery(inputString){
      ta.query = inputString;
    }

    function doTypeaheadSearch(userInputString, timeoutPromise) {
      var deferred = $q.defer();

      TypeaheadService
        .getQueryResults({
          q: userInputString,
          // make sure results are json.
          wt: 'json'
        })
        .then(function(resp){
          var objectToResolve = {
            data: resp.response.docs
          };
          deferred.resolve(objectToResolve);
        })
        .catch(function(error){
          timeoutPromise.reject(error);
        });

      return deferred.promise;
    }


  }

})();
