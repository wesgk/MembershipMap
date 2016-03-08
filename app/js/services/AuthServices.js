myApp.factory('authLogin', 
  function authLogin ($q, $rootScope, $window, $http, $log) {
  'use strict';

  var logout = function ($scope, $rootScope){
    $scope.welcome = '';
    $scope.message = '';
    $rootScope.isAuthenticated = false;
    delete $window.sessionStorage.token;
  };

  var login = function($scope, $rootScope, successcb){
    $http
      .post('/authenticate', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $rootScope.isAuthenticated = true;
        var encodedProfile = data.token.split('.')[1];
        var profile = JSON.parse(url_base64_decode(encodedProfile));
        $rootScope.authenticatedId = profile.id;
        $rootScope.isAdmin = (profile.userType === 1 ? true : false ); 
        $scope.error = ''; // clear existing error messages
        successcb(profile); // return user object
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;
        logout($scope, $rootScope);
        $scope.isAuthenticated = false;
        $rootScope.isAuthenticated = false;
        $rootScope.isAdmin = false;
        // Handle login errors here
        $scope.welcome = '';
        $scope.id = '';
        $scope.error = 'Error: Invalid user or password';
      });
  };

  var isAuthenticated = function () {
    // return true; // always true
    return $rootScope.isAuthenticated;
  };

  var isAdmin = function () {
    // return true; // always true
    return $rootScope.isAdmin;
  };

  var isPublic = function () {
    return true; // always true
  };

  //this is used to parse the profile
  function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
  }
  
  return {
    logout: logout,
    login: login,
    isAuthenticated: isAuthenticated,
    isAdmin: isAdmin,
    isPublic: isPublic
  };

});

// http interceptor
myApp.factory('authInterceptor', function ($q, $window) {
  'use strict';
  
  var request = function (config){
    config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
      }
      return config;
  };

  var responseError = function (rejection) {
    if (rejection.status === 401) {
      // handle the case where the user is not authenticated
    }
    return $q.reject(rejection);
  };

  return {
    request: request,
    responseError: responseError
  };
});

