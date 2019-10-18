import React, { Component } from 'react'

class StudentImage extends Component {

    constructor(props) {
      super(props);
      this.myRef = React.createRef();
    }
  
    // using arrow function so I can refer to this
    handleClick = () => {
      let imgelt = this.myRef.current;
      imgelt.width = imgelt.width === 30 ? 300 : 30;
      imgelt.height = imgelt.height === 30 ? 300 : 30;
  
    }
  
    render () {
      return <img ref={this.myRef} className="studentpic" 
        onClick={this.handleClick} src={this.props.pic_url} 
        width="30" height="30"/>
    }
}

export default StudentImage