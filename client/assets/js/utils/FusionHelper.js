(function () {
  angular
    .module('fusionSeedApp.utils.fusion', [])
    .factory('FusionHelper', FusionHelper);

  function FusionHelper(){
    return {
      getLandingPagesFromData: getLandingPagesFromData
    };

    /**
     * Extracts landing pages from Fusion response data.
     */
    function getLandingPagesFromData(data){
      return _.get(data, 'fusion.landing-pages');
    }
  }

})();
