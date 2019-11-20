import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";

class SectionRow extends Component {

    render () {
        const stdt = new Date(this.props.startDate);
        console.log("startDate",stdt);
	return <tr>
	         <td>
	           <Form.Control type="text" value={this.props.number}/>
	         </td>
	         <td>
	           <Form.Control type="text" value={this.props.title}/>
	         </td>
                 <td>
                   <Form.Control name="xlsxFile" type="file" onChange={this.handleFile}/>
                 </td>
                 <td>
                   <DatePicker selected={stdt}
                               onChange={this.props.handleChangeDate} />
                 </td>
               </tr>
	    
    }
}

class SectionTable extends Component {

    render() {
        const rows = this.props.sections.map((sec, index) => {
            return <SectionRow key={index} secIndex={index} 
	              title={sec.title} number={sec.number}
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
