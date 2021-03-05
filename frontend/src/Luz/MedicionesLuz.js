import React from 'react';
import axios from 'axios';

class MedicionesLuz extends React.Component {
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
            const respuesta = await axios.get('/api/medicionesluz/ultimo');
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
        const light = this.state.medicion.light;
        return (                
            <div className="card-body">
                <div className="progress">
                    <div className="progress-bar bg-warning" role="progressbar" style={{width: (light/3000*100+ "%")}}  aria-valuenow="0" aria-valuemin="0" aria-valuemax="3000"></div>
                </div>
                    <h5 className="card-title">{light} lux</h5>
                    <p className="card-text">{this.state.medicion.time.toLocaleTimeString()}</p>
            </div>
        );
    }
}
export default MedicionesLuz;