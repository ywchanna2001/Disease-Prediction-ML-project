import Navbar from './components/Navbar';
import Home from './components/Home';
import Help from './components/Help';// Import the Feedback component
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Feedback from './components/Feedback';
import MedicalCenter from './components/MedicalCenter';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="content">
          <Switch>
            <Route path="/medical-centers">
              <MedicalCenter /> {/* Assuming you have a MedicalCenters component */}
            </Route>
            <Route path="/help">
              <Help />
            </Route>
            <Route path="/feedback">
                <Feedback />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;