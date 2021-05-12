import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import {Button, Input, InputLabel, MenuItem} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import {Animation, Legend, LineSeries} from '@devexpress/dx-react-chart';
import Axios from "axios";
import {SERVER_ENDPOINT} from "../constants";
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export class Home extends Component {
    constructor(props) {
        super(props);

        this.token = "";
        this.username = "";
        if (this.props.location.state && this.props.location.state.username && this.props.location.state.token) {
            this.username = this.props.location.state.username;
            this.token = this.props.location.state.token;
        } else {
            this.props.history.push('/login');
        }

        this.state = {
            temperatures: [10, 16, 20, 25],
            temperatureData: [],
            symptoms: [],
            symptomName: "",
            commonSymptoms: [],
            lessCommonSymptoms: [],
            seriousSymptoms: [],
            selectedSymptom: "",
            riskStatus: "",
            currentTemperature: ""
        }
    }

    componentDidMount() {
        let headers = {'Authorization': `Bearer ${this.token}`};
        Axios.get(`${SERVER_ENDPOINT}/users`, {headers: headers})
            .then((response) => {
                // handle success

                this.setState({
                    symptoms: response.data.symptoms,
                    temperatures: response.data.temperature.map(
                        (t, index) => {
                            return {id: index, value: t};
                        }
                    )
                }, (e) => console.log(this.state));
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });

        Axios.get(`${SERVER_ENDPOINT}/symptoms`, {headers: headers})
            .then((response) => {
                // handle success

                this.setState({
                    commonSymptoms: response.data.common,
                    lessCommonSymptoms: response.data["less common"],
                    seriousSymptoms: response.data.serious,
                });
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });

        this.fetchRiskStatus();
    }

    fetchRiskStatus = () => {
        let headers = {'Authorization': `Bearer ${this.token}`};
        Axios.get(`${SERVER_ENDPOINT}/users/risk_status`, {headers: headers})
            .then((response) => {
                // handle success

                this.setState({
                    riskStatus: response.data,
                }, () => console.log(this.state));

                if (response.data === "High") {
                    alert("HIGH RISK STATUS! PlEASE CHECK YOUR DOCTOR IMMEDIATELY");
                }
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }

    addSymptom = () => {
        if (this.state.symptoms.includes(this.state.selectedSymptom)) return;

        let headers = {'Authorization': `Bearer ${this.token}`};

        let newSymptoms = [...this.state.symptoms];

        if (this.state.selectedSymptom.trim() !== "") {
            newSymptoms.push(this.state.selectedSymptom);
            this.setState({symptoms: newSymptoms}, () => {
                Axios.patch(`${SERVER_ENDPOINT}/symptoms`,
                    {"symptoms": this.state.symptoms},
                    {headers: headers}
                )
                    .then((response) => {
                        // handle success
                        this.fetchRiskStatus();
                    })
                    .catch((error) => {
                        // handle error
                        console.log(error);
                    })
            });
        }
    }

    removeSymptom = () => {
        if (this.state.symptoms.includes(this.state.selectedSymptom) === false) return;

        let headers = {'Authorization': `Bearer ${this.token}`};

        let newSymptoms = this.state.symptoms.filter((symptom, index) => symptom !== this.state.selectedSymptom);
        this.setState({symptoms: newSymptoms}, () => {
            Axios.patch(`${SERVER_ENDPOINT}/symptoms`,
                {"symptoms": this.state.symptoms},
                {headers: headers}
            )
                .then((response) => {
                    // handle success
                    this.fetchRiskStatus();
                })
                .catch((error) => {
                    // handle error
                    console.log(error);
                })
        });
    }

    postTemperature(temperature) {
        let headers = {'Authorization': `Bearer ${this.token}`};
        Axios.post(`${SERVER_ENDPOINT}/symptoms/temperature`,
            {"temperature": temperature},
            {headers: headers}
        )
            .then((response) => {
                // handle success
                this.setState({
                    temperatures: response.data.map(
                        (t, index) => {
                            return {id: index, value: t};
                        }
                    )
                })
                this.fetchRiskStatus();
            })
            .catch((error) => {
                // handle error
                console.log(error);
            })
    }

    format = () => tick => tick;

    ValueLabel(props) {
        const {text} = props;
        return (
            <ValueAxis.Label
                {...props}
                text={`${text}%`}
            />
        );
    };

    render() {
        return (
            <div>


                <Paper style={{height: "50%", width: "65%", margin: "0 auto", paddingRight: "20px"}}>
                    <Chart
                        data={this.state.temperatures}
                    >
                        <ArgumentAxis/>
                        <ValueAxis max={40}/>

                        <LineSeries valueField="value" argumentField="id"/>
                        <Title text="User temperature"/>
                    </Chart>
                </Paper>


                <div>
                    <div style={{width: "50%", marginLeft: "40%", marginBottom: "15px", marginTop: "15px"}}>
                        <div style={{color: this.state.riskStatus === "High" ? "red" : "blue"}}>
                            Risk Status: {this.state.riskStatus}
                        </div>
                        <br/>
                        <span style={{color: "blue"}}>Symptoms:</span>
                        {
                            this.state.symptoms.length > 0 ?
                                <ul>
                                    {
                                        this.state.symptoms.map(
                                            (val, index) =>
                                                <li style={{color: "blue"}} key={val}>{val}</li>
                                        )
                                    }
                                </ul>
                                :
                                <span style={{color: "blue"}}> You don't have any symptoms at the moment</span>
                        }
                    </div>
                </div>

                <div style={{display: "flex", alignItems: "baseline", justifyContent: "center"}}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Symptoms</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            onChange={(e) => this.setState({selectedSymptom: e.target.value})}
                            value={this.state.selectedSymptom}
                            style={{width: "120px"}}
                        >
                            <MenuItem disabled style={{color: "orange", fontWeight: "900"}} value={10}>Less Common
                                Symptoms</MenuItem>
                            {
                                this.state.commonSymptoms.map(
                                    (val, index) =>
                                        <MenuItem value={val}>{val}</MenuItem>
                                )
                            }

                            <MenuItem disabled style={{color: "#ff6666", fontWeight: "900"}} value={10}>Common
                                Symptoms</MenuItem>
                            {
                                this.state.lessCommonSymptoms.map(
                                    (val, index) =>
                                        <MenuItem value={val}>{val}</MenuItem>
                                )
                            }

                            <MenuItem disabled style={{color: "#ff0000", fontWeight: "900"}} value={10}>Serious
                                Symptoms</MenuItem>
                            {
                                this.state.seriousSymptoms.map(
                                    (val, index) =>
                                        <MenuItem value={val}>{val}</MenuItem>
                                )
                            }
                        </Select>
                    </FormControl>
                    <Button color="primary" onClick={(e) => this.addSymptom()}>Add</Button>
                    <Button color="primary" onClick={(e) => this.removeSymptom()}>Remove</Button>
                </div>


                <div style={{display: "flex", alignItems: "baseline", justifyContent: "center", marginTop: "10px"}}>
                    <Input type="text" value={this.state.currentTemperature} name="temperature"
                           onChange={(e) => this.setState({currentTemperature: e.target.value})}
                           placeholder="Temperature"/>
                    <Button color="primary"
                            onClick={(e) => this.postTemperature(this.state.currentTemperature)}>Add</Button>
                </div>
            </div>
        )
    }
}

export default (withRouter(Home));
// export default Login;