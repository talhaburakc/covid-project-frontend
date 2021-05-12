import logo from './logo.svg';
import './App.css';
import Login from "./Login/Login"
import Register from "./Register/Register"
import Home from "./Home/Home"
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Redirect from="/" to="login" />

        <Route path="/login">
          <Login />
        </Route>

        <Route path="/register">
          <Register />
        </Route>

        <Route path="/home">
          <Home />
        </Route>
      </Router>
    </div>
  );
}

export default App;
