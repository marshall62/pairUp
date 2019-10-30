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

class PUAdmin extends Component {

    constructor (props) {
        super(props);
        this.state = {
            tabKey: 'roster',
            sections: [],
            firstClass: new Date(),
            date: new Date()
        }
    }


    componentDidMount() {
        console.log('mounted');
        ModelFetcher.getSections()
        .then(result => {
            console.log("ModelFetcher gave",result);
            this.setState({sections: result})
        });
    }

    handleSectionChanged = (index) => {}

    handleChangeDate = () => {}

    handleFile = () => {}

    render () {
        const secTitle = this.state.sections.length > 0 ? this.state.sections[0].title : "";
        return <div><p>admin</p><Tabs activeKey={this.state.tabKey} 
        defaultActiveKey="roster"
        onSelect={this.handleTabSelect}>
        <Tab eventKey="roster" title="Roster Setup">
            <Form>
                <Row>
                
                    <Col>
                        <DatePicker dateFormat="yyyy" selected={this.state.date}
                            onChange={this.handleChangeDate} />
                    </Col>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title={'spring'}>
                            <Dropdown.Item >spring</Dropdown.Item>
                            <Dropdown.Item >fall</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                    <Col>
                        <DropdownButton id="dropdown-basic-button" title={secTitle}>
                        {this.state.sections.map((s, index) =>
                            <Dropdown.Item key={index} onSelect={() => this.handleSectionChanged({ index })}> {s.title}</Dropdown.Item>)}
                        </DropdownButton>
                    </Col>
                </Row>
                <Form.Group as={Col} controlId='firstClass'>
                    <Form.Label>First Class</Form.Label>
                    <DatePicker selected={this.state.date}
                        onChange={this.handleChangeDate} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Roster Spreadsheet</Form.Label>
                    <Form.Control name="xlsxFile" type="file" onChange={this.handleFile}/>
                </Form.Group>
                <Row>
                    <Col><Button>Update Roster</Button></Col>
                    
                    <Col><Button>Get CSV Attendance</Button></Col>
                </Row>
               
            </Form>
          
        </Tab>
        <Tab eventKey="sections" title="Sections Setup">
        </Tab>
                  
      </Tabs>
      </div>
    }
}

export default PUAdmin;