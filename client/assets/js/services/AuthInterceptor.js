(function() {
  'use strict';

  angular
    .module('lucidworksView.services.authInterceptor', ['lucidworksView.services.config'])
    .factory('AuthInterceptor', AuthInterceptor);


  function AuthInterceptor($q, $log, $rootScope, $injector) {
    'ngInject';
    var tryingAnon = false;
    return {
      responseError: responseError
    };

    function responseError(resp) {
      var deferred = $q.defer();
      var $state = $injector.get('$state');
      // CASE: If the app is on login page, the code is 401 and the request wasn't a api/session POST, then only attempt anon login
      // The reason for this check so that not all the response errors are intercepted
      if (!$state.is('login') && (resp.status === 401) && !isLoginRequest(resp.config)) {
        //CASE: If not already trying anonymous session then do try...
        if(!tryingAnon) {
          //CASE: If there are usable anon creds, then try it out
          if(useAnonCreds()){
            $log.info('Creating anonymous session with credentials from FUSION_CONFIG.js');
            getAnonSession().then(function(){
              //CASE: If anonymous session creation is successful, go home
              $log.info('Created anonymous session');
              deferred.reject();
              $state.go('home',{query:'(q:\'*\')'});
            },function(err){
              // TODO: Investigate why 201 is going to error handler...
              // If it's the expected behaviour, figure out a better solution
              //CASE: If anonymous login succeeded with a 201 response, go to `home`
              if(err.status === 201){
                $log.info('Created anonymous session');
                $state.go('home',{query:'(q:\'*\')'});
              }
              //CASE: If anonymous login failed, then go to login
              else{
                $log.info('Failed to create anonymous session');
                $state.go('login');
              }
              deferred.reject(err);
            });
          }
          else{
            //CASE: If anonymous login creds are unusable then go to login
            deferred.reject();
            $state.go('login');
          }
        }
        //CASE: If trying anon login, then that promise chain will take care of stuff
        else{
          deferred.reject();
        }
      }
      //CASE: If unauthorized, don't bother.
      else if(resp.status === 403){
        // TODO handle unauthorized users.
        $log.warn('You are unauthorized to access that endpoint');
        deferred.reject(false);
      }
      else{
        deferred.reject(resp);
      }
      // In all cases reject the promise chain

      return deferred.promise;
    }

    //////////////
    ///

    /**
     * [getAnonSession Creates anonymous session with the given config username:passwoed]
     * @return {promise} [Promise for creating the session]
     */
    function getAnonSession(){
      var ConfigService = $injector.get('ConfigService'),
        AuthService = $injector.get('AuthService'),
        $q = $injector.get('$q');

      tryingAnon = true;
      var def = $q.defer();
      AuthService.createSession(ConfigService.config.anonymous_access.username, ConfigService.config.anonymous_access.password)
        .then(function(resp){
          tryingAnon = false;
          def.reject(resp);
        }).catch(function(error){
          tryingAnon = false;
          def.reject(error);
        });
      return def.promise;
    }

    /**
     * [useAnonCreds Checks if it's okay to use anonymous credentials]
     * @return {Boolean} [Whether it's okay or not]
     */
    function useAnonCreds(){
      var ConfigService = $injector.get('ConfigService'),
        anonAccess = ConfigService.config.anonymous_access;

      return !(anonAccess.username === '' || anonAccess.password === '');
    }

    /**
     * [isLoginRequest Checks if a given resp.config originated from a /api/session POST]
     * @param  {Object}  respConfig [The resp.config object]
     * @return {Boolean}            [Whether login request or not]
     */
    function isLoginRequest(respConfig){
      //TODO: Make this better
      var ApiBase = $injector.get('ApiBase');
      return (respConfig.url.indexOf(ApiBase.getEndpoint() + 'api/session') !== -1) && (respConfig.method === 'POST');
    }

  }
})();
