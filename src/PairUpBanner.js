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
                    <Nav.Link onClick={() => props.onToolSelect('admin')} href="#admin">Admin</Nav.Link>
                    <Nav.Link onClick={() => props.onToolSelect('attendance')} href="#attendance">Attendance</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default PairUpBanner