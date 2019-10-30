import React, { Component } from 'react'
import StudentImage from './StudentImage';

function GroupMember (props) {
    return <React.Fragment>
       <td><StudentImage pic_url={props.student.pic_url}/></td>
       <td>{props.student.preferred_fname} {props.student.last_name}</td>
    </React.Fragment>
}



function GroupRow (props) {
    const row = 
        props.group.members.map((stud, index) => 
            <GroupMember key={index} student={stud}/>);

    return <tr><td>{props.rowNum + 1}</td>{row}</tr>
}

class GroupsTable extends Component {

    render () {
        // console.log("rendering group table",this.props.groups);
        const rows = this.props.groups.map((g, index) => 
            <GroupRow key={index} rowNum={index} group={g} />               
          );
        // console.log("GroupTable",this.props.groups);
        // const rows = <tr><td>test test</td></tr>
        return <table className="table table-striped table-bordered"><tbody>{rows}</tbody></table>
    }
}

export default GroupsTable