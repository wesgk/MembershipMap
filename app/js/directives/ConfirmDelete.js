'use strict';

myApp.directive('confirmDelete', 
  function confirmDelete () {
  
  return {
    replace: true,
    templateUrl: 'partials/Utilities/DeleteConfirmation.html',
    scope: {
      onConfirm: '&'
    },
    controller: function ($scope) {
      $scope.isDeleting = false;
      $scope.startDelete = function () {
        return $scope.isDeleting = true;
      };
      $scope.cancel = function () {
        return $scope.isDeleting = false;
      };
      return $scope.confirm = function () {
        return $scope.onConfirm();
      };
    }
  };
});