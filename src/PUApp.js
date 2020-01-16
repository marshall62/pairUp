import React, { Component } from 'react'
import './App.css';

import PairUpBanner from './PairUpBanner';
import PUAdmin from './PUAdmin';
import PULogin from './PULogin.jsx';
import PUAttendance from './PUAttendance';
import {URLs} from './urls';

/*
There is something bad happening with the cookies.  If I hit the main URL localhost:3000
after having been logged in (so the cookies persist) I'm not taken to the attendance tab.  I
instead go to the login tab.  I then need to click the login button 2X because the first click
does nothing and the second one is the one that sends stuff to the server.
 */

class PUApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tabkey: 'attendance',
            ontab: 'login',
            admin: false,
            user: null
        };
    }

    handleLogin = (userid) => {
        alert("Login succeeded")
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
        const yr = '2020';
        const term = 'spring';
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

              <PairUpBanner onToolSelect={this.handleToolSelect}></PairUpBanner>
              { renderTab() }
              {/*{(this.state.admin) ? <PUAdmin/> : <PUAttendance year={yr} term={term}/>}       */}
            </div>
        );
    }
}

export default PUApp;
