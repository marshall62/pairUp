import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";

class SectionRow extends Component {

    render () {
        const stdt = new Date(this.props.section.start_date);
        const chgFn = this.props.onChangeSectionField; // a single handler function in PUAdmin
        const sec = this.props.section;
        const i = this.props.secIndex;
	return <tr>
	         <td>
	           <Form.Control
                     onChange={(e) => chgFn(i,{...sec, number: e.target.value})}
                                 type="text" value={this.props.number}/>
	         </td>
	         <td>
	           <Form.Control
                     onChange={(e) => chgFn(i,{...sec, title:  e.target.value})}
                     type="text" value={this.props.title}/>
	         </td>
                 <td>
                   <Form.Control name="xlsxFile" type="file"
                                 onChange={(e) => chgFn(i,{...sec, file: e.target.files[0]})}
                                />
                 </td>
                 <td>
                   <DatePicker selected={stdt}
                               onChange={(dt) => chgFn(i,{...sec, start_date: new Date(dt)})} />
                 </td>
               </tr>
	    
    }
}

class SectionTable extends Component {

    render() {
        const rows = this.props.sections.map((sec, index) => {
            return <SectionRow key={index} secIndex={index} section={sec}
                               secId={sec.id}
                               title={sec.title} number={sec.number}
                               onChangeSectionField={this.props.onChangeSectionField}
                               onChangeLabTitle={this.props.onChangeTitle}
                               onChangeLabNumber={this.props.onChangeLabNumber}
                     
                     
	                       startDate={sec.start_date}
	           />
        });
        return (
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>meeting time</th>
                  <th>roster file</th>
                  <th>start date</th>
                </tr>
              </thead>
              <tbody>
                {rows}
              </tbody>
            </table>
        )
    }
}

export default SectionTable 
