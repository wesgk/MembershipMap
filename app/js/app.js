var myApp = angular.module('myApp', ['ngResource', 'ngRoute', 'ngMessages']);

myApp.config(function($routeProvider, $locationProvider, $logProvider, $httpProvider, $stateProvider){
  'use strict';
  
  $routeProvider
    .when("/user/:id", {
      templateUrl: "partials/User.html",
      controller: "UserController",
      resolve: {
        templateUserId: function(userData){
          return userData.getUrlId;
        },
        autoLogin: function(){
          return false;
        },
        autoRedirect: function(){
          return '';
        },
        opType: function(){
          return 'User Edit';
        },
        authLevel: function(authLogin){
          return authLogin.isAdmin;
        }
      }
    })
    .when("/user", {
      templateUrl: "partials/User.html",
      controller: "UserController",
      resolve: {
        templateUserId: function(userData){
          return userData.getNewId;
        },
        autoLogin: function(){
          return false;
        },
        autoRedirect: function(){
          return '';
        },
        opType: function(){
          return 'User Creation';
        },
        authLevel: function(authLogin){
          return authLogin.isAdmin;
        }
      }
    })
    .when("/account", {
      templateUrl: "partials/User.html",
      controller: "UserController",
      resolve: {
        templateUserId: function(userData){
          return userData.getAccountId;
        },
        autoLogin: function(){
          return false;
        },
        autoRedirect: function(){
          return '';
        },
        opType: function(){
          return 'Profile Edit';
        },
        authLevel: function(authLogin){
          return authLogin.isAuthenticated;
        }
      }
    })
    .when("/register", {
      templateUrl: "partials/User.html",
      controller: "UserController",
      resolve: {
        templateUserId: function(userData){
          return userData.getNewId;
        },
        autoLogin: function(){
          return true;
        },
        autoRedirect: function(){
          return '/map';
        },
        opType: function(){
          return 'Registration';
        },
        authLevel: function(authLogin){
          return authLogin.isPublic;
        }
      }
    })
    .when("/users", {
      templateUrl: "partials/Users.html",
      controller: "UserListController",
      resolve: {
        authLevel: function(authLogin){
          return authLogin.isAdmin;
        }
      }
    })
    .when("/map", {
      templateUrl: "partials/Map.html",
      controller: "MapController",
      resolve: {
        authLevel: function(authLogin){
          return authLogin.isAuthenticated;
        },
        googleMapResolver: function($q){
          return googleMaps.resolver.map[1]($q);
        }
      }
    })
    .when("/login", {
      templateUrl: "partials/Login.html",
      controller: "AuthController",
      resolve: {
        autoRedirect: function(){
          // return '/map';
        }
      }
    })
    .when("/login/:logout", {
      templateUrl: "partials/Login.html",
      controller: "AuthController",
      resolve: {
        autoRedirect: function(){
          // return '/map';
        }
      }
    })
    .otherwise({redirectTo: "/login"});
    $locationProvider.html5Mode(true); // removes the hash from URL
    $logProvider.debugEnabled(false);
    $httpProvider.interceptors.push('authInterceptor');
});

$(document).on('click','.navbar-collapse.in',function(e) {
  if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
      $(this).collapse('hide');
  }
});
