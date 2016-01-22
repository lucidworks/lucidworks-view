(function(){
  angular.module('fusionSeedApp.components.document', ['fusionSeedApp.services.config', 'fusionSeedApp.utils.docs'])
    .directive('document', documentListItem);

  documentListItem.$inject = [];
  function documentListItem(){
    return {
        restrict: 'EA',
        templateUrl: 'assets/components/document/document.html',
        link: linkFunc,
        scope: {
          doc: '='
        },
        controller: Controller,
        controllerAs: 'doc',
        bindToController: true,
    };
  }

  Controller.$inject = ['$log', '$scope', 'DocsHelper', 'ConfigService'];
  function Controller($log, $scope, DocsHelper, ConfigService){
    var self = this;

    init();

    function init(){

    }
    // $log.info(DocsHelper);
  }

  function linkFunc(scope, elem){
    // $log.info(DocsHelper);
  }
})();
