myApp.directive('displayMessage', 
  function displayMessage (displayMessageService, $log) {
  'use strict';

  return{
    restrict: 'E',
    template: '<div ng-show="showAlert" class="{{styles}}"><button type="button" class="close" ng-click="closeMe()">×</button>{{message}}</div>',
    replace: true,
    scope: {
      message: '@', // MESSAGE CONTENT
      alertType: '@', // SUCCESS / ERROR 
      flashMessage: '@' // IF SET TO TRUE, ALERT HIDES MESSAGE VIA TIMEOUT
    },
    link: function ($scope, $element, $attrs){
      // $scope.closeMe = function(){
      //   $scope.showAlert = false;
      // }
    },
    controller: function ($scope, $element, $timeout) {
      
      var setStyle = function (alertType){ // DEFINE BOOTSTRAP CLASSES BASED ON ALERT TYPE
        var styles;
        switch(alertType){
          case 'success':
            styles = 'alert alert-success';
          break;

          case 'error':
            styles = 'alert alert-danger';
          break;

          default:
            styles = 'alert alert-warning';
          break;
        }
        return styles;
      };

      $scope.showAlert = false;

      $scope.closeMe = function(){
        $scope.showAlert = false;
      };
      
      var callback = function (){
        var styles = setStyle($scope.alertType);
        $scope.styles = styles;
        $scope.showAlert = true;
        if($scope.flashMessage === true){ // if flash-message is set to true
          $timeout($scope.closeMe, 5000);
        }
      };
      displayMessageService.subscribe($scope.alertType, callback); 
    }
  };

  
});