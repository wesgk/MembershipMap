myApp.controller("UserListController", 
  function UserListController ($scope, userData, authLevel, $rootScope, $location, $log){
  'use strict';

  if(!authLevel()){ // auth check
    $location.path('/login');
  }

  $scope.sort = {
      column: 'lname',
      descending: false
  };

  $scope.tableHeadings = [
    {
      column: '',
      title: ''
    },
    {
      column: 'fname',
      title: 'First Name'
    },
    {
      column: 'lname',
      title: 'Last Name'
    },
    {
      column: 'email',
      title: 'Email'
    },
    {
      column: 'telephone',
      title: 'Telephone'
    },
    {
      column: 'userType',
      title: 'User Type'
    },
    {
      column: 'city',
      title: 'City'
    },
    {
      column: '',
      title: ''
    }];
    
  var getAllUsers = function (){ 
    userData.getAllUsers().
    $promise
    .then(function(response){ 
      $log.debug('success', response); 
      $scope.users = response; 
    })
    .catch(function (response) { $log.error('failure', response); });
  };

  $scope.deleteUser = function (user){
    user.id = user._id; // set .id field to handle standard routing variables
    userData.deleteUser(user)
    .$promise
    .then(function(response){ 
      $log.debug('success', response); 
      getAllUsers();
    })
    .catch(function(response){ $log.error('failure', response); });
    $log.debug('in deleteUser');
  };

  $scope.selectedCls = function (column) {
    return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
  };

  $scope.changeSorting = function (column){
    $log.log('changeSorting: ' + column);
    var sort = $scope.sort;
    if (sort.column == column) {
        sort.descending = !sort.descending;
    } else {
        sort.column = column;
        sort.descending = false;
    }
  };

  $scope.missingCoords = function(user){
    return userData.missingCoords(user);
  };

  getAllUsers();
  
});