import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
// import { connect } from 'react-redux';
// import { ActionCreators } from '../../actions/profile';
// import { getStore } from '../../utils';
import './style.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Button, Input, InputLabel, TextField } from '@material-ui/core';
import Axios from "axios";
import { SERVER_ENDPOINT } from "../constants";
import Paper from '@material-ui/core/Paper';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }

  inputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.validationErrorMessage(event);
  }

  loginForm = async (event) => {
    event.preventDefault();
    let headers = {'Content-Type': 'application/json'};
    Axios.post(`${SERVER_ENDPOINT}/users/login`, {
      username: this.state.username,
      password: this.state.password
    },
    {
      headers: headers
    })
    .then((response) => {
        // handle success
        console.log(response);
        this.props.history.push({
          pathname: '/home',
          state: { username: this.state.username, token: response.data.token }
        });
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    this.setState({ submitted: true });
  }

  render() {
    const { username, password } = this.state;
    return (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
          <Paper>
            <form>
              <div style={{padding: "20px"}}>
                <div>
                  <TextField type="text" value={username} name="username" onChange={(e) => { this.inputChange(e)} } label="Username" />
                </div>
              </div>
              <div style={{padding: "20px"}}>
                <div>
                  <TextField type="password" value={password} autoComplete="on" name="password" onChange={(e) => { this.inputChange(e)} } id="password" label="Password" />
                </div>
              </div>
              <div style={{paddingLeft: "20px"}}>
                  <Button type="submit" color="primary" onClick={this.loginForm}>Login </Button>
              </div>
              <div style={{paddingLeft: "20px", paddingBottom: "10px"}}>
                  <Button color="primary" onClick={(e) => this.props.history.push('/register')}>Register</Button>
              </div>
            </form>
          </Paper>
        </div>
    )
  }
}

export default (withRouter(Login));
// export default Login;