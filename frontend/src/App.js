import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Navigation from "./components/Navigation";
import HomeScreen from "./containers/HomeScreen";
import LoginScreen from "./containers/LoginScreen";
import SignupScreen from "./containers/SignupScreen";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navigation />
        <main>
          <Switch>
            <Route path="/" exact component={() => <HomeScreen />} />
            <Route path="/login" exact component={() => <LoginScreen />} />
            <Route path="/signup" exact component={() => <SignupScreen />} />
            <Route path="*" exact component={() => <Redirect to="/" />} />
          </Switch>
        </main>
      </Router>
    </div>
  );
};

export default App;
