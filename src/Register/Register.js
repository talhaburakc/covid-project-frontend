import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {Button, Input, InputLabel, TextField} from '@material-ui/core';
import Axios from "axios";
import {SERVER_ENDPOINT} from "../constants";
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            name: '',
            surname: '',
            age: '',
            gender: '',
            height: '',
            weight: '',
            city: ''
        }
    }

    inputChange = (event) => {
        const {name, value} = event.target;
        this.setState({[name]: value});
    }

    registerForm = async (event) => {
        event.preventDefault();
        let headers = {'Content-Type': 'application/json'};
        Axios.post(`${SERVER_ENDPOINT}/users/signup`, {
                username: this.state.username,
                password: this.state.password,
                name: this.state.name,
                surname: this.state.surname,
                age: this.state.age,
                gender: this.state.gender,
                height: this.state.height,
                weight: this.state.weight,
                city: this.state.city
            },
            {
                headers: headers
            })
            .then((response) => {
                // handle success
                console.log(response);
                this.props.history.push({
                    pathname: '/home',
                    state: {username: this.state.username, token: response.data.token}
                });
            })
            .catch(function (error) {
                // handle error
                alert(`Signup failed. Please fill all the cells. ${error}`);
                console.log(error);
            })
    }

    render() {
        const {username, password, name, surname, age, gender, height, weight, city} = this.state;
        return (
            <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Paper>
                    <form>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={username} name="username" onChange={(e) => {
                                this.inputChange(e)
                            }} label="Username (alphabetic)"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="password" value={password} name="password" onChange={(e) => {
                                this.inputChange(e)
                            }} id="password" label="Password (min len 8)"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={name} name="name" onChange={(e) => {
                                this.inputChange(e)
                            }} id="name" label="Name"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={surname} name="surname" onChange={(e) => {
                                this.inputChange(e)
                            }} id="surname" label="Surname"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={age} name="age" onChange={(e) => {
                                this.inputChange(e)
                            }} id="age" label="Age"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <FormControl style={{width: "100%"}}>
                                {/* <Input type="text" value={gender} name="gender" onChange={(e) => { this.inputChange(e)} } id="gender" placeholder="Gender" /> */}
                                <InputLabel> Gender </InputLabel>
                                <Select
                                    style={{width: "100%"}}
                                    value={gender}
                                    onChange={(e) => this.setState({gender: e.target.value})}
                                    placeHolder="asd"
                                >
                                    <MenuItem value={"male"}>Male</MenuItem>
                                    <MenuItem value={"female"}>Female</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={height} name="height" onChange={(e) => {
                                this.inputChange(e)
                            }} id="height" label="Height"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={weight} name="weight" onChange={(e) => {
                                this.inputChange(e)
                            }} id="weight" label="Weight"/>
                        </div>
                        <div style={{padding: "20px"}}>
                            <TextField type="text" value={city} name="city" onChange={(e) => {
                                this.inputChange(e)
                            }} id="city" label="City (in Turkey)"/>
                        </div>

                        <div style={{paddingLeft: "15px"}}>
                            <Button type="submit" color="primary" onClick={this.registerForm}>Register </Button>
                        </div>
                        <div style={{paddingLeft: "15px", paddingBottom: "10px"}}>
                            <Button color="primary" onClick={(e) => this.props.history.push('/login')}>Login</Button>
                        </div>

                    </form>
                </Paper>
            </div>
        )
    }
}

export default (withRouter(Register));
// export default Login;