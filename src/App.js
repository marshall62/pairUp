import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {

  constructor (props)  {
    super(props);
    this.state = {id: 1, fname: 'David', lname: 'Marshall'};
  }


  handleGet = (e) => {
    let host = process.env.REACT_APP_BACKEND_URI;
    console.log("getting with host:" + host);
    // am failing to use CORS to do GET from API on different port so I have to use the proxy inside
    // react server to get it working.
    // host = '/api';
    let url = host + '/test-get?id=' + this.state.id;
    return fetch(url, {
      method: 'get',
      mode: 'cors',
      credentials: 'include'
    }).then(x => x.json())
    .then(json => console.log("JSON in response to GET is " , json));
  }

  handlePost = (e) => {
    let host = process.env.REACT_APP_BACKEND_URI;
    // host = '/api';
    let url = host + '/test-insert';
    let formData = new FormData();
    formData.append('fname',this.state.fname);
    formData.append('lname',this.state.lname);
    return fetch(url, {
      method: 'post',
      mode: 'cors',
      credentials: 'include',
      body: formData
    }).then(result => result.json())
    .then(json => console.log("Got back json",json));

  }

  handleFname = (x) => {
    this.setState({fname: x.target.value});
  }

  handleLname = (x) => {
    this.setState({lname: x.target.value});
  }

  handleId = (x) => {
    this.setState({id: x.target.value});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <label htmlFor="id">ID</label><input id="id" onChange={this.handleId} name="id" type="text"></input>
        <label htmlFor="fname">Fname</label><input id="fname" onChange={this.handleFname} name="fname" type="text"></input>
        <label htmlFor="lname">Lname</label><input id="lname" onChange={this.handleLname} name="lname" type="text"></input>
        <button type="button" onClick={this.handleGet}>Get</button>
        <button type="button" onClick={this.handlePost}>Post</button>
      </div>
    );
  }
}
export default App;
