(function () {
  'use strict';

  angular
    .module('lucidworksView.services.user', [])
    .factory('UserService', UserService);

  function UserService(){
    var user;
    return {
      getUser:getUser,
      setUser:setUser
    };

    function getUser(){
      return user;
    }
    function setUser(newUser){
      user = newUser;
    }
  }
})();
