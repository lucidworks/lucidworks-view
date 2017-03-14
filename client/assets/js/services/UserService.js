(function () {
  'use strict';

  angular
    .module('lucidworksView.services.user', [])
    .factory('UserService', UserService);

  function UserService(){
    let user;
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
