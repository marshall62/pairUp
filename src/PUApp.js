import React, { Component } from 'react'
import './App.css';

import PairUpBanner from './PairUpBanner';
import PUAdmin from './PUAdmin';
import PULogin from './PULogin.jsx';
import PUAttendance from './PUAttendance';
import {URLs} from './urls';

class PUApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ontab: 'login',
            year: 2020,
            term: 'fall',
            admin: false,
            user: null
        };
    }

    componentDidMount() {
        URLs.get(URLs.term_year)
        .then(response => response.json())
        .then(json => this.setState({term: json.term, year: json.year}))
        .then(x => URLs.get_with_credentials(URLs.user))
        .then(result => result.json())
        .then(json => {
            if (json.user) {
              this.setState({user: json.user, ontab: 'attendance'});
            }

        });

    }

    handleLogin = (userid) => {
        // when login succeeds, set the user and go to attendance tab
        this.setState({user: userid, ontab: 'attendance'});

    }

    logoutUser = () => {
        URLs.post_with_credentials(URLs.logout, null)
      .then(response => {
          this.setState({user: null, ontab: 'login'});
          return response.json()
      })
    }

    handleNotLoggedIn = () => {
        this.setState({user: null, ontab: 'login'});
    }


    handleToolSelect = (e) => {
        // if not logged in, go to the login page; o/w go to requested tab.
        if (!this.state.user)
            this.setState({ontab: 'login'});
        else {
          this.setState({ontab: e});
          if (e === 'logout')
            this.logoutUser();
        }
    }

    render() {
        const yr = this.state.year;
        const term = this.state.term;
        let selectedTab = this.state.ontab;
        const renderTab = () => {
            if (selectedTab === "admin")   {
              return <PUAdmin onNotLoggedIn={this.handleNotLoggedIn}/>
            }
            else if (selectedTab === "attendance") {
              return <PUAttendance year={yr} term={term} onNotLoggedIn={this.handleNotLoggedIn}/>
            }
            else if (selectedTab === "login") {
              return <PULogin onLogin={this.handleLogin}/>
            }
        }

        return (
            <div className="container">

              <PairUpBanner activeLink={this.state.ontab} onToolSelect={this.handleToolSelect}></PairUpBanner>
              { renderTab() }
            </div>
        );
    }
}

export default PUApp;
