import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";
import ModelFetcher from './ModelFetcher';
import SectionTable from './SectionTable.jsx';
import {dateToMdy} from './dates.js';

class PUAdmin extends Component {

    constructor (props) {
        super(props);
        this.state = {
            sections: [],
            boo: true
        }
    }

    saveSectionRoster = () => {
        const url = 'http://localhost:5000/sections/' + this.state.secId;
        const formData = new FormData();
        formData.append('files',this.state.file);
        formData.append('startDate', dateToMdy(this.state.date));
        fetch(url, { 
            method: 'POST',
            mode: 'cors',
            body: formData // This is your file object
        }).then(
            response => response.json() // if the response is a JSON object
        ).then(
            success => console.log(success) // Handle the success response object
        ).catch(
            error => console.log(error) // Handle the error response object
        );

    }


    componentDidMount() {
        ModelFetcher.getSections()
        .then(result => {
            const sec1 = result[0];
            this.setState({sections: result, secId: sec1.id, term: sec1.term, selectedSecIndex: 0})
        });
    }

    handleRosterUpdate = () => {
        console.log('update the roster for section', this.state.secId)
        // PUT the changes to the roster.
        this.saveSectionRoster()
    }

    handleChangeYear = () => {}


    handleTermSelected = (term) => {
        this.setState({term: term});
    }


    handleChangeSectionField = (index, {secIndex, number, title, start_date, file}) => {
        let secscpy = this.state.sections.slice();
        let chgsec = {...secscpy[secIndex], number: number, title: title,
                      start_date: start_date, file: file};
        console.log("Change section",index," state to",chgsec);
        secscpy[index] = chgsec;
        const newst = {...this.state, sections: secscpy};
        this.setState(newst);
    }

    handleAddSection = () => {
        let secscpy = this.state.sections.slice();
        let newSec = {start_date: new Date()};
        secscpy.push(newSec);
        this.setState({ sections: secscpy});
    }


    render () {
        const secTitle =  this.state.secId ? 
            this.state.sections[this.state.selectedSecIndex].title : 
            "select";
        const term = this.state.term ? this.state.term : "spring";

        return (<div><p>admin</p><Tabs activeKey={this.state.tabKey} 
        defaultActiveKey="roster"
        onSelect={this.handleTabSelect}>
        <Tab eventKey="roster" title="Roster Setup">
          <Form>
              <Row>
                <Col>
                        <DatePicker dateFormat="yyyy" selected={this.state.date}
                            onChange={this.handleChangeYear} />
                    </Col>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title={term}>
                            <Dropdown.Item onSelect={() => this.handleTermSelected("spring")}>spring</Dropdown.Item>
                            <Dropdown.Item onSelect={() => this.handleTermSelected("fall")}>fall</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                </Row>

             <button onClick={this.handleAddSection}>+</button>
	      <SectionTable sections={this.state.sections}
                            onChangeSectionField={this.handleChangeSectionField}
                            />
                <Row>
                    <Col><Button onClick={this.handleRosterUpdate}>Update Roster</Button></Col>
                    
                    <Col><Button>Get CSV Attendance</Button></Col>
                </Row>
               
            </Form>
          
        </Tab>
        <Tab eventKey="sections" title="Sections Setup">
        </Tab>
                  
      </Tabs>
      </div>)
    }
}

export default PUAdmin;
