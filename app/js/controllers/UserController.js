myApp.controller("UserController", 
  function UserController ($scope, userData, authLevel, templateUserId, autoLogin, autoRedirect, opType, displayMessageService, provinces, authLogin, $rootScope, $routeParams, $location, $log, $timeout){
  'use strict';

  if(!authLevel()){ // auth check
    $location.path('/login');
  }

  $scope.user = userData.user; // user schema 
  $scope.userDbRecord = {}; // this will be upated on each save to reflect the content saved in the DB
  // necessary to flag the user when LatLng values have been auto-populated but not saved
  $scope.dbSynced = '';
  $scope.provinces = provinces;
  $scope.selectedProvince = angular.copy($scope.provinces[0].abbreviation);
  $scope.user.defaultAddress = 0; // auto-set 1st address as default
  $scope.opType = opType;
  $scope.userTypes = userData.userTypes;

  var userId = templateUserId(); // retrieve userId
  
  if(userId){ // if id is set retrieve user data
    getUser(userId);
  }

  function getUser (id){
    userData.getUser(id, function (user){
      $scope.user = user;
      // $scope.userDbRecord = user; // used to flag unsaved fields (lat/lng)
      $scope.user.id = $scope.user._id; // handle mongoDB auto id
      setSelectedProvinces($scope.user.addresses); // set province dropdown to selected

      angular.copy($scope.user, $scope.userDbRecord);
    });
  }
  
  $scope.formSave = function (user, newUserForm){ // standard form save
    saveUser(user, newUserForm);
  };

  function saveUser (user, newUserForm){
    $log.debug('in saveNewUser');
    if(newUserForm.$valid){
      userData.save(user)
        .$promise
        .then(function(response){ 
          $log.debug('success', response); 
          getUser(user.id); // get saved fields 
          formAlert('success'); 
          // $scope.user = response; // set new user to current user
          // $scope.user.id = response._id; // copy MongoDB id to scope
          if(autoLogin){ // login user after profile is created (/register)
            $scope.user.username = $scope.user.email;
            $scope.user.password = $scope.user.password;
            authLogin.login( $scope, $rootScope, function(response){
              $timeout(function (){
                $log.info('to call location.path(/'+ autoRedirect + ')');
                $location.path(autoRedirect);
              }, 2500);
            });
          }
        })
        .catch(function(response){ $log.error('failure', response); });
    }
  }

  function setSelectedProvinces (addressArray){
    for(var i = 0; i < addressArray.length; i++){
      var provincePos = userData.getProvincePos(addressArray[i].province);
      if( provincePos && $scope.provinces[provincePos].abbreviation !== undefined ){
        $scope.user.addresses[i].province = angular.copy($scope.provinces[provincePos].abbreviation);
      }
    }
  }

  $scope.isLatLngSaved = function(user){
    // var savedAddress = $scope.userDbRecord.addresses[$scope.userDbRecord.defaultAddress];
    var savedAddress = 'test';
    
    var scopeAddress = $scope.user.addresses[$scope.user.defaultAddress];
    if(savedAddress.lat !== scopeAddress.lat || savedAddress.lng !== scopeAddress.lng){
      return false;
    }else{
      return true;
    }
  };

  $scope.addAddress = function (addresses){
    userData.addAddress(addresses);
  };

  $scope.removeAddress = function (addresses, address, index){
    userData.removeAddress(addresses, address, index);
  };

  $scope.reset = function (){
    userData.reset();
  };

  function formAlert (alertType){ // alertType: success || error
    displayMessageService.publish(alertType); 
  }

});