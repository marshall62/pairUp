import React from 'react';
import pearIcon from './pear.png';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'



function PairUpBanner (props) {
    return( 
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">
      <img
        src={pearIcon}
        width="80"
        height="80"
        className="d-inline-block align-top"
        alt="React Bootstrap logo"
      />
      <span className='pair-header'>{' PairUp'}</span>
    </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#link">Link</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

function PairUpBanner1 (props) {
    return(
        <div>
            <div style={{height: '4px'}}></div>
            <div className="row">
                <div className="col-sm-2">&nbsp;</div>
                <div className="col-sm-1">
                    <img align="bottom"
                        src={pearIcon}
                        width="70" height="70" />
                </div>
                <div align="left" className="col-sm-6">
                    <h2 className="pair-header">PairUp</h2>
                </div>
                <div className="row">
                    <div className="col-sm-2"><a className='pair-tab-text' href="{{ url_for('roster_admin') }}">Admin</a></div>
                    <div className="col-sm-2"><a className='pair-tab-text' href="{{ url_for('rosters_page') }}">Attendance</a></div>
                    <div className="col-sm-2"><a className='pair-tab-text' href="{{ url_for('login') }}">Login</a></div>
                </div>
            </div>
        </div> 
    );     
}

export default PairUpBanner