myApp.directive('googleMapsDraggable', 
  function googleMapsDraggable ($log, googleMapsGeocoding){
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

      function geocodeAddress () {
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var latLng = googleMapsGeocoding.getLatLng(results);
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
          $scope.myAddress.buildingNumber = googleMapsGeocoding.getBuildingNumber(results);
          $scope.myAddress.streetName = googleMapsGeocoding.getStreetName(results);
          $scope.myAddress.city = googleMapsGeocoding.getCity(results);
          $scope.myAddress.province = googleMapsGeocoding.getProvince(results);
          $scope.myAddress.country = googleMapsGeocoding.getCountry(results);
          $scope.myAddress.postalCode = googleMapsGeocoding.getPostalCode(results);
          var latLng = googleMapsGeocoding.getLatLng(results);
          $scope.myAddress.lat = latLng.lat; // LATLNG are not returned in this result set
          $scope.myAddress.lng = latLng.lng; // so this API call is required to populate form
        });
      }
      initialize();
      getFormAddress();
      geocodeAddress();
    }
  };
});