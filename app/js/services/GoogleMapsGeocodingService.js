myApp.factory("googleMapsGeocodingService", 
  function googleMapsGeocoding (googleMapsApiConfig, $filter, $http){
  'use strict';
    
  var googlePlacesKey, defaultLat, defaultLng, defaultRadius;
  defaultLat = 49.2827;
  defaultLng = -123.1207;
  defaultRadius = 250;
  googlePlacesKey = googleMapsApiConfig.key;

  function getAddressComponent(address, component, type) {
    var element = null;
    angular.forEach(address[0].address_components, function (item) {
      if (item.types[0] == component) {
        element = (type === 'short') ? item.short_name : item.long_name;
        var test = '';
      }
    });
    return element;
  }

  return {
    getFormattedAddress: function (rec){ 
      return rec[0].formatted_address;
    },
    getBuildingNumber: function (rec){ 
      return getAddressComponent(rec, 'street_number', 'short');
    },
    getStreetName: function (rec){ 
      return getAddressComponent(rec, 'route', 'short');
    },
    getCity: function (rec){ 
      return getAddressComponent(rec, 'locality', 'short');
    },
    getDistrict: function (rec){ 
      return getAddressComponent(rec, 'administrative_area_level_2', 'short');
    },
    getProvince: function (rec){ 
      return getAddressComponent(rec, 'administrative_area_level_1', 'short');
    },
    getCountry: function (rec){ 
      return getAddressComponent(rec, 'country', 'long');
    },
    getPostalCode: function (rec){ 
      return getAddressComponent(rec, 'postal_code', 'short');
    },
    getLatLng: function(rec){
      var location = rec[0].geometry.location;
      return { lat: location.lat(), lng: location.lng() };
    }
  };

});