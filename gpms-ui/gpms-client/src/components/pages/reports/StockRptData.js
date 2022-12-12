import React, { Component } from "react";
import { Helmet } from "react-helmet";
import ReportHeader from "../../mics/ReportHeader";

class StockRptData extends Component {
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
    componentDidMount(){
        const { data} = this.props;
    }
    render() {
     
        const { data,fromDate,toDate} = this.props;
        const { curTime } = this.state;

        return (
           
            <div className="row">
                <div className="col-xl-12 col-lg-12 col-sm-12">
                    <div >
                        <div className="mb-30" style={{ marginBottom: "0px", marginLeft: '36px' }}>
                            <div className="table-wrapper table-responsive " style={{ paddingTop: '50px', paddingBottom: '25px' }}>
                                <ReportHeader rptName={'Stock Report'} />
                            </div>
                            <div className="table-wrapper table-responsive p-2">
                                <table style={{ width: "96%", fontSize: 'small', color: 'black' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ width: '10%' }} ><b>From Date:</b> </td><td style={{ width: '32%' }}>{fromDate}</td>
                                            <td style={{ width: '8%' }}><b>To Date:</b> </td><td style={{ width: '37%' }}>{toDate}</td>
                                            <td style={{ width: '2%' }}><b>Date: </b></td><td style={{ width: '11%' }}>{curTime}</td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            <div className="table-wrapper table-responsive " style={{ textAlign: 'center' }}>
                                <table style={{ width: "96%", borderCollapse: "collapse", textAlign: 'center', borderColor: 'black',border:'1px',marginTop:'10px' }}>
                                    <thead className="block-example border border-dark" style={{padding:'50px',marginTop:'50px'}}>
                                        <tr style={{ fontSize: 'small'}} >
                                            <th style={{ width: '10%' ,color:'black'}} className="block-example border border-dark">
                                              SKU
                                            </th>
                                            <th style={{ width: '30%' ,color:'black'}} className="block-example border border-dark">
                                               Item
                                            </th>
                                            <th style={{ width: '10%' ,color:'black'}} className="block-example border border-dark">
                                              Model
                                            </th>
                                            <th style={{ width: '10%',color:'black' }} className="block-example border border-dark">
                                                Store
                                            </th>
                                            <th style={{ width: '10%',color:'black' }} className="block-example border border-dark">
                                              Stock Quantity
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody  style={{ textAlign: 'Center',fontSize:'small'}}>
                                        {data.map((item, i) => {
                                            return (
                                                <tr key={`item-${i}`} className="block-example border border-dark">
                                                    <td  className="block-example border border-dark" style={{color:'black',textAlign:'left',paddingLeft:'3px'}}>
                                                        {item.sku}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'left',paddingLeft:'3px'}}>
                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                        {item.Title}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'left',paddingLeft:'3px'}}>
                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                        {item.Model}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'left',paddingLeft:'3px'}}>
                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                        {item.StoreName}
                                                    </td>
                                                    <td className="block-example border border-dark" style={{color:'black',textAlign:'right',paddingRight:'3px'}} >
                                                        {item.Stock}

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

export default (StockRptData);
