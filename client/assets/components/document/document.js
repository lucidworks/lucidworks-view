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
          document: '='
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
      self.doc = DocsHelper.populateFieldLabels($scope.document, ConfigService.getFieldLabels());
    }
    // $log.info(DocsHelper);
  }

  function linkFunc(scope, elem){
    // $log.info(DocsHelper);
  }
})();
