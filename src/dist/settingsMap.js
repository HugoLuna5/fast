/**
 * Variables globales
 */
var origenLatitud;
var origenLongitud;
var origen;
var marker = new Array();


var centerLng = 21.3500041;
var centerLat = -98.244856;


var map = L.map('map').setView([centerLng,centerLat], 12);
var buffer = 0.04;
//var collection = [];
//var geojsonlist = [];

  var nodesArray = [];


//base-midnight
L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '<a style="color:#000" target="_blank" href="http://www.github.com/HugoLuna5/fast">Repository Fast</a> | <a style="color:#000" href="mailto:hugo_1199@hotmail.com">hugo_1199@hotmail.com</a>'
}).addTo(map);

var basicGraph = [];

var graph;
var start;
var finish;
var shortestPath;

var aux = 0;



/**
 * Evento eliminar todos los elementos
 */
var deleteElements = document.getElementById('deleteNodeAll');
deleteElements.addEventListener('click', function (param) { 
    param.preventDefault();
    location.reload();

 });

var setStartNodeAndFinish =  document.getElementById('setStartNodeAndFinish');

setStartNodeAndFinish.addEventListener('click', function (param) { 
    param.preventDefault();


    /**
     * jQuery para acceder a el elemento en el DOM
     */
     var bodySetStartModal = $('#bodySetStartModal');
     var options = '';
     for (let index = 0; index < nodesArray.length; index++) {
          options += '<option value="'+nodesArray[index].name+'">'+nodesArray[index].name+'</option>'
         
     }
     $('#setStartModal').modal('show');
     $('#containerSelectOrigin').remove();
     $('#containerSelectDest').remove();
    var startDiv = '<div class="form-group" id="containerSelectOrigin"><label for="selectStartNode">Indica el origen</label><select class="form-control" id="selectStartNode">'+options+'</select></div>';
    var finishDiv = '<div class="form-group" id="containerSelectDest"><label for="selectFinishNode">Indica el destino</label><select class="form-control" id="selectFinishNode">'+options+'</select></div>';
     bodySetStartModal.append(startDiv);
     bodySetStartModal.append(finishDiv);

 });


 /**
  * Asignar valor a las variables start and finish
  */
 var saveStartModal = document.getElementById('saveStartModal');
 saveStartModal.addEventListener('click', function (param) { 
     param.preventDefault();
     
        start = document.getElementById('selectStartNode').value;
        finish = document.getElementById('selectFinishNode').value;

        swal("¡Buen trabajo!", "Se asignaron tus puntos de origen: "+start+" y destino: "+finish, "success");
        
         /**
         * Muestra ek inicio y el destino
         */
        setTimeout(function(){
            showStartFinish(start,finish);
        },2000);


        $('#setStartModal').modal('hide');
  });



var showNode = document.getElementById('showNode');

/**
 * Mostrar todos los nodos
 */
showNode.addEventListener('click', function (param) { 
    param.preventDefault(); 
    showNodes();

 });


