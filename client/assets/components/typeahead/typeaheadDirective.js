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
      link: Link,
      templateUrl: 'assets/components/typeahead/typeahead.html',
      scope: true,
      controllerAs: 'ta',
      bindToController: true,
    };
  }

  function Controller($log, ConfigService, TypeaheadService){
    'ngInject';
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
