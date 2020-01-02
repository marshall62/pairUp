import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ModelFetcher from './ModelFetcher';
import SectionTable from './SectionTable.jsx';

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


    addFilesAndSectionsToFormData = (formData) => {
        let secs = [];
        for (let i=0; i<this.state.sections.length; i++) {
            let sec = {...this.state.sections[i]}; // clone because we mutate with fileIncluded flag
            sec.roster = null;  // large, don't want to send back.
            secs.push(sec);
            const f = sec.file;
            if (f) {
                formData.append('files[]', f, f.name);
                sec.fileIncluded = true;
            }          
        }
        formData.append('sections', JSON.stringify(secs));
    }


    saveSections = () => {
        const url = 'http://localhost:5000/sections';
        const formData = new FormData();
        console.log("Saving Sections");
        this.addFilesAndSectionsToFormData(formData);
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

    handleSave = () => {
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
        let newSec = {number:'', short_title:'', start_date: new Date()};
        secscpy.push(newSec);
        this.setState({ sections: secscpy});
    }

    handleCSVDownload = (secId) => {
        // Call API to get CSV file for this sec ID.
        console.log("Get CSV for section", secId);
        var url = 'http://localhost:5000/attendance-csv?secId=' + secId;
        window.location.href = url;
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
                            onCSVDownload={this.handleCSVDownload}
                            onChangeSectionField={this.handleChangeSectionField}
                            />
            <Row>
                <Col><Button onClick={this.handleSave}>Save Changes</Button></Col>
            </Row>

      </div>)
    }
}

export default PUAdmin;
