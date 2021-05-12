import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
// import { connect } from 'react-redux';
// import { ActionCreators } from '../../actions/profile';
// import { getStore } from '../../utils';
// import './style.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { Button, Input, InputLabel, MenuItem } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { Animation } from '@devexpress/dx-react-chart';
import Axios from "axios";
import { SERVER_ENDPOINT } from "../constants";
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
      riskStatus: "Medium",
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
        console.log(response);
        
        this.setState({
          symptoms: response.data.symptoms,
          temperatures: response.data.temperature.map(
            (t, index) => {
              return { id: index, value: t };
            }
          )
        }, (e) => console.log(this.state));
    })
    .catch((error) => {
      // handle error
      console.log("fail")
      console.log(error);
    });

    Axios.get(`${SERVER_ENDPOINT}/symptoms`, {headers: headers})
    .then((response) => {
        // handle success
        console.log(response);
        
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

    console.log(this.props.location.state);

  }

  fetchRiskStatus = () => {
    let headers = {'Authorization': `Bearer ${this.token}`};
    Axios.get(`${SERVER_ENDPOINT}/users/risk_status`, {headers: headers})
    .then((response) => {
        // handle success
        console.log("success")
        console.log(response);
        
        this.setState({
          riskStatus: response.data,
        }, () => console.log(this.state));

        if (response.data == "High") {
          alert("HIGH RISK STATUS!");
        }
    })
    .catch((error) => {
      // handle error
      console.log("fail")
      console.log(error);
    });
  }

  addSymptom = () => {
    if (this.state.symptoms.includes(this.state.selectedSymptom)) return;

    let headers = {'Authorization': `Bearer ${this.token}`};

    let newSymptoms = [...this.state.symptoms];
    newSymptoms.push(this.state.selectedSymptom);
    this.setState({symptoms: newSymptoms}, () => {
      Axios.patch(`${SERVER_ENDPOINT}/symptoms`,
        {"symptoms": this.state.symptoms},
        {headers: headers}
      )
      .then((response) => {
          // handle success
          console.log("success")
          console.log(response);
          this.fetchRiskStatus();
      })
      .catch((error) => {
        // handle error
        console.log("fail")
        console.log(error);
      })
    });


  }

  removeSymptom = () => {
    if (this.state.symptoms.includes(this.state.selectedSymptom) == false) return;

    let headers = {'Authorization': `Bearer ${this.token}`};

    let newSymptoms = this.state.symptoms.filter((symptom, index) => symptom != this.state.selectedSymptom);
    this.setState({symptoms: newSymptoms}, () => {
      Axios.patch(`${SERVER_ENDPOINT}/symptoms`,
        {"symptoms": this.state.symptoms},
        {headers: headers}
      )
      .then((response) => {
          // handle success
          console.log("success")
          console.log(response);
          this.fetchRiskStatus();
      })
      .catch((error) => {
        // handle error
        console.log("fail")
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
          console.log(response);
          this.setState({temperatures: response.data.map(
            (t, index) => {
              return { id: index, value: t };
            }
          )})
          this.fetchRiskStatus();
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
  }

  render() {
    return (
        <div>
          <div>
            <Paper style={{height: "50%", width: "65%", margin: "0 auto", paddingRight: "20px"}}>
              <Chart
                data={this.state.temperatures}              
              >
                <ArgumentAxis />
                <ValueAxis max={30} />

                <BarSeries
                  valueField="value"
                  argumentField="id"
                  barWidth={1.1}
                  color="red"
                />
                <Title text="Temperature" />
                <Animation />
              </Chart>
            </Paper>
          </div>

         

          <div>
            <div style={{width: "50%", marginLeft: "40%"}}>
              <div>
                Risk Status: {this.state.riskStatus}
              </div>
              <span>Symptoms:</span>
              {
                this.state.symptoms.map(
                  (val, index) => 
                    <span style={{display: 'block'}}>{val}</span>
                  )
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
                <MenuItem disabled style={{color: "orange", fontWeight: "900"}} value={10}>Less Common Symptoms</MenuItem>
                {
                  this.state.commonSymptoms.map(
                    (val, index) =>                   
                      <MenuItem value={val}>{val}</MenuItem>
                  )
                }

                <MenuItem disabled style={{color: "#ff6666", fontWeight: "900"}} value={10}>Common Symptoms</MenuItem>
                {
                  this.state.lessCommonSymptoms.map(
                    (val, index) =>                   
                      <MenuItem value={val}>{val}</MenuItem>
                  )
                }

                <MenuItem disabled style={{color: "#ff0000", fontWeight: "900"}} value={10}>Serious Symptoms</MenuItem>
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
            <Input type="text" value={this.state.currentTemperature} name="temperature" onChange={(e) => this.setState({currentTemperature: e.target.value})} placeholder="Temperature" />
            <Button color="primary" onClick={(e) => this.postTemperature(this.state.currentTemperature)}>Add</Button>
          </div>
        </div>
    )
  }
}

export default (withRouter(Home));
// export default Login;