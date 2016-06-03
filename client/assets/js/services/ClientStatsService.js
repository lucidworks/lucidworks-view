(function () {
  'use strict';

  angular
    .module('lucidworksView.services.clientStats', [])
    .factory('ClientStatsService', ClientStatsService);

  function ClientStatsService($window) {
    'ngInject';

    return {
      getBrowserLanguage: getBrowserLanguage,
      getBrowserPlatform: getBrowserPlatform,
      getBrowserUserAgent: getBrowserUserAgent,
      getBrowser: getBrowser,
      getIP: getIP,
      getUsername: getUsername
    };

    /**
     * Returns information related to the client
     * @return {string} The value of the specific client information
     */
    function getBrowserLanguage(){
      return $window.navigator.language;
    }

    function getBrowserPlatform(){
      return $window.navigator.platform;
    }

    function getBrowserUserAgent(){
      return $window.navigator.userAgent;
    }

    function getIP(){
      return '127.0.0.1';
    }

    function getBrowser(){
      return 'browsername';
    }

    function getUsername(){
      return 'username';
    }


  }
})();
