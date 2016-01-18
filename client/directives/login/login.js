angular.module('application').directive('lwLogin', function($log,ConfigApiService) {
  function controller(){
    $log.info("Daymn");
  }

  function link(){
    var self = this;

  }

  return {
    controller: controller,
    link: link,
    templateUrl: '/directives/login/login.html'
  };
});
