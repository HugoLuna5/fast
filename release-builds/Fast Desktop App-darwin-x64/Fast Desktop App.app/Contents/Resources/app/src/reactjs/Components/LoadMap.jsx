import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class LoadMap extends Component {

    constructor() {
        //Initialize the state in the constructor
       super();
       
    }


    render() {

        function handleClick(e) {
            e.preventDefault();


          }



        return (
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 ">
                        <div className="card ">
                          
                            <center>
                            <button onClick={handleClick} className="btn btn-outline-success col-md-4">Acceder al mapa</button>
                            </center>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoadMap;
