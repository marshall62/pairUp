import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";
import ModelFetcher from './ModelFetcher';
import SectionTable from './SectionTable.jsx';
import {dateToMdy, dateToYYYY} from './dates.js';

class YearSelector extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }


    render () {
        
        return <DropdownButton id="dropdown-basic-button" title={this.props.year}>
                        <Dropdown.Item onSelect={() => this.props.onChange('2019')}>2019</Dropdown.Item>
                        <Dropdown.Item onSelect={() => this.props.onChange('2020')}>2020</Dropdown.Item>
                        <Dropdown.Item onSelect={() => this.props.onChange('2021')}>2021</Dropdown.Item>
                        <Dropdown.Item onSelect={() => this.props.onChange('2022')}>2022</Dropdown.Item>

                    </DropdownButton>
    }
}

class PUAdmin extends Component {

    constructor (props) {
        super(props);
        this.state = {sections: []};
    }

    componentDidMount() {
        ModelFetcher.getSections()
        .then(result => {
            const sec1 = result[0];
            console.log("sec1 is", result[0]);
            this.setState({
                sections: result, 
                term: sec1.term, 
                year: sec1.year
                })
        });
    }



    saveSectionRoster = () => {
        const url = 'http://localhost:5000/sections/' + this.state.secId;
        const formData = new FormData();
        console.log("Saving Sections");
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

    addFileListToFD = (formData) => {
        let files=[];
        for (let i=0; i<this.state.sections.length; i++) {
            const f = this.state.sections[i].file;
            if (f) {
                formData.append('files[]',f,f.name);
                this.state.sections[i].fileIncluded = true;
            }
            
        }
    }

    addSectionsToFD = (formData) => {
        formData.append('sections', JSON.stringify(this.state.sections));
    }

    saveSections = () => {
        const url = 'http://localhost:5000/sections2';
        const formData = new FormData();
        console.log("Saving Sections");
        this.addFileListToFD(formData);
        this.addSectionsToFD(formData);
        formData.append('term', this.state.term);
        formData.append('year', this.state.year);
        console.log("sending sections as", formData.get('sections'));
        fetch(url, { 
            method: 'POST',
            mode: 'cors',
            body: formData 
        }).then(
            // gets back json of section objects written (may have new ids in)
            response => response.json() // if the response is a JSON object
        ).then(
            sections => this.setSections(sections)
        ).catch(
            error => console.log(error) // Handle the error response object
        );

    }    

    handleRosterUpdate = () => {
        console.log('update the roster for section', this.state.secId)
        // PUT the changes to the roster.
        this.saveSections()
    }

    setSections = (sections) => {
        this.setState({sections: sections});
    }

    handleChangeYear = (year) => {
        this.setState({year: year});
        ModelFetcher.getSections(year, this.state.term)
        .then(sectionsJson => this.setSections(sectionsJson))
    }


    handleTermSelected = (term) => {
        this.setState({term: term});
        ModelFetcher.getSections(this.state.year, term)
        .then(sectionsJson => this.setSections(sectionsJson))
    }


    handleChangeSectionField = (index, sec) => {
        let secscpy = this.state.sections.slice();
        secscpy[index] = sec;
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

        const term = this.state.term ? this.state.term : "spring";
        const year = this.state.year || '2020';
        console.log('year is ', year);

        return (<div><p>admin</p>
            <Row>
                <Col>
                    <YearSelector year={year} onChange={this.handleChangeYear}/>
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

      </div>)
    }
}

export default PUAdmin;
