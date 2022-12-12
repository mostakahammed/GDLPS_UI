import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReportHeader from "../../mics/ReportHeader";

class PreRequisitieRpt extends Component {
    constructor(props) {
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var curTime = today.getFullYear() + "-" + month + "-" + date;
        super(props);
        this.state = {
            curTime: curTime
        }
    }
    render() {
     
        const { data, model, qty } = this.props;
        const { curTime } = this.state;

        return (
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-sm-12">
                    <div >
                        <div className="mb-30" style={{ marginBottom: "0px", marginLeft: '36px' }}>
                            <div className="table-wrapper table-responsive " style={{ paddingTop: '50px', paddingBottom: '25px' }}>
                                <ReportHeader rptName={'Pre Requisition Report'} />
                            </div>
                            <div className="table-wrapper table-responsive p-2">
                                <table style={{ width: "96%", fontSize: 'small', color: 'black' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '2%' }} ><b>Model:</b> </td><td style={{ width: '42%' }}>{model}</td>
                                            <td style={{ width: '1%' }}><b>Quantity:</b> </td><td style={{ width: '42%' }}>{qty}</td>
                                            <td style={{ width: '1%' }}><b>Date: </b></td><td style={{ width: '15%' }}>{curTime}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            <div className="table-wrapper table-responsive" style={{ textAlign: 'center' }}>
                                <table style={{ width: "96%", borderCollapse: "collapse", textAlign: 'center', borderColor: 'black',border:'1px' }}>
                                    <thead className="block-example border border-dark">
                                        <tr style={{ fontSize: 'small' }} >
                                            <th style={{ width: '30%' ,color:'black'}} className="block-example border border-dark">
                                                Item Name
                                            </th>
                                            <th style={{ width: '10%' ,color:'black'}} className="block-example border border-dark">
                                                Required Quantity
                                            </th>
                                            <th style={{ width: '10%',color:'black' }} className="block-example border border-dark">
                                                Current Quantity
                                            </th>
                                            <th style={{ width: '10%',color:'black' }} className="block-example border border-dark">
                                                Extra Needed
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="block-example border border-dark" style={{ textAlign: 'Center', paddingTop: '0px !important',fontSize:'small'}}>
                                        {data.map((item, i) => {
                                            return (
                                                <tr key={`item-${i}`} className="block-example border border-dark">
                                                    <td  className="block-example border border-dark" style={{color:'black',textAlign:'left',paddingLeft:'3px'}}>
                                                        {item.label}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'right',paddingRight:'3px'}}>
                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                        {item.requestQty}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'right',paddingRight:'3px'}}>
                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                        {item.currentQty}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'right',paddingRight:'3px'}} >
                                                        {item.extraNeeded}

                                                    </td>
                                                    {/* <td>

                                            </td>  */}
                                                </tr>
                                            );
                                        })
                                        }
                                    </tbody>
                                </table>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default (PreRequisitieRpt);
