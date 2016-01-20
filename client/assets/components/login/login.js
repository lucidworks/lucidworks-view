angular.module('fusionSeedApp.components.login', [])
  .directive('login', function($log, ConfigService) {
    return {
      controller: controller,
      link: link,
      templateUrl: 'assets/components/login/login.html'
    };

    function controller(){
      $log.info("Daymn");
    }

    function link(){
      var self = this;

    }
  });
