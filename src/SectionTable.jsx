import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";

class SectionRow extends Component {

  render() {
    const stdt = new Date(this.props.section.start_date);
    const chgFn = this.props.onChangeSectionField; // a single handler function in PUAdmin
    const sec = this.props.section;
    const i = this.props.secIndex;
    return <tr className="d-flex">
      {/* Lab Number */}
      <td className="col-1">
        <Form.Control
          onChange={(e) => chgFn(i, { ...sec, number: e.target.value })}
          type="text" value={this.props.number} />
      </td>
      {/* Title */}
      <td className="col-3">
        <Form.Control
          onChange={(e) => chgFn(i, { ...sec, short_title: e.target.value })}
          type="text" value={this.props.title} />
      </td>
      {/* CSV (roster) file */}
      <td className="col-3">
        <Form.Control name="xlsxFile" type="file"
          onChange={(e) => chgFn(i, { ...sec, file: e.target.files[0] })}
        />
      </td>
      {/* Start Date  */}
      <td className="col-3">
        <DatePicker selected={stdt}
          onChange={(dt) => chgFn(i, { ...sec, start_date: new Date(dt) })} />
      </td>
      <td className="col-2"><Button onClick={() => this.props.onCSVDownload(sec.id)} >Download CSV</Button></td>
    </tr>

  }
}

class SectionTable extends Component {

  render() {
    const rows = this.props.sections.map((sec, index) => {
      return <SectionRow key={index} secIndex={index} section={sec}
        secId={sec.id}
        title={sec.short_title} number={sec.number}
        onChangeSectionField={this.props.onChangeSectionField}
        onCSVDownload={this.props.onCSVDownload}
        startDate={sec.start_date}
      />
    });
    return (
      <div className="container-fluid">
      <table className="table table-striped table-bordered">
        <thead>
          <tr className="d-flex">
            <th className="col-1">#</th>
            <th className="col-3">meeting time</th>
            <th className="col-3">roster file</th>
            <th className="col-3">start date</th>
            <th className="col-2">Attendance history</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      </div>
    )
  }
}

export default SectionTable 
