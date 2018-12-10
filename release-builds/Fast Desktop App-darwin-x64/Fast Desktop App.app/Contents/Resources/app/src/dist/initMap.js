        /**
         * Declaracion de variables globales 
         **/
        

        var airport = {
            lat: 21.3500041,
            lng: -98.244856
        };

        /**
         * Originales
         *  lat: 33.64017019720775,
         *  lng: -84.444197108928
         */

        var Path; // Polyline
        var map;

        /**
         * Variables para guardar el origen y el destiono 
         **/
        var destino;
        var destinoLatitud;
        var destinoLongitud;
        var destionoId;



        var origen;
        var origenLatitud;
        var origenLongitud;
        var origenId;

       
        function initMap(){
            

            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 14,
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


            /**
             * Marcadores con un click
             */
           
            google.maps.event.addListener(map, 'click', function(event) {
                    

                var checkBox = document.getElementById("switch_action").checked;
                // If the checkbox is checked, display the output text
                if (checkBox){
                    alert(event.latLng.lat() + ", " + event.latLng.lng());
                } else {
            
                }
            });   
               
           

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


            }); 
            
            

        }




        


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

             origenId = place.place_id;
             origenLatitud = place.geometry.location.lat();
             origenLongitud = place.geometry.location.lng();
            console.log(origenLatitud)
            console.log(origenLongitud)

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
            destionoId = place.place_id;
            var destinoLatitud = place.geometry.location.lat();
            var destinoLongitud = place.geometry.location.lng();
            console.log(origenLatitud)
            console.log(origenLongitud)
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

       
    calcRoute();

       /*
        swal({
            title: "Buen trabajo",
            text: "Te diriges de: "+origen+", hacia: "+destino,
            icon: "success",
            button: "Encontrar ruta",
            });


            setTimeout(function(){
                alert("Prueba");
            }, 1000);

            */



           /*
            swal("Te diriges de: "+origen+", hacia: "+destino+"\n Elige un algoritmo para trazar la ruta", {
                buttons: {
                  cancel: "Salir",
                  dijkstra: {
                    text: "Dijkstra",
                    value: "dijkstra",
                  },
                  floyd: {
                    text: "Floyd",
                    value: "floyd",
                  },
                  warshall:{
                    text: "Warshall",
                    value: "warshall",
                  }
                },
              })
              .then((value) => {
                switch (value) {
               
                  case "dijkstra":
                        swal("Algoritmo!", "Dijkstra!", "success");
                   break;
               
                  case "floyd":
                    swal("Algoritmo!", "Floyd!", "success");
                   break;
                  case "warshall":
                    swal("Algoritmo!", "Warshall!", "success");
                    break;
               
                  default:
                    break;
                }
              });
           */
        
    }



    function calcRoute() {
        // Create a renderer for directions and bind it to the map.
       
        console.log("datos");
        
       

        var directionsDisplay = new google.maps.DirectionsRenderer();// also, constructor can get "DirectionsRendererOptions" object
        directionsDisplay.setMap(map); // map should be already initialized.
    
        var request = {
            origin : {'placeId': origenId},
            destination : {'placeId': destionoId},
            travelMode : google.maps.TravelMode.WALKING
        };
        var directionsService = new google.maps.DirectionsService(); 
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
               

                setTimeout(function(){
                    directionsDisplay.setMap(null);

                },3000);
            }
        });



      }

    