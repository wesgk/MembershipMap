myApp.directive('googleMapsDraggable', 
  function googleMapsDraggable ($log, googleMapsGeocodingService){
  'use strict'; 
  
  var defaultLat=49.2827, defaultLng=-123.1207, mapCenter, userDefinedCenter=false, mapZoom=10;
  mapCenter = new google.maps.LatLng(defaultLat, defaultLng);
  
  return {
    restrict: 'E',
    replace: true,
    scope: {
      myAddress: '=address',
      myLat: '=lat',
      myLng: '=lng',
    },
    template: '<div id="map{{myAddress.id}}" class="user-address-map map-marker-popups {{myAddress.streetName}}"></div>',
    link: function ($scope){
      var geocoder, map, address, contentString;
      // var map, infowindow,  markers=[], markerCount=0, userCount=0, allMarkersInitiated=false; // keep

      function initialize () {
        geocoder = new google.maps.Geocoder();
        var mapOptions = {
          zoom: mapZoom,
          center: mapCenter
        };
        map = new google.maps.Map(document.getElementById("map{{myAddress.id}}"), mapOptions);
      }
      function getFormAddress (){ // get form fields and append in order required by google
        var fields = ['apartmentNumber','buildingNumber', 'streetName', 'city', 'province', 'postalCode'];
        address = '';
        for(var i = 0; i < fields.length; i++){
          var field = $scope.myAddress[fields[i]];
          address += (field) ? (field + ' ') : '';
        }
        contentString = address;
      }
      function formContainsLatLng(){
        var lat=$scope.myAddress.lat, lng=$scope.myAddress.lng;
        if(lat && lng){
          return { lat: Number(lat) , lng: Number(lng) };
        }else{
          return false;
        }
      }
      function reverseGeocodeAddress () {
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var latLng = googleMapsGeocodingService.getLatLng(results);
            populateFormFields(results);
            $scope.myLat = latLng.lat; // delete?
            $scope.myLng = latLng.lng; // delete?
            if(!userDefinedCenter) map.setCenter(results[0].geometry.location); // center map to marker
            map.addListener('center_changed', function(){
              mapCenter = map.getCenter();
              userDefinedCenter = true; // allow center position to be defined by user
            });
            map.addListener('zoom_changed', function(){
              mapZoom = map.getZoom();
              $log.log('you zoom_changed to : ' + mapZoom);
            });
            // UPDATE MARKER INFO-WINDOW WITH LATLNG
            contentString = contentString + '<br>Lat: ' + latLng.lat + ' Lng: ' + latLng.lng + '<br>'; 
            var markerContent = { 'myContent': contentString };
            var infowindow = new google.maps.InfoWindow({
              content: markerContent.myContent
            });
            var marker = new google.maps.Marker({
              map: map,
              draggable: true, 
              position: results[0].geometry.location,
              myHtmlContent: 'test content'
            });
            marker.addListener('click', function(){
              infowindow.open(map, marker);
            });
            marker.addListener('dragend', function(){
              geocodePosition(marker.getPosition(), function(results){
                $log.debug('in google.map.dragend callback : ' + results[0].formatted_address);
                populateFormFields(results);
                infowindow.setContent(results[0].formatted_address);
              });
            });
          } else {
            alert("Geocode was not successful for the following reason: " + status);
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
        // markers.push(marker);
        map.setCenter(latLng); // center map position
      }
      function geocodePosition (pos, callback) {
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            latLng: pos
          }, 
          function(results, status) 
          {
            if (status == google.maps.GeocoderStatus.OK) {
              callback(results);
            } else {
              $("#mapErrorMsg").html('Cannot determine address at this location.'+status).show(100);
            }
          }
        );
      }
      function populateFormFields (results) {
        $scope.$apply(function(){
          // SET NEW ADDRESS VALUES TO FORM
          $scope.myAddress.buildingNumber = googleMapsGeocodingService.getBuildingNumber(results);
          $scope.myAddress.streetName = googleMapsGeocodingService.getStreetName(results);
          $scope.myAddress.city = googleMapsGeocodingService.getCity(results);
          $scope.myAddress.province = googleMapsGeocodingService.getProvince(results);
          $scope.myAddress.country = googleMapsGeocodingService.getCountry(results);
          $scope.myAddress.postalCode = googleMapsGeocodingService.getPostalCode(results);
          var latLng = googleMapsGeocodingService.getLatLng(results);
          $scope.myAddress.lat = latLng.lat; // LATLNG are not returned in this result set
          $scope.myAddress.lng = latLng.lng; // so this API call is required to populate form
        });
      }
      initialize();
      getFormAddress();
      var thisLatLng = formContainsLatLng();
      if(thisLatLng){
        // $log.log('has LatLng');
        geocodeAddress(thisLatLng, contentString); // contentString is declared as link/top-parent var
      }else{
        // $log.log('has not LatLng');
        reverseGeocodeAddress();
      }
      
    }
  };
});