/**
 * Variables globales
 */
var origenLatitud;
var origenLongitud;
var origen;


var centerLng = 21.3500041;
var centerLat = -98.244856;


var map = L.map('map').setView([centerLng,centerLat], 15);
var buffer = 0.04;
var collection = [];
var geojsonlist = [];
var nodes = {
    "A":{coord:[21.3533009995931,-98.23341584603708]},
    "B":{coord:[21.354020445772637,-98.22448945443551]},
    "C":{coord:[21.344907199891512,-98.2274935285322]},
    "D":{coord:[21.349623775074885,-98.22440362374704]},
    "E":{coord:[21.351862096638484,-98.21968293588083]},
    "F":{coord:[21.346026400954827,-98.21659303109567]}
  
  
  
  
  };
  var nodesArray = [
    {name: "A", coord:[21.3533009995931,-98.23341584603708]},
    {name: "B", coord:[21.354020445772637,-98.22448945443551]},
    {name: "C", coord:[21.344907199891512,-98.2274935285322]},
    {name: "D", coord:[21.349623775074885,-98.22440362374704]},
    {name: "E", coord:[21.351862096638484,-98.21968293588083]},
    {name: "F", coord:[21.346026400954827,-98.21659303109567]}
  
  ];


//base-midnight
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '<a style="color:#000" target="_blank" href="http://www.github.com/HugoLuna5/fast">Repository Fast</a> | <a style="color:#000" href="mailto:hugo_1199@hotmail.com">hugo_1199@hotmail.com</a>'
}).addTo(map);



var geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -98.23341584603708,
          21.3533009995931
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -98.22448945443551,
          21.354020445772637
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -98.2274935285322,
          21.344907199891512
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -98.22440362374704,
          21.349623775074885
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -98.21968293588083,
          21.351862096638484
        ]
      },
      "properties": {}
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -98.21659303109567,
          21.346026400954827
        ]
      },
      "properties": {}
    }
  ]
}

L.geoJSON(geojson, {style: {color:"#ff0000"}}).addTo(map);




var basicGraph = [
{start:"A",finish:"B",distance:10},
{start:"A",finish:"C",distance:15},
{start:"B",finish:"F",distance:15},
{start:"B",finish:"D",distance:12},
{start:"C",finish:"E",distance:10},
{start:"F",finish:"E",distance:5},
{start:"D",finish:"F",distance:1},
{start:"D",finish:"E",distance:2}
];

var graph = readyGraph(basicGraph);
var start = "A";
var finish = "F";

var shortestPath = dijkstra(graph,start,finish);
debugger;

var aux = 0;



var actionEnlazar = document.getElementById('enlazar');
actionEnlazar.addEventListener('click', function (param) {
    param.preventDefault();
    //enlaceModal
    $('#enlaceModal').modal('show');


    var bodyEnlaceModal = $('#bodyEnlaceModal');
    
    

      bodyEnlaceModal.append('<p>'+nodesArray[aux].name+'</p>');   
    
  });

  var actionSaveEnlace = document.getElementById('saveEnlace');
  actionSaveEnlace.addEventListener('click', function (param) { 
      param.preventDefault();
      $('#enlaceModal').modal('hide');
   });
 


var actionSearchRoute = document.getElementById('getRoute');

actionSearchRoute.addEventListener('click', function (param) { 
    param.preventDefault();
    showNodes();

    setTimeout(function(){
        showStartFinish(start,finish);
    },2000);

    setTimeout(function(){
        showPath(start,shortestPath.path);
    },2000);
    
    
    console.log("Distancia entre el punto A y B");

    var x1=new google.maps.LatLng(21.3533009995931,-98.23341584603708);
    var x2=new google.maps.LatLng(21.354020445772637,-98.22448945443551);
    var distancia = google.maps.geometry.spherical.computeDistanceBetween(x1, x2);
    console.log(distancia)
 });

 /**
  * Mostrar los nodos en el mapa
  */
 function showNodes(){

    for(var i = 0; i < nodesArray.length; i++){
        var Doo = [nodesArray[i].coord[0], nodesArray[i].coord[1]];
       console.log(Doo);
        L.circleMarker(Doo,{radius:5,color:"#0000ff",fillOpacity:1}).bindPopup('Punto '+nodesArray[i].name).addTo(map);

    }
  /**
   for(var a in nodes){
      console.log(nodes[a].coord)
    L.circleMarker(nodes[a].coord,{radius:5,color:"#0000ff",fillOpacity:1}).bindPopup('Punto '+a).addTo(map);
  }
   */
}

 /**
  * Definir los paths para verificar que nodo es "inicio", "final" 
  * y su distancia
  * @param {*} paths 
  */
function readyGraph(paths) {
    debugger;
    var graph = {};
    for(var i in paths){
        var path = paths[i];
        var start=path["start"];
        var finish=path["finish"];
        var distance=path["distance"];
        if(typeof graph[start]=="undefined"){
            graph[start]={};
            graph[start][finish]=distance;
        }else{
            graph[start][finish]=distance;
        }
        if(typeof graph[finish]=="undefined"){
            graph[finish]={};
            graph[finish][start]=distance;
        }else{
            graph[finish][start]=distance;
        }
    }
    return graph;
}

