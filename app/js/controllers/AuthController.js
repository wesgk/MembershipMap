'use strict';

myApp.controller('AuthController', 
  function AuthController ($scope, authLogin, autoRedirect, displayMessageService, $routeParams, $rootScope, $filter, $http, $timeout, $log, $location, $window) {
  
  $scope.user = {username: '', password: ''};
  $scope.message = '';

  var logout = $routeParams.logout; // test for logout flag

  if(logout){
    authLogin.logout($scope, $rootScope);
    $location.path('/login');
    $window.location.reload(); // force reload to ensure menu items reset / not an ideal call
  }

  $scope.submit = function () {
    authenticate();
  };

  var authenticate = function (){
    authLogin.login($scope, $rootScope, function(profile){
      $scope.welcome = 'Welcome ' + profile.first_name + ' ' + profile.last_name + ' @ ' + $filter('tel')(profile.telephone);
      $scope.redirect = 'Redirecting . . . ';
      formAlert('success');
      $timeout(function (){
        $location.path(autoRedirect);
      }, 2500);
    });
  }

  $scope.callRestricted = function () {
    $http({url: '/api/restricted', method: 'GET'})
    .success(function (data, status, headers, config) {
      $scope.message = $scope.message + ' ' + data.name; // Should log 'foo'
    })
    .error(function (data, status, headers, config) {
      alert(data);
    });
  };

  var formAlert = function (alertType){ // success / error
    displayMessageService.publish(alertType);  
  };


});
