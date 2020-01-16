import React, { Component } from 'react'
import {URLs} from "./urls";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';


class PULogin extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }



  handleClick = () => {
    let fd = new FormData();
    fd.append("email", this.state.email);
    fd.append("password", this.state.password);

    URLs.post_with_credentials(URLs.login, fd)
    .then(response => response.json())
    .then(json => {
      alert("Login returned" + json);
      // message will be present if login is failure
      if (json.message)
        this.setState({message: json.message});
      else {
        // this.setState({message: ''});
        // when login succeeds (no message), tell PUApp so it can go somewhere useful
        this.props.onLogin(this.state.email);
      }

    })

  }

  render () {
    return <form>
      <label htmlFor="email">Email</label>
      <Form.Control id="email"
          onChange={(e) => this.setState({email: e.target.value })}
          type="text"/>
      <label htmlFor="password">Password</label>
      <Form.Control id="password"
          onChange={(e) => this.setState({password: e.target.value })}
          type="password"/>
      <br/>
      <Button onClick={this.handleClick} type="submit">Submit</Button>
      <p>{this.state.message}</p>
    </form>
  }

}

export default PULogin;