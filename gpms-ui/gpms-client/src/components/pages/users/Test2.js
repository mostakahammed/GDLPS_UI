import React, { Component } from 'react'

export default class Test2 extends Component {
  constructor(props){
    super(props);
 
    
  }
  render() {
    var Barcode = require('react-barcode');
    return (
      <div className='row' style={{fontSize:'12px'}}>
        <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      <div className="col-md-3 mx-2">
        <Barcode value="sdfsdfsdf"/>
      </div>
      </div>
      
      
      
    )
  }
}
