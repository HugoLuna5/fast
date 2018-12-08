var customLabel = {
    terminal: {
        label: 'T'
    }
};

var airport = {
    lat: 21.3468855,
    lng: -98.2220163
};

var Path; // Polyline
var map;
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: airport,
        mapTypeId: 'terrain'
    });

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
        path_temp = route_setup();
        console.log(path_temp);
        for(var i=0;i<path_temp.length;++i){
            debugger
            var latLng_temp = new google.maps.LatLng(path_temp[i].lat,path_temp[i].lng);
            var line = Path.getPath();
            line.push(latLng_temp);  
        }
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




