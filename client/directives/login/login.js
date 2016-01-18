angular.module('application').directive('lwLogin', function($log,ConfigApiService) {
  function controller(){
    $log.info("Daymn");
  }

  function link(){
    $log.info("Daymn");
  }

  return {
    controller: controller,
    link: link,
    template: '<h2>Hello Login</h2>'
  };
});
