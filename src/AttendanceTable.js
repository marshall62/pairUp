import React, { Component } from 'react';
import StudentImage from './StudentImage';
import Form from 'react-bootstrap/Form';

function AttendanceRadio(props) {
  return <input name={props.name}
    onChange={() => props.onChangeStatus(props.studIndex, props.status)}
    type="radio"
    checked={props.checked} />
}

class StudentNameField extends Component {

  constructor (props) {
    super(props);
    this.state = {readonly: true}
  }

  handleNameChange = (e) => {
    console.log("name change",e.target.value);
    const name = e.target.value;
    this.props.onChangeStudentName(this.props.index, name);
  }

  handleNameDblClick = (e) => {
    console.log("dblclicked");
    this.setState({readonly: false})  
  }

  render () {
    const name = "name" + this.props.index;
    return <Form.Control plaintext readOnly={this.state.readonly} 
      name={name}
      value={this.props.name} onDoubleClick={this.handleNameDblClick}
      onChange={this.handleNameChange} />
    // return <input type='text' readOnly={this.state.readonly} 
    //           name={name} defaultValue={this.props.name}
    //           onDoubleClick={this.handleNameDblClick}
    //           onChange={this.handleNameChange} />
  }
}


class StudentAttendanceRow extends Component {

  render() {
    const name = this.props.first_name + ' ' + this.props.last_name
    const present = this.props.status === 'P'
    const absent = this.props.status === 'A'
    const attOther = this.props.status === 'AO'
    const studIndex = this.props.studIndex;
    const radName = 'stud-' + studIndex;
    const indexLabel = studIndex + 1;
    return <tr >
      <td>{indexLabel}</td>
      <td><StudentImage pic_url={this.props.pic_url}/></td>
      <td><StudentNameField name={name} index={studIndex} 
        onChangeStudentName={this.props.onChangeStudentName}/> 
      </td>
      <td><AttendanceRadio name={radName} status='P' studIndex={studIndex} onChangeStatus={this.props.onChangeStatus} checked={present} /></td>
      <td><AttendanceRadio name={radName} status='A' studIndex={studIndex} onChangeStatus={this.props.onChangeStatus} checked={absent} /></td>
      <td><AttendanceRadio name={radName} status='AO' studIndex={studIndex} onChangeStatus={this.props.onChangeStatus} checked={attOther} /></td>
    </tr>
  }
}


class AttendanceTable extends Component {


  render() {
    const rows = this.props.students.map((s, index) => {
      return <StudentAttendanceRow key={index} studIndex={index} 
        first_name={s.preferred_fname} last_name={s.last_name}
        status={s.status} pic_url={s.pic_url} onChangeStatus={this.props.onChangeStatus}
        onChangeStudentName={this.props.onChangeStudentName} />
    });
    return (
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Name</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Attended Other</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
}

export default AttendanceTable 
