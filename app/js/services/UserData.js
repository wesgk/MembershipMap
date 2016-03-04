myApp.factory('userData', 
  function userData ($resource, $q, $http, $filter, $log, $rootScope, $routeParams, provinces){
  'use strict';

  var resource = $resource('/mongo/user/:id', {id:'@id'}, {"getAll": {method:"GET", isArray:true, params: {something: "foo"}}} );
  
  var masterAddress = { // address array used for duplicating address fields
    id: '0',
    buildingNumber: '',
    apartmentNumber: '',
    streetName: '',
    city: '',
    country: '',
    province: '',
    postalCode: '',
    lat: '',
    lng: '',
    specialInstructions: ''
  };

  var masterUser = { // default blank - used as initial form instance 
    fname: '',
    lname: '',
    email: '',
    telephone: '',
    paypalNumber: 0,
    addresses: [
    {
      id: '0',
      buildingNumber: '',
      apartmentNumber: '',
      streetName: '',
      city: '',
      country: 'USA',
      province: '',
      postalCode: '',
      lat: '',
      lng: '',
      specialInstructions: ''
    }
    ],
    defaultAddress: ''
  };

  var user = { // default blank - used as dirty form
    fname: '',
    lname: '',
    email: '',
    telephone: '',
    paypalNumber: 0,
    addresses: [
    {
      id: '0',
      buildingNumber: '',
      apartmentNumber: '',
      streetName: '',
      city: '',
      country: 'USA',
      province: '',
      postalCode: '',
      lat: '',
      lng: '',
      specialInstructions: ''
    }
    ],
    defaultAddress: ''
  };

  var userTypes = [
    { 
      "id": 1, 
      "name": 'Admin' 
    },
    {
      "id": 5, 
      "name": 'User' 
    }
  ];

  // see bottom of the file for list of provinces/states

  var getProvincePos = function (abbr) {
    for(var i = 0; i < provinces.length; i++){
      if(provinces[i].abbreviation === abbr) return i;
    }
    return;
  };

  // return 1 dimentional array of all user default addresses
  var getAddresses = function (userRecords) { 
    var addresses = [];
    for(var i in userRecords){
      var name = userRecords[i].constructor.name;
      if(typeof userRecords[i] === "object" && name === "Resource"){
        var user = userRecords[i];
        addresses.push(user.addresses[user.defaultAddress]);
      }
    }
    return addresses; 
  };

  // return 1 dimentional array of all non-address data
  var getUserInfo = function (userRecords) { 
    var info = [];
    for(var i in userRecords){
      var name = userRecords[i].constructor.name;
      if(typeof userRecords[i] === "object" && name === "Resource"){
        var user = userRecords[i];
        info.push(user);
      }
    }
    return info; 
  };

  var addAddress = function (addresses) {
    $log.debug('in addAddress service');
    var newId = addresses.length + 1;
    var newAddress = {};
    angular.copy(masterAddress, newAddress);
    newAddress.id = newId;
    addresses.push(newAddress);
  };

  var removeAddress = function (addresses, address, item) {
    var index = item.id ? (item.id - 1) : item;
    if(index >= 0){
      addresses.splice(index, 1); // remove item
      var id = 1;
      for(var key in addresses){ // re-index ids
        addresses[key].id = id;
        id++;
      }
    }
  };

  var reset = function (userId, successcb) {
    if(userId){
      getUser(userId, function(data){
        successcb(data);
      });
    }else{
      angular.copy(masterUser, user);
    }
  };

  var getUser = function (userId, successcb) {
    $http({method:'GET', url: '/mongo/user/'+userId}).
      success(function(data, status, headers, config){
        successcb(data); 
      }).
      error(function(data, status, headers, config){
        $log.warn(data, status, headers(), config);
      });
  };

  var deleteUser = function (userId, successcb) {
    $http({method:'DELETE', url: '/mongo/user/'+userId}).
      success(function(data, status, headers, config){
        successcb(data); 
      }).
      error(function(data, status, headers, config){
        $log.warn(data, status, headers(), config);
      });
  };

  var getFormattedAddress = function (rec){ // accepts custom defined object - not google response
    var buildingNumber, streetName, city, province, postalCode, country;
    buildingNumber = (rec.buildingNumber ? rec.buildingNumber + ' ' : '');
    streetName = (rec.streetName ? rec.streetName + ' ' : '');
    city = (rec.city ? rec.city + ' ' : '');
    province = (rec.province ? rec.province + ' ' : '');
    postalCode = (rec.postalCode ? rec.postalCode + ' ' : '');
    country = (rec.country ? rec.country + ' ' : '');

    return buildingNumber + streetName + city + province + postalCode + country;
  };

  var getFormattedContent = function (rec){ // accepts custom defined object - not google response
    var fname, lname, telephone, address, buildingNumber, streetName, city, province, postalCode, country;
    address = rec.addresses[rec.defaultAddress];
    fname = (rec.fname ? rec.fname + ' ' : ''); 
    lname = (rec.lname ? rec.lname + ' ' : '');
    telephone = (rec.telephone ? $filter('tel')(rec.telephone) + ' ' : '');
    buildingNumber = (address.buildingNumber ? address.buildingNumber + ' ' : '');
    streetName = (address.streetName ? address.streetName + ' ' : '');
    city = (address.city ? address.city + ' ' : '');
    province = (address.province ? address.province + ' ' : '');
    postalCode = (address.postalCode ? address.postalCode + ' ' : '');
    country = (address.country ? address.country + ' ' : '');

    return fname + lname + '<br>' + telephone + '<br>' + buildingNumber + streetName + '<br>' + city + province + '<br>' + country + postalCode ;
  };

  return {
    user: user,
    userTypes: userTypes,
    getUser: getUser,
    save: function (user) {
      return resource.save(user);
    },
    update: function (user) {
      return resource.save(user);
    },
    deleteUser: function (user) {
      return resource.delete(user);
    },
    getAllUsers: function () {
      return resource.query(); // like get but expects an array back
    },
    getAccountId: function () {
      return $rootScope.authenticatedId;
    },
    getUrlId: function () {
      return $routeParams.id;
    },
    getNewId: function () { // id is auto defined by MongoDB
      return '';
    },
    reset: reset,
    getAddresses: getAddresses,
    addAddress: addAddress,
    removeAddress: removeAddress,
    getProvincePos: getProvincePos,
    getFormattedAddress: getFormattedAddress,
    getFormattedContent: getFormattedContent
  };  
});