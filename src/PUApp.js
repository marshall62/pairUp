import React, { Component } from 'react'
import './App.css';

import PairUpBanner from './PairUpBanner';
import PUAdmin from './PUAdmin';
import PUAttendance from './PUAttendance';


class PUApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabkey: 'attendance',
      admin: false
    };
  }

  handleToolSelect = (e) => {
    console.log("selected", e);
    this.setState({admin: (e === 'admin')})
  }

  render() {
    return (
      <div className="container">
        <PairUpBanner onToolSelect={this.handleToolSelect}></PairUpBanner>
        {(this.state.admin) ? <PUAdmin /> : <PUAttendance />}       
      </div>
    );
  }
}

export default PUApp;
