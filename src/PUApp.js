import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';
import AttendanceTable from './AttendanceTable';
import GroupsTable from './GroupsTable';

import PairUpBanner from './PairUpBanner';

import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";


Date.prototype.mdy = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  var v = [
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd,
          this.getFullYear()
         ].join('/');
  return v;
};

class PUApp extends Component {

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

  // get a roster or the default roster if no sec_number given
  // will include attendance info in students for the date.
  // set the state to hold students and info about the section.
  // return promise of fetch.
  getSectionRoster (secId, dt) {
    let url = 'http://localhost:5000/sections' +
     (secId ? "?id="+secId: "") +
     (dt ? "&date="+dt.mdy() : "");
    return fetch(url)
      .then(result => result.json())
      .then(result => {
        const sec = result[0];
        console.log("New roster",sec.roster.students)
        this.setState({
          students: sec.roster.students,
          secId: sec.id,
          title: sec.title
        });
        return sec.id;
      });
        
  }

  // get all the sections and set them in the state.
  // return the promise of fetch
  getSections () {
    const url = 'http://localhost:5000/sections';
    return fetch(url)
        .then(result => result.json())
        .then(result => {
          this.setState({
            sections: result
          })
        });
  }

  // get the groups JSON for the secId and date and set the state
  // to hold them.  Return the promise of fetch
  getGroups (secId, dt) {
    let url = 'http://localhost:5000/groups' + 
      (secId ? "?secId="+secId : "") +
      (dt ? "&date="+dt.mdy() : "")
    return fetch(url)
      .then(result => result.json())
      .then(groups => {
        this.setState({groups: groups})
      });  
  }


  // Code is invoked after the component is mounted/inserted into the DOM tree.
  componentDidMount() {
    this.getSections()
      .then(result => 
        this.getSectionRoster())
      .then(result => 
        this.getGroups(this.state.secId, new Date()));
  }

  save_attendance(secId, students) {

    const url = 'http://localhost:5000/rosters';
    const selectedDate = this.state.date;
    // const old_date = '04/12/2005';
    fetch(url, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ secId: secId, date: selectedDate.mdy(), students: students })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      // console.log('received:', data);
    });
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
    this.setState({ students: students });
  }

  // getting away with mutating state because I'm not relying on it to force
  // a DOM change.  It will be sent to server API which is all that's necessary.
  handleChangeStudentName = (index, name) => {
    console.log("change student name",index, name);
    let students = this.state.students;
    let stud = students[index];
    stud.edited = true; // add an edited field to the student to indicate it was chgd
    let names = name.split(' ');
    stud.preferred_fname = names[0];
    stud.last_name = names[1];
  }

  handleSave = (e) => {
    if (window.confirm("Are you sure you want to save?"))
      this.save_attendance(this.state.secId, this.state.students);
  }

  handleSectionChanged = (index) => {
    const ix = index.index;
    const sec = this.state.sections[ix];
    this.setState({secId: sec.id});
    this.getSectionRoster(sec.id, this.state.date)
      .then(result => this.getGroups(sec.id, this.state.date))
    
  }

  handleGenerateGroups = () => {
    if (window.confirm("Are you sure you want to generate new groups")) {
      const selectedDate = this.state.date.mdy();
      const secId = this.state.secId;
      const url = 'http://localhost:5000/groups';
      fetch(url, {
        method: 'post',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ secId: secId, date: selectedDate})
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
    var url = 'http://localhost:5000/groups?secId='+
      this.state.secId+'&format=csv&date='+this.state.date.mdy();
    window.location.href = url;
  }


  render() {
    return (
      <div className="container">
        <PairUpBanner></PairUpBanner>
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
            <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
          </div>
          <div className="col-3">
            <button className="btn btn-primary" onClick={this.handleGenerateGroups}>Generate Groups</button>
          </div>
          <div className="col-2">
            <button className="btn btn-primary" onClick={this.handleGroupsCSV}>Groups CSV</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PUApp;
