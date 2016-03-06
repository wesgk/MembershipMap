myApp.directive('googleMapsGeocoding', 
  function googleMapsGeocoding (googleMapsGeocodingService, googleGeoLocation, userData, $log) {
  'use strict'; 
  
  var defaultLat=49.2827, defaultLng=-123.1207, mapCenter, userDefinedCenter=false, mapZoom=10;
  mapCenter = new google.maps.LatLng(defaultLat, defaultLng);

  return {
    restrict: 'E',
    replace: false,
    template: '<div id="googleMapsGeocoding" class="user-address-map order-location map-marker-popups full-width"></div>',
    controller: function ($scope){
      
     var map, infowindow,  markers=[], markerCount=0, userCount=0, allMarkersInitiated=false; // keep
      // var geocoder; // uncomment when using reverseGeocodeAddress() 

      function initialize () {
        var elevator, mapOptions;
        // geocoder = new google.maps.Geocoder(); // uncomment when using reverseGeocodeAddress() 
        mapOptions = {
          zoom: mapZoom,
          center: mapCenter,
          mapTypeId: 'terrain'
        };
        map = new google.maps.Map(document.getElementById("googleMapsGeocoding"), mapOptions);
        infowindow = new google.maps.InfoWindow(); // global info window

      }
      function getAllUsers (){ 
        userData.getAllUsers().
        $promise 
        .then( function (response){
          if( response ){ 
            plotAddresses(response);
          }
        })
        .catch(function(response) { $log.error('failure', response); });
      }
      function plotAddresses (users){
        userCount = users.length;
        for(var i = 0; i < users.length; i++){
          var user = users[i];
          var name = user.constructor.name;
          if(typeof users[i] === "object" && name === "Resource"){ // test for promise
            var defaultAddress, formattedAddress, formattedContent;
            defaultAddress = (user.defaultAddress ? user.addresses[user.defaultAddress] : user.addresses[0]);
            formattedAddress = userData.getFormattedAddress(defaultAddress);
            formattedContent = userData.getFormattedContent(user);
            // reverseGeocodeAddress(formattedAddress, formattedContent);
            geocodeAddress({ lat: Number(defaultAddress.lat), lng: Number(defaultAddress.lng)}, formattedContent);
            markerCounter(); // increment marker count, limits references in centerAndFit
          }
        }
      }
      function reverseGeocodeAddress (address, content) {
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
      function geocodeAddress (latLng, content) { // latLng = { lat: [num], lng: [num] }
        var marker = new google.maps.Marker({
            map: map,
            position: latLng
        });
        marker.addListener('click', function(){
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
        markers.push(marker);
        // centerAndFit(); // center map position
      }
      
      function markerCounter(){
        markerCount++; // count markers 
        if(markerCount === userCount){ // force syncronization
          allMarkersInitiated = true;
          centerAndFit(); 
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
      initialize();
      getAllUsers();
      // ideally user records would be passed in through
      // the directive attribute avaiable in scope{ users: '@' }
      // in which case I would plotAddresses(response) from here
    }
  };
});