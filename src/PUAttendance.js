import React, { Component } from 'react'
import './App.css';
import ModelFetcher from './ModelFetcher';
import AttendanceTable from './AttendanceTable';
import GroupsTable from './GroupsTable';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import DatePicker from "react-datepicker";
import {dateToMdy} from './dates.js'; 
import "react-datepicker/dist/react-datepicker.css";
import {URLs} from './urls';

class PUAttendance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabkey: 'attendance',
      students: [],
      groups: [],
      sections: [],
      date: new Date(),
      title: 'Sections'
    };
    // this.handleChangeStudentStatus = this.handleChangeStudentStatus.bind(this);
    // this.handleSave = this.handleSave.bind(this);
  }


  // get the groups JSON for the secId and date and set the state
  // to hold them.  Return the promise of fetch
  getGroups (secId, dt) {
    let url = URLs.groups2(secId, dt);
    return URLs.get_with_credentials(url)
      .then(result => result.json())
      .then(groups => {
        this.setState({groups: groups})
      });  
  }


  // get a roster or the default roster if no sec_number given
  // will include attendance info in students for the date.
  // set the state to hold students and info about the section.
  // return promise of fetch.
  getSectionRoster (secId, dt) {
    let url = URLs.sections2(secId, dt);
    return URLs.get_with_credentials(url)
      .then(result => result.json())
      .then(result => {
        const sec = result[0];
        console.log("New roster",sec.roster.students)
        this.setState({
          students: sec.roster.students,
          secId: sec.id,
          title: sec.title
        });
        console.log('state',this.state);
        return sec.id;
      });
        
  }

  componentDidMount() {
    ModelFetcher.getSections(this.props.year, this.props.term)
      .then(result => {
        const sec = result[0];
        if (sec) {

        }
        else return null;
        const students = sec.roster ? sec.roster.students : [];
        this.setState({
            sections: result,
            students: students,
            secId: sec.id,
            title: sec.title
          });
        return result}
        )
      .then(result => {
          if (result)
            this.getGroups(this.state.secId, new Date()) })
      .catch(err => {
        this.props.onNotLoggedIn();
      })
  }

  save_attendance = (secId, students) => {
    const url = URLs.rosters;
    const selectedDate = this.state.date;
    fetch(url, {
      method: 'post',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secId: secId, date: dateToMdy(selectedDate), students: students })
    })
    .then(response => response.json())
    .then(data => this.setState({dirty: false}));
  }



  // arrow fn method allows access to the class's this.
  handleChangeDate = date => {
    this.setState({
      date: new Date(date)
    });
    this.getSectionRoster(this.state.secId, date)
      .then(result => this.getGroups(this.state.secId, date))
    
  };

  // When a component below changes the attendance status of a student this handler is called
  // with the index of the student and the status.
  handleChangeStudentStatus = (index, status) => {
    let students = this.state.students;
    let stud = students[index];
    stud.status = status;
    // alert("Student " + index + " status is now " + status);
    this.setState({ students: students, dirty: true});
  }

  // An edit occurred on a student name in the attendance table.  
  // Need to update the state's student list with a new student object. 
  handleChangeStudentName = (index, name) => {
    let names, fname, lname;
    if (name.indexOf(' ') != -1) {
      names = name.split(' ');
      fname = names[0];
      lname = names[1];
    }
    else {
       names = name;
       fname = '';
       lname = name;
    }
    let students = this.state.students;
    let students2 = students.slice(); // shallow copy of students
    let chgstud = {...students2[index], edited: true, 
      preferred_fname: fname, last_name: lname};
    students2[index] = chgstud;
    const newst = {...this.state};
    newst.dirty = true; // turns on the save button
    newst.students = students2;
    this.setState(newst)
  }


  handleSave = (e) => {
    if (window.confirm("Are you sure you want to save?"))
    {
      this.save_attendance(this.state.secId, this.state.students);
    }
  }

  handleSectionChanged = (index) => {
    const ix = index.index;
    const sec = this.state.sections[ix];
    this.setState({secId: sec.id});
    this.getSectionRoster(sec.id, this.state.date)
      .then(result => this.getGroups(sec.id, this.state.date))
    
  }

  handleGenerateGroups = (basedOnAttendance) => {
    if (window.confirm("Are you sure you want to generate new groups")) {
      const selectedDate = dateToMdy(this.state.date);
      const secId = this.state.secId;
      const url = URLs.groups;
      fetch(url, {
        method: 'post',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secId: secId, date: selectedDate, basedOnAttendance:basedOnAttendance})
      }).then(response => 
        response.json()
      ).then(data => {
        this.setState({groups: data, tabKey: 'groups'});
      });
    }
  }

  handleTabSelect = (key) => {
    this.setState({tabKey: key})
  }

  handleGroupsCSV = () => {
    var url = URLs.groups2(this.state.secId, this.state.date, 'csv')
    window.location.href = url;
  }


  render() {
    return (
      <div className="container">
        <Tabs activeKey={this.state.tabKey} 
          defaultActiveKey="attendance"
          onSelect={this.handleTabSelect}>
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
              <AttendanceTable 
                onChangeStatus={this.handleChangeStudentStatus} 
                onChangeStudentName={this.handleChangeStudentName}
                students={this.state.students} />
              
            </form>
            
          </Tab>
          <Tab eventKey="groups" title="Groups">
            <GroupsTable groups={this.state.groups}/>
          </Tab>
                    
        </Tabs>
        <div className="form-row">
          <div className="col-2">
            {this.state.tabKey !== 'groups' && this.state.dirty ?
            <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                : <span/>}
          </div>
          <div className="col-4">
                  <DropdownButton id="dropdown-basic-button" title="Group Generation">
                    <Dropdown.Item onSelect={() => this.handleGenerateGroups(true)}>Based on Attendance</Dropdown.Item>
                    <Dropdown.Item onSelect={() => this.handleGenerateGroups(false)}>Prior to Attendance</Dropdown.Item>
                    <Dropdown.Item onSelect={this.handleGroupsCSV}>CSV File</Dropdown.Item>   
                  </DropdownButton>
                </div>
        </div>
      </div>
    );
  }
}

export default PUAttendance;
