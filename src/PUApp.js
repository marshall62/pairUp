import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import AttendanceTable from './AttendanceTable';
import PairUpBanner from './PairUpBanner';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";



class PUApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      students: [],
      sections: [],
      date: new Date(),
      title: 'Sections'
    };
    // this.handleChangeStudentStatus = this.handleChangeStudentStatus.bind(this);
    // this.handleSave = this.handleSave.bind(this);
  }

  getRoster (sec_number) {
    let url = 'http://localhost:5000/rosters' + (sec_number ? "?number="+sec_number : "");
    fetch(url)
      .then(result => result.json())
      .then(result => {
        console.log("fetch returns", result);
        this.setState({
          students: result.students,
          secId: result.section_id,
          title: result.title
        })
      });  
  }

  // Code is invoked after the component is mounted/inserted into the DOM tree.
  componentDidMount() {
    // const url = 'http://localhost:5000/rosters?term=fall&number=4&year=2019';
    this.getRoster();
    const url = 'http://localhost:5000/sections';
    fetch(url)
        .then(result => result.json())
        .then(result => {
          console.log("fetch returns", result);
          this.setState({
            sections: result
          })
        });


  }

  save_attendance(secId, students) {

    const url = 'http://localhost:5000/rosters';
    const selectedDate = this.state.date;
    alert("selected date is"+ selectedDate);
    const old_date = '04/12/2005';
    fetch(url, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secId: secId, date: old_date, students: students })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('received:', data);
    });
  }

  // arrow fn method allows access to the class's this.
  handleChangeDate = date => {
    this.setState({
      date: date
    });
  };

  // When a component below changes the attendance status of a student this handler is called
  // with the index of the student and the status.
  handleChangeStudentStatus = (index, status) => {
    let students = this.state.students;
    let stud = students[index];
    stud.status = status;
    // alert("Student " + index + " status is now " + status);
    this.setState({ students: students });
  }

  handleSave = (e) => {
    console.log('save', this.state.students);
    this.save_attendance(this.state.secId, this.state.students);
  }

  handleSectionChanged = (index) => {
    const ix = index.index;
    const sec = this.state.sections[ix];
    this.getRoster(sec.number);
  }


  render() {
    return (
      <div className="container">
        <PairUpBanner></PairUpBanner>
        <Tabs>
          <Tab eventKey="attendance" title="Attendance">
            <form>
              <div className="form-row">
                <div className="col-4">
                  <DropdownButton id="dropdown-basic-button" title={this.state.title}>
                    {this.state.sections.map((s, index) =>
                      <Dropdown.Item key={index} onSelect={() => this.handleSectionChanged({ index })}> {s.title}</Dropdown.Item>)}
                  </DropdownButton>
                </div>
                <div className="col-4">
                  <DatePicker selected={this.state.date}
                    onChange={this.handleChangeDate} />
                </div>
              </div>
              <AttendanceTable onChangeStatus={this.handleChangeStudentStatus} students={this.state.students} />
              <div className="form-row">
                <div className="col-2">
                  <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                </div>
                <div className="col-3">
                  <button className="btn btn-primary" onClick={this.handleGenerateGroups}>Generate Groups</button>
                </div>
                <div className="col-2">
                  <button className="btn btn-primary" onClick={this.handleGroupsCSV}>Groups CSV</button>
                </div>
              </div>
            </form>
          </Tab>
          <Tab eventKey="groups" title="Groups"></Tab>
        </Tabs>
      </div>
    );
  }
}

export default PUApp;
