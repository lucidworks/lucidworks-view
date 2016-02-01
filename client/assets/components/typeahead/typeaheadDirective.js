(function () {
  'use strict';

  angular
    .module('fusionSeedApp.components.typeahead')
    .directive('typeahead', typeahead);

  typeahead.$inject = [];
  function typeahead(){
    return {
      restrict: 'EA',
      controller: Controller,
      link: Link,
      templateUrl: 'assets/components/typeahead/typeahead.html',
      scope: {
        query: '=',
        formName: '@'
      },
      controllerAs: 'ta',
      bindToController: true,
    };
  }

  function Controller($log, $scope, $q, ConfigService, TypeaheadService){
    'ngInject';
    $log.info(ConfigService.getTypeaheadConfig());
    var ta = this;
    ta.typeaheadField = ConfigService.getTypeaheadField();
    ta.doTypeaheadSearch = doTypeaheadSearch;
    ta.selectedSomething = selectedSomething;

    function selectedSomething(object){
      var newValue = object.originalObject[ta.typeaheadField];
      ta.query = newValue;
    }

    function doTypeaheadSearch(userInputString, timeoutPromise) {
      $log.info($scope.$parent[ta.formName]);
      $log.info($scope);
      var deferred = $q.defer();
      TypeaheadService.getQueryResults({
        q: userInputString
      }).then(function(resp){
        var objectToResolve = {
          data: resp.response.docs
        };
        deferred.resolve(objectToResolve);
      }).catch(function(err){
        timeoutPromise.reject(error);
      });
      return deferred.promise;
    }


  }

  function Link(scope, elem){

  }
})();
