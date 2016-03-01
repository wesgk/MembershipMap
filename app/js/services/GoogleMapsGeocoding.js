'use strict';

myApp.factory("googleMapsGeocoding", 
  function googleMapsGeocoding (googleMapsApiConfig, $filter, $http){
    
  var googlePlacesKey, defaultLat, defaultLng, defaultRadius;
  defaultLat = 49.2827;
  defaultLng = -123.1207;
  defaultRadius = 250;
  googlePlacesKey = googleMapsApiConfig.key;

  var getLatLng = function(rec){
    var url, address;
    address = rec.address;
    url = 'https://maps.googleapis.com/maps/api/geocode/json';
    return $http.get( url + "?address=" + address + "&key=" + googlePlacesKey)
       .then(function(response){
            return response.data; 
        });
  };

  var getFormattedAddress = function (rec){
    var buildingNumber, streetName, city, province, postalCode, country;
    buildingNumber = (rec.buildingNumber ? rec.buildingNumber + ' ' : '');
    streetName = (rec.streetName ? rec.streetName + ' ' : '');
    city = (rec.city ? rec.city + ' ' : '');
    province = (rec.province ? rec.province + ' ' : '');
    postalCode = (rec.postalCode ? rec.postalCode + ' ' : '');
    country = (rec.country ? rec.country + ' ' : '');

    return buildingNumber + streetName + city + province + postalCode + country;
  };

  var getFormattedContent = function (rec){
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

    return fname + lname + '<br>' + telephone + '<br>' + buildingNumber + streetName + '<br>' + city + province + '<br>' + postalCode + country;
  };

  return {
    getLatLng: getLatLng,
    getFormattedAddress: getFormattedAddress,
    getFormattedContent: getFormattedContent
  };

});