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
            tabKey: 'roster',
            sections: [],
            firstClass: new Date(),
            date: new Date(),
            file: null
            
        }
    }

    saveSectionRoster = () => {
        const url = 'http://localhost:5000/sections/' + this.state.secId;
        const formData = new FormData();
        formData.append('files',this.state.file);
        formData.append('startDate', dateToMdy(this.state.date));
        fetch(url, { // Your POST endpoint
            method: 'POST',
            mode: 'cors',
            // headers: {
            //     'Access-Control-Allow-Origin': '*',
            // // Content-Type may need to be completely **omitted**
            // // or you may need something
            // // "Content-Type": "You will perhaps need to define a content-type here"
            // },
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
        console.log('mounted');
        ModelFetcher.getSections()
        .then(result => {
            const sec1 = result[0];
            // console.log("ModelFetcher gave",result);
            this.setState({sections: result, secId: sec1.id, term: sec1.term, selectedSecIndex: 0})
        });
    }

    handleRosterUpdate = () => {
        console.log('update the roster for section', this.state.secId)
        // PUT the changes to the roster.
        this.saveSectionRoster()
    }

    handleSectionChanged = (index) => {
        const sec = this.state.sections[index.index];
        console.log("Sec selected",sec);
        this.setState({secId: sec.id, selectedSecIndex: index.index});
    }

    handleChangeDate = () => {}

    handleFile = (event) => {
        this.setState({file: event.target.files[0]});
    }

    handleTermSelected = (term) => {
        this.setState({term: term})
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
		{/*
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title={secTitle}>
                        {this.state.sections.map((s, index) =>
                            <Dropdown.Item key={index} onSelect={() => this.handleSectionChanged({ index })}> {s.title}</Dropdown.Item>)}
                        </DropdownButton>
                    </Col>
		 */}
                    <Col>
                        <DatePicker dateFormat="yyyy" selected={this.state.date}
                            onChange={this.handleChangeDate} />
                    </Col>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title={term}>
                            <Dropdown.Item onSelect={() => this.handleTermSelected("spring")}>spring</Dropdown.Item>
                            <Dropdown.Item onSelect={() => this.handleTermSelected("fall")}>fall</Dropdown.Item>
                        </DropdownButton>
                    </Col>

                </Row>
		
		<SectionTable sections={this.state.sections}/>
		{/*
                <Form.Group as={Col} controlId='firstClass'>
                    <Form.Label>First Class</Form.Label>
                    <DatePicker selected={this.state.date}
                        onChange={this.handleChangeDate} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Roster Spreadsheet</Form.Label>
                    <Form.Control name="xlsxFile" type="file" onChange={this.handleFile}/>
                    </Form.Group> */}
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