/**
 * Algoritmo Dijkstra para encontrar la ruta más corta entre los nodos
 * @param {*} graph 
 * @param {*} s 
 * @param {*} f 
 */
function dijkstra(graph,s,f) {
    debugger;
    var solutions = {};
    solutions[s] = [];
    solutions[s].dist = 0;
    while(true) {
        var parent = null;
        var nearest = null;
        var dist = Infinity;
        for(var n in solutions) {
            if(!solutions[n])
                continue
            var ndist = solutions[n].dist;
            var adj = graph[n];
            for(var a in adj) {
                if(solutions[a])
                    continue;
                var d = adj[a] + ndist;
                if(d < dist) {
                    parent = solutions[n];
                    nearest = a;
                    dist = d;
                }
            }
        }
        if(dist === Infinity) {
            break;
        }
        solutions[nearest] = parent.concat(nearest);
        solutions[nearest].dist = dist;
    }
    var finish = solutions[f];
    return {results:solutions,path:finish,distance:finish.dist};
}

/**
 * Mostrar la ruta más corta en la vista 
 * @param {*} start 
 * @param {*} path 
 */
function showPath(start,path){
    var lineCoords = [];
    lineCoords.push([nodesArray[0].coord[0], nodesArray[0].coord[1]]);
   
  
  
    for (let index = 0; index < nodesArray.length; index++) {
        
      for(var i=0;i<path.length;i++){
          var nodeName = path[i];
          
          if(nodeName == nodesArray[index].name){
            lineCoords.push([nodesArray[index].coord[0], nodesArray[index].coord[1]]);
          }
         
      }
        
    }
    
    var polyline = L.polyline(lineCoords, {color: 'blue'}).addTo(map);
  }
  


/**
 * Funcion para mostrar la los nodos de inicio y final
 * "A" y "B"
 * @param {*} start 
 * @param {*} finish 
 */
function showStartFinish(start,finish){
    var coordinateStart;
    var coordinateFinish;
    for (let index = 0; index < nodesArray.length; index++) {
        if(nodesArray[index].name == start){
            coordinateStart = [nodesArray[index].coord[0], nodesArray[index].coord[1]];
        }

        if(nodesArray[index].name == finish){
            coordinateFinish = [nodesArray[index].coord[0], nodesArray[index].coord[1]];
        }
      
        
    }
  L.circleMarker(coordinateStart,{radius:8,color:"#00ff00",fillOpacity:1}).bindPopup(start+' Inicio').addTo(map);
  L.circleMarker(coordinateFinish,{radius:8,color:"#ff0000",fillOpacity:1}).bindPopup(finish+'  Final').addTo(map);
}


/**
 * Google maps Api JavaScript
 */
//---------------------------------------------------------------------------------------------------//



/**
 * Get coordenates by maps api
 */
var airport = {
    lat: 21.3500041,
    lng: -98.244856
};
function initMap(){
            

    var mapGoogle = new google.maps.Map(document.getElementById('mapGoogle'), {
        zoom: 14,
        center: airport,
        mapTypeId: 'terrain'
    });

    /**
     * Method to search origin place
    **/ 
     actionInputOrigin(mapGoogle);        

}


 /**
     * This method is for search the places with google maps api js
     * Origin places
     **/
    function actionInputOrigin(mapGoogle){
        // Create the search box and link it to the UI element.
        var input = document.getElementById('origin-input');
       var searchBox = new google.maps.places.SearchBox(input);

       // Bias the SearchBox results towards current map's viewport.
       mapGoogle.addListener('bounds_changed', function() {
         searchBox.setBounds(mapGoogle.getBounds());
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
         
         places.forEach(function(place) {
           if (!place.geometry) {
             console.log("Returned place contains no geometry");
             return;
           }
          
            origenId = place.place_id;
            origenLatitud = place.geometry.location.lat();
            origenLongitud = place.geometry.location.lng();
            origen = place.name;
           
          
         });
        
       });
   }



   var addNode = document.getElementById('addNode');


   addNode.addEventListener('click', function (param) { 
        param.preventDefault();
        if(origenLatitud != null && origenLongitud != null ){
            alert('Latitud: '+origenLatitud+' Longitud: '+origenLongitud+ ' Nombre: '+origen);

            var myLatLng = [origenLatitud, origenLongitud]; 
            console.log(myLatLng);
            L.circleMarker(myLatLng,{radius:5,color:"#0000ff",fillOpacity:1}).bindPopup('Punto '+origen).addTo(map);

            var addCoord = 
                { 
                    name: origen, 
                    coord:[origenLatitud,origenLongitud] 
                };

            
            console.log(nodesArray);
            nodesArray.push(addCoord);
            console.log(nodesArray);

        }else{
            swal("Upss", "Debes buscar una direccion para agregar un nodo", "error");

        }
       



    });