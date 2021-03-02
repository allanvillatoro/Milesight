import React from 'react';
import axios from 'axios';

class Luminosidad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            medicion: {}
        };
        this.leerMedicionLuz = this.leerMedicionLuz.bind(this);
    }

    async leerMedicionLuz(){
        try{
            const respuesta = await axios.get('/api/luminosidad/ultimo');
            const medicion1 = respuesta.data;
            //this.setState({ medicion: medicion1 });
            this.setState((state, props) => ({
                medicion: medicion1
            }));
          }
          catch(e){
            console.log(e);
          }
    }

    async componentDidMount() {
          this.leerMedicionLuz();
          setInterval(this.leerMedicionLuz, 30000);
    }

    render () {
        return (  
          <div>
            Luz: {this.state.medicion.light} lux
            <br/>
            Hora: {this.state.medicion.time}
          </div>
        );
    }
}
export default Luminosidad;