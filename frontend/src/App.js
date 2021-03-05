import MedicionesLuz from './Luz/MedicionesLuz';
import ControlLuz from './Luz/ControlLuz';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="row">
            <div className="col-sm-12 col-lg-4 offset-lg-4">
                <br/>
                <h2 className="text-center">Iluminancia</h2>
                <img src="foco.jpg" className="img-fluid" alt="Responsive image"/>            
        <Switch>
          <Route exact path="/">
              <MedicionesLuz/>
          </Route>
          <Route path="/ControlLuz">
          <ControlLuz/>
          </Route>
        </Switch>
        </div>
      </div>
    </Router>      
  );
}

export default App;
