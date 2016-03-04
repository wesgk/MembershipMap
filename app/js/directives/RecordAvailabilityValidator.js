myApp.directive('recordAvailabilityValidator',
  function recordAvailabilityValidator ($http) {
  'use strict';
    
  return {
    require : 'ngModel',
    link : function (scope, element, attrs, ngModel) {
      var apiUrl = attrs.recordAvailabilityValidator;

      function setAsLoading(bool) {
        ngModel.$setValidity('recordLoading', !bool); 
      }

      function setAsAvailable(bool) {
        ngModel.$setValidity('recordAvailable', bool); 
      }

      ngModel.$parsers.push( function (value) {
        if(!value || value.length === 0) return;
        // append id to apiUrl if it exists
        // if passed the record from the existing user 
        // will excluded in the validation (this was setup for testing unique email address)
        var urlQuery = '/' + value + (scope.user.id ? '/id/'+scope.user.id : '');
        
        setAsLoading(true);
        setAsAvailable(false);
        
        $http.get(apiUrl + urlQuery)
          .then(function (data) {
            setAsLoading(false);
            setAsAvailable(Boolean(data.data.length === 0));
          });
        return value;
      });
    }
  };
});