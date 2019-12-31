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
            admin: false,
        };
    }


    handleToolSelect = (e) => {
        this.setState({admin: (e === 'admin')})
    }

    render() {
        const yr = '2020';
        const term = 'spring';
        return (
            <div className="container">
              <PairUpBanner onToolSelect={this.handleToolSelect}></PairUpBanner>
              {(this.state.admin) ? <PUAdmin/> : <PUAttendance year={yr} term={term}/>}       
            </div>
        );
    }
}

export default PUApp;
