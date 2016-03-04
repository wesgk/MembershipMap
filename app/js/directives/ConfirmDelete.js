myApp.directive('confirmDelete', 
  function confirmDelete () {
  'use strict';

  return {
    replace: true,
    templateUrl: 'partials/Utilities/DeleteConfirmation.html',
    scope: {
      onConfirm: '&'
    },
    controller: function ($scope) {
      $scope.isDeleting = false;
      $scope.startDelete = function () {
        $scope.isDeleting = true;
        return $scope.isDeleting;
      };
      $scope.cancel = function () {
        $scope.isDeleting = false;
        return $scope.isDeleting;
      };
      $scope.confirm = function () {
        $scope.onConfirm();
      };
    }
  };
});