  /**
         * Declaracion de variables globales 
         **/
        var customLabel = {
            terminal: {
                label: 'T'
            }
        };

        var airport = {
            lat: 33.64017019720775,
            lng: -84.444197108928
        };

        var Path; // Polyline
        var map;

        /**
         * Variables para guardar el origen y el destiono 
         **/
        var destino;
        var origen;


        function initMap(){
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 18,
                center: airport,
                mapTypeId: 'terrain'
            });

            /**
             * Method to search origin place
             **/ 
            actionInputOrigin();

            /**
             * Method to search destination place
             **/
            actionInputDestino();


            



            map.data.loadGeoJson(data);
            
            // This section downloads the xml data generated and outputs the terminal T symbol on the marker

            downloadUrl('http://fast.tliapp.com.mx/sql_to_xml.php', function(xml_data) {   
                var xml = xml_data.responseXML;
                var markers = xml.documentElement.getElementsByTagName('marker');
                Array.prototype.forEach.call(markers, function(markerElem) {
                    var id = markerElem.getAttribute('id');
                    var type = "terminal";
                    var point = new google.maps.LatLng(
                        parseFloat(markerElem.getAttribute('lat')),
                        parseFloat(markerElem.getAttribute('lng'))
                        );                  
                    
                    
                    var icon = customLabel[type] || {};
                    var marker = new google.maps.Marker({
                        map: map,
                        position: point,
                        label: icon.label,
                    });
                });

                for(var i = 0; i < data.features.length; i++){  // Need to find a better way to compare if the T marker is placed already
                    var token = false;

                    var coords = data.features[i].geometry.coordinates;
                    var latLng = new google.maps.LatLng(coords[1],coords[0]);
                    
                    var lat_t = parseFloat(latLng.lat());   
                    var lng_t = parseFloat(latLng.lng());
                    
                    Array.prototype.forEach.call(markers, function(markerElem) {
                        var point = new google.maps.LatLng(
                                Number(markerElem.getAttribute('lat')),
                                parseFloat(markerElem.getAttribute('lng'))
                            );                        
                        
                        var lat_p = Number(point.lat());
                        var lng_p = parseFloat(point.lng());
                        
                        if(lat_t == lat_p && lng_t == lng_p){
                            token = true;
                        }
                    });
                    
                    if(token == false){
                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: map
                        });
                    }     
                }
            });
            /*---------------------------------------------------------------------------------------------*/
            
            Path = new google.maps.Polyline({
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
            });
            Path.setMap(map);
            
            // This section is related to the routing from entry to exit
            
            var submit_button = document.getElementById('getRoute');
            
            google.maps.event.addDomListener(submit_button, 'click', function() {
                
                searchRoute();


                /**
                 * Dibujar linea de la ruta
                 **/
                /*
                path_temp = route_setup();
                console.log(path_temp);
                for(var i=0;i<path_temp.length;++i){
                    debugger
                    var latLng_temp = new google.maps.LatLng(path_temp[i].lat,path_temp[i].lng);
                    var line = Path.getPath();
                    line.push(latLng_temp);  
                }
                */
            }); 
            debugger
            console(line.getPath());  
            

        }

        function downloadUrl(url, callback) {
            var request = window.ActiveXObject ?
                new ActiveXObject('Microsoft.XMLHTTP') :
                new XMLHttpRequest;

            request.onreadystatechange = function() {
                if (request.readyState == 4) {
                    request.onreadystatechange = doNothing;
                    callback(request, request.status);
                }
            };

            request.open('GET', url, true);
            request.send(null);
        }

        function doNothing() {}


    /**
     * This method is for search the places with google maps api js
     * Origin places
     **/
    function actionInputOrigin(){
         // Create the search box and link it to the UI element.
         var input = document.getElementById('origin-input');
        var searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
            origen = place.name;
          });
          map.fitBounds(bounds);
        });
    }


    /**
     * This method is for search the places with google maps api js
     * Destination places
     **/
    function actionInputDestino(){
         // Create the search box and link it to the UI element.
         var input = document.getElementById('destination-input');
        var searchBox = new google.maps.places.SearchBox(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }

            destino = place.name;
          });
          map.fitBounds(bounds);
        });
    }


    /**
     *Event for click button search route 
     **/
    function searchRoute(){
        swal({
            title: "Buen trabajo",
            text: "Te diriges de: "+origen+", hacia: "+destino,
            icon: "success",
            button: "Encontrar ruta",
            });
    }
