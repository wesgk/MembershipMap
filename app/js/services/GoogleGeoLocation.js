myApp.factory('googleGeoLocation', 
  function googleGeoLocation(){
  'use strict';

  var getUserLocation = function (settings, callback){
    // Try HTML5 geolocation.
    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          if(settings.returnLatLng === true){
            callback(pos);
            return;
          }
          geocodePosition(pos, function(formatted_address){
            callback(formatted_address);
          });
        }, function() {
          handleLocationError(true, infowindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infowindow, map.getCenter());
      }
    
      function handleLocationError(browserHasGeolocation, infowindow, pos) {
      infowindow.setPosition(pos);
      infowindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
    }
  };

  var geocodePosition = function (pos, callback) {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ latLng: pos }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        $log.debug('new latLong: ' + results[0].formatted_address);
        // $scope.$apply(function(){
        //   $scope.myAddress['latLong'] = results[0].formatted_address;
        // });
        callback(results[0].formatted_address);
      } else {
        $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
      }
      }
    );
  };

  return {
    getUserLocation: getUserLocation
  };

});