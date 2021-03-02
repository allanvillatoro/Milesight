import React from 'react';
import axios from 'axios';

class Luminosidad extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            medicion: {
                devEUI: '24e124126a230185',
                data: 'A5SCAAAA',
                light: 100,
                time: new Date('2021-03-02T20:33:43.459Z')
            }
        };
        this.leerMedicionLuz = this.leerMedicionLuz.bind(this);
    }

    async leerMedicionLuz(){
        try{
            const respuesta = await axios.get('/api/luminosidad/ultimo');
            let medicion1 = respuesta.data;
            if (medicion1.time != undefined)
                medicion1.time = new Date(medicion1.time);
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
            Hora: {this.state.medicion.time.toLocaleTimeString()}
          </div>
        );
    }
}
export default Luminosidad;