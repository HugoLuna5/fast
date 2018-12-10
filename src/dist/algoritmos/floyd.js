/* * * * * * * * * * * * * * * * * * * * * * * *

/**
* Algoritmo de Floyd-Warshall
* Encontra a menor distancia entre los vertices del grafo
*
* Complejidad theta(|V|^3)
*/
var algoritmoFloydWarshall = (function(){

	return { floydWarshall: floydWarshall };

	var dist;

	/**
	* Inicializacion del algoritmo
	* @private
	* @param {array} grafo matriz de entrada do grafo
	* @return {array} distancia da matriz utilizada para el algoritmo
	*/
	function init(grafo) {
		var dist = [];
		for (var i = 0; i < grafo.length; i++) {
			dist[i] = [];
			for (var j = 0; j < grafo.length; j++) {
				if (i === j)
					dist[i][j] = 0;
				// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/isNaN
				else if (isNaN(grafo[i][j]))
					// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Infinity
					dist[i][j] = Infinity;
				else
					dist[i][j] = grafo[i][j];
			}
		}
		return dist;

		/* * * * * * * * * * * * * * * * * * * * * * * *

		        return
		 
			dist = [[0, 7,  9, Infinity, Infinity, 16],
		            [7, 0,  10, 15, Infinity, Infinity],
		            [9, 10, 0, 11, Infinity, 2],
		            [Infinity, 15, 11, 0, 6, Infinity],
		            [Infinity, Infinity, Infinity, 6, 0, 9],
		            [16, Infinity, 2, Infinity, 9, 0]];

		* * * * * * * * * * * * * * * * * * * * * * * */
	}

	/**
    * Encontra o camino mas corto entre cada dos vértices
	* @public
    * @param {array} grafo
    * @return {array} matriz que contiene la menor distancia entre cada par de vértices
    */
	function floydWarshall(grafo) {
		dist = init(grafo);
		for (var k = 0; k < grafo.length; k++) {
			for (var i = 0; i < grafo.length; i++) {
				for (var j = 0; j < grafo.length; j++) {
					if (dist[i][j] > dist[i][k] + dist[k][j])
						dist[i][j] = dist[i][k] + dist[k][j];
				}
			}
		}
		alert("Camino Menor : " + "["+dist+"]");
	
		/* * * * * * * * * * * * * * * * * * * * * * * *

		        return
		 
			dist = [[0, 7, 9, 20, 20, 11],
		            [7, 0, 10, 15, 21, 12],
		            [9, 10, 0, 11, 11, 2],
		            [20, 15, 11, 0, 6, 13],
		            [20, 21, 11, 6, 0, 9],
		            [11, 12, 2, 13, 9, 0]];

		* * * * * * * * * * * * * * * * * * * * * * * */
	}

}());