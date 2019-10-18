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
  console.log("date mdy",v);
  return v;
};

class PUApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
        console.log("fetch returns", result);
        const sec = result[0];
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
          console.log("fetch returns", result);
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
        console.log("fetch returns", groups);
        this.setState({groups: groups})
      });  
  }

  // uneeded.  For when I was worried about mutating state
  setGroups (groups) {
    console.log("setting state with groups",groups);
    let stcpy = {...this.state}
    console.log("state copy",stcpy);
    stcpy.groups = groups;
    console.log("state copy with groups",stcpy);
    this.setState(stcpy);
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
    console.log("date set to" + date);
    this.setState({
      date: new Date(date)
    });
    this.getSectionRoster(this.state.secId, this.state.date)
      .then(result => this.getGroups(this.state.secId, this.state.date))
    
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
    alert("Saving");
    this.save_attendance(this.state.secId, this.state.students);
  }

  handleSectionChanged = (index) => {
    const ix = index.index;
    const sec = this.state.sections[ix];
    this.getSectionRoster(sec.number, this.state.date);
  }

  handleGenerateGroups = () => {
    const selectedDate = this.state.date.mdy();
    const secId = this.state.secId;
    const url = 'http://localhost:5000/groups';
    console.log("in generate groups");
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
       var groups = { ...this.state.groups};
       groups = data;
       this.setState({groups});
        console.log("state",this.state);

        // this.setState({groups: [{members: [{preferred_fname:'a', last_name:'A'}]}]});
        console.log(" change to state",this.state);
    });
  }

  handleGroupsCSV = () => {
    console.log("Groups CSV");
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
              <AttendanceTable 
                onChangeStatus={this.handleChangeStudentStatus} 
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
