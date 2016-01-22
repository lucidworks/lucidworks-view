(function(){
  angular.module('fusionSeedApp.utils.docs',['fusionSeedApp.services.config'])
  .service('DocsHelper', DocsHelper);

  DocsHelper.$inject = ['$log','_'];
  function DocsHelper($log, _){
    return {
      populateFieldNames: populateFieldNames
    };

    function populateFieldNames(document){
      //TODO: populate the field names from the map
    }
  }
})();
