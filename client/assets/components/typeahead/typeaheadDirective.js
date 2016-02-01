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
      scope: true,
      controllerAs: 'ta',
      bindToController: true,
    };
  }

  Controller.$inject = ['$log', 'ConfigService', 'TypeaheadService'];
  function Controller($log, ConfigService, TypeaheadService){
    $log.info(ConfigService.getTypeaheadConfig());
    TypeaheadService.getQueryResults({
      q: '*:*'
    }).then(function(resp){
      $log.info(resp);
    });
  }

  function Link(scope, elem){

  }
})();
