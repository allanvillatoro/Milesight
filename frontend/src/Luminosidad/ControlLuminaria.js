import React from 'react';
import axios from 'axios';

class ControlLuminaria extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            encendido: false
        };
        this.cambiarEstadoLuminaria = this.cambiarEstadoLuminaria.bind(this);
    }

    async cambiarEstadoLuminaria(){
        let encendido1 = !this.state.encendido;
        let objeto = {encendido: encendido1};
        try{
            const respuesta = await axios.post('/api/controlluz', objeto);
            if (respuesta.request.status === 200) {
              this.setState((state, props) => ({
                encendido: encendido1
              }));
            }
            else{
              console.log('Error al hacer POST');
            }
        }
        catch(e){
            console.log(e);
        }
    }

    render () {
        return (  
          <div>
              <button type="submit" style={{width:"100%"}} className={this.state.encendido ? "btn btn-warning": "btn btn-secondary"} onClick={this.cambiarEstadoLuminaria}>{this.state.encendido ? 'Apagar': 'Encender'}</button>
          </div>
        );
    }
}
export default ControlLuminaria;