var actionEnlazar = document.getElementById('enlazar');
actionEnlazar.addEventListener('click', function (param) {
    param.preventDefault();
    //enlaceModal
    $('#enlaceModal').modal('show');


    var bodyEnlaceModal = $('#bodyEnlaceModal');
    /**
     * Limpiar contenedor modal
     */
    for (let index = 0; index < nodesArray.length; index++) {

        if($('#containerNodesInfo'+index)){
            $('#containerNodesInfo'+index).remove();
        }
      
        
    }
    
    for (let i = 0; i < nodesArray.length; i++) {//primer valor
        
        var containerNodesInfo = '<div class="form-group" id="containerNodesInfo'+i+'"><input type="hidden" id="nodeInfoValue'+i+'" value="'+nodesArray[i].name+'" />  <label for="inputNodesInfo'+i+'">Nodos conectados al nodo '+nodesArray[i].name+'</label> <input id="inputNodesInfo'+i+'" placeholder="Escribe a que nodo esta conectado (Ejemplo: NodoA,NodoB,NodoF)" class="form-control" /></div>';
        bodyEnlaceModal.append(containerNodesInfo);

      
          
      
    
    }

    var LatitudA, LongitudA, LatitudB, LongitudB;//se guardaran las coordenadas para calcular la distancia

    var actionSaveNodoEnlace = document.getElementById('saveEnlace');
    actionSaveNodoEnlace.addEventListener('click', function (param) { 
        param.preventDefault();
        console.log('Se mostraran los datos');
        

        for (var i = 0; i < nodesArray.length; i++) {//recorrer los elementos mostrados en la ventana

            var elementInput = document.getElementById('nodeInfoValue'+i).value;//obtener el valor del input oculto con el inicio
           

            var elementsInput = document.getElementById('inputNodesInfo'+i).value;//obtener los valores de los input
            var res = elementsInput.split(",");//separarlos por una "," se crea un arreflo

            /**
             * Validar que contenga datos el arreglo "res"
             */
           
            if(res[0] != ""){
                for (var j = 0; j < res.length; j++) {
                

                    for (var x = 0; x < nodesArray.length; x++) {//buscar elementos de elementsInput en nodesArray
                       
                        if(elementInput == nodesArray[x].name){
                            LatitudA = nodesArray[x].coord[0];
                            LongitudA = nodesArray[x].coord[1];
                        }
    
                        if(res[j] == nodesArray[x].name){
                            LatitudB = nodesArray[x].coord[0];
                            LongitudB = nodesArray[x].coord[1];
                            console.log('Coordenada: '+LatitudB);
                        }
                        
                    }
    
                    /**
                     * Guardar datos
                     */
                    var addElementToConnect = {start:elementInput,finish:res[j],distance:getDistanceElements(LatitudA, LongitudA, LatitudB, LongitudB)};
                        console.log("Elementos Originales")
                        console.log(basicGraph);
                        basicGraph.push(addElementToConnect);
                        console.log("Elementos Agregados")
                        console.log(basicGraph);
                   
    
                    
                }
            
            }



        }
        /**
         * Add readyGraph
         */
        graph = readyGraph(basicGraph);
        
        $('#enlaceModal').modal('hide');



        /**
      * Dibuja la linea para enlazar a los elementos
      */
     
    var coordenadaLatitudStart, coordenadaLongitudStart, coordenadaLatitudFinish, coordenadaLongitudFinish;
    for (var index = 0; index < basicGraph.length; index++) {//enlaces

       for (var x = 0; x < nodesArray.length; x++) {//coordenadas

           if(nodesArray[x].name == basicGraph[index].start){
               coordenadaLatitudStart = nodesArray[x].coord[0];
               
               coordenadaLongitudStart = nodesArray[x].coord[1];
           }

           if(nodesArray[x].name == basicGraph[index].finish){
               coordenadaLatitudFinish = nodesArray[x].coord[0];
               coordenadaLongitudFinish = nodesArray[x].coord[1];
           }
           
       }
       console.log("Llego a dibujar");
       var lineCoordsDib = [];

       lineCoordsDib.push([coordenadaLatitudStart, coordenadaLongitudStart]);
       lineCoordsDib.push([coordenadaLatitudFinish, coordenadaLongitudFinish]);
      

    
   
  
    
        var polylineDib = L.polyline(lineCoordsDib, {color: 'red'}).addTo(map);
       
    
    }
    


     });

        
    
  });


  function getDistanceElements(LatitudA, LongitudA, LatitudB, LongitudB){
    var x1=new google.maps.LatLng(LatitudA, LongitudA);
    var x2=new google.maps.LatLng(LatitudB, LongitudB);
    var distancia = google.maps.geometry.spherical.computeDistanceBetween(x1, x2);

    return parseInt(distancia);
}

var actionSearchRoute = document.getElementById('getRoute');

/**
 * Funcion para mostrar la ruta cuando
 * los demas datos ya esten cargados
 */
actionSearchRoute.addEventListener('click', function (param) { 
    param.preventDefault();
    /**
        * Agregar los datos a Dijkstra
        */
       shortestPath = dijkstra(graph,start,finish);
    
    /**
     * Muestra la ruta más corta
     */
    //setTimeout(function(){
        showPath(start,shortestPath.path);
    //},2000);
    
    
 });

 /**
  * Mostrar los nodos en el mapa
  */
 function showNodes(){

    for(var i = 0; i < nodesArray.length; i++){
        var Doo = [nodesArray[i].coord[0], nodesArray[i].coord[1]];
       
        L.circleMarker(Doo,{radius:5,color:"#0000ff",fillOpacity:1}).bindPopup().addTo(map);

        L.marker(Doo).addTo(map)
        .bindPopup('Punto '+nodesArray[i].name)
        .openPopup();

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
    
    var graphReady = {};
    for(var i in paths){
        var path = paths[i];
        var start=path["start"];
        var finish=path["finish"];
        var distance=path["distance"];
        if(typeof graphReady[start]=="undefined"){
            graphReady[start]={};
            graphReady[start][finish]=distance;
        }else{
            graphReady[start][finish]=distance;
        }
        if(typeof graphReady[finish]=="undefined"){
            graphReady[finish]={};
            graphReady[finish][start]=distance;
        }else{
            graphReady[finish][start]=distance;
        }
    }
    return graphReady;
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

    /**
     * Search node start
     */
    for (let index = 0; index < nodesArray.length; index++) {
       if(start == nodesArray[index].name){
        lineCoords.push([nodesArray[index].coord[0], nodesArray[index].coord[1]]);
       }
        
    }

    
   
  
  
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
            //alert('Latitud: '+origenLatitud+' Longitud: '+origenLongitud+ ' Nombre: '+origen);

            var myLatLng = [origenLatitud, origenLongitud]; 
            console.log(myLatLng);
            var LamMarker =  L.circleMarker(myLatLng,{radius:5,color:"#0000ff",fillOpacity:1}).bindPopup('Punto '+origen).addTo(map);
            
           
            marker.push(LamMarker);
           

            var LamMarker2 = L.marker(myLatLng).addTo(map)
            .bindPopup('Punto '+origen)
            .openPopup();
            var addCoord = 
                { 
                    name: origen, 
                    coord:[origenLatitud,origenLongitud] 
                };
            marker.push(LamMarker2);

            
            console.log(nodesArray);
            nodesArray.push(addCoord);
            console.log(nodesArray);
            document.getElementById('origin-input').value = null;
            origenLatitud = null;
            origenLongitud = null;

            console.log(marker);
        }else{
            swal("Upss", "Debes buscar una direccion para agregar un nodo", "error");

        }
       



    });