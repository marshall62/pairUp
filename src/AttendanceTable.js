import React, { Component } from 'react';
import StudentImage from './StudentImage';


function AttendanceRadio(props) {
  return <input name={props.name}
    onChange={() => props.onChangeStatus(props.studIndex, props.status)}
    type="radio"
    checked={props.checked} />
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
      <td>{name}</td>
      <td><AttendanceRadio name={radName} status='P' studIndex={studIndex} onChangeStatus={this.props.onChangeStatus} checked={present} /></td>
      <td><AttendanceRadio name={radName} status='A' studIndex={studIndex} onChangeStatus={this.props.onChangeStatus} checked={absent} /></td>
      <td><AttendanceRadio name={radName} status='AO' studIndex={studIndex} onChangeStatus={this.props.onChangeStatus} checked={attOther} /></td>
    </tr>
  }
}


class AttendanceTable extends Component {


  render() {
    const rows = this.props.students.map((s, index) => {
      return <StudentAttendanceRow key={index} studIndex={index} first_name={s.preferred_fname} last_name={s.last_name}
        status={s.status} pic_url={s.pic_url} onChangeStatus={this.props.onChangeStatus} />
    });
    return (
      <table className="table table-striped table-bordered">
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