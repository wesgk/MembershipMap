'use strict';

myApp.directive('googleMapsGeocoding', 
  function googleMapsGeocoding (googleMapsGeocoding, googleGeoLocation, userData, $log) {
  
  var map, geocoder, infowindow,  markers=[], markerCount=0, addressCount=0, userCount=0, allMarkersInitiated; // keep

  return {
    restrict: 'E',
    replace: true,
    template: '<div id="googleMapsGeocoding" class="user-address-map order-location map-marker-popups full-width"></div>',
    controller: function ($scope){
      function initialize (locationInfo) {
        var elevator, mapOptions;
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-34.397, 150.644); // google defaults
        mapOptions = {
          zoom: 14,
          center: locationInfo,
          mapTypeId: 'terrain'
        }
        map = new google.maps.Map(document.getElementById("googleMapsGeocoding"), mapOptions);
        infowindow = new google.maps.InfoWindow();
      }
      function plotAddresses (users){
        var users = users.slice(0,3);
        userCount = users.length;
        for(var i = 0; i < users.length; i++){
          var user = users[i];
          var name = user.constructor.name;
          if(typeof users[i] === "object" && name === "Resource"){ // test for promise
            var defaultAddress, formattedAddress, formattedContent;
            defaultAddress = user.addresses[user.defaultAddress];
            formattedAddress = googleMapsGeocoding.getFormattedAddress(defaultAddress);
            formattedContent = googleMapsGeocoding.getFormattedContent(user);
            codeAddress(formattedAddress, formattedContent);
            markerCounter(); // increment marker count, limits references in centerAndFit
          }
        }
      }
      function codeAddress (address, content) {
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            marker.addListener('click', function(){
              infowindow.setContent(content);
              infowindow.open(map, marker);
            });
            markers.push(marker);
            centerAndFit(); // center map position
          } else {
            $log.error("Geocode was not successful for the following reason: " + status);
          }
        });
      }
      function getAllUsers (){ 
        userData.getAllUsers().
        $promise 
        .then( function (response){
          if( response ){ 
            plotAddresses(response);
          }
        })
        .catch(function(response) { $log.error('failure', response)});
      }
      function markerCounter(){
        markerCount++; // count markers 
        if(markerCount === userCount){ // force syncronization
          allMarkersInitiated = true; 
        }
      }
      function centerAndFit(){
        if(allMarkersInitiated === true){ 
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
          }
          map.fitBounds(bounds);
        }
      }
      var userLocation = googleGeoLocation.getUserLocation({ returnLatLng: true }, function( locationInfo ){
        $log.log('googleGeoLocation');
        console.dir(locationInfo);
        initialize(locationInfo);
        getAllUsers();
      });
      // ideally user records would be passed in through
      // the directive attribute avaiable in scope{ users: '@' }
      // in which case I would plotAddresses(response) from here
    }
  };
});