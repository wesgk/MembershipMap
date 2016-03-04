myApp.controller('MapController',
  function MapController ($scope, authLevel, userData, googleMapsGeocoding, $rootScope, $location, $log, $timeout){
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
      column: 'buildingNumber',
      title: 'Building #'
    },
    {
      column: 'streetName',
      title: 'Street'
    },
    {
      column: 'city',
      title: 'City'
    },
    {
      column: '',
      title: ''
    }];

    $scope.getAllItems = function (){
      userData.getAllUsers().
        $promise
        .then(function(response){ 
          $scope.users = response;
        })
        .catch(function(response){ $log.error('failure', response); });
    };

    $scope.selectedCls = function (column) {
      return column == $scope.sort.column && 'sort-' + $scope.sort.descending;
    };

    $scope.changeSorting = function (column){
      $log.log('sorting: ' + column);
      var sort = $scope.sort;
      if (sort.column == column) {
          sort.descending = !sort.descending;
      } else {
          sort.column = column;
          sort.descending = false;
      }
    };

    $scope.getAllItems();
});
