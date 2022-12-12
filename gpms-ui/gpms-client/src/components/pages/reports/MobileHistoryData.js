import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import ReportHeader from '../../mics/ReportHeader';

class MobileHistoryData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: [],
            types: []
        }
    }
    componentDidMount = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;

        }
        const type = [
            {
                value: 'Assembly',
                label: 'Assembly'
            },
            {
                value: 'Packaging',
                label: 'Packaging'
            },

        ];
        this.setState({
            types: type
        })
    }

    render() {
        const { rptData, firstVal } = this.props;
        const { types } = this.state;
        console.log(rptData);
        return (

            <div className="col-xl-12 col-lg-12 col-sm-12 card">
                <div >
                    <div className="mb-30 " style={{ marginBottom: "0px", marginLeft: '6px' }}>
                        <div className="table-wrapper table-responsive " style={{ paddingTop: '50px', paddingBottom: '10px' }}>
                            <table style={{ width: '-webkit-fill-available', color: 'Black', }}>
                                <thead style={{ textAlign: 'center' }}>
                                    <tr >
                                        <td style={{ textAlign: 'center', fontSize: 'large' }} ><b>Mobile History</b></td>
                                    </tr>

                                </thead>
                            </table>

                        </div>
                        <div>
                            <table style={{ width: "96%", fontSize: 'small', color: 'black' }}>
                                <tbody>
                                    <tr key="r1">
                                        <td style={{ width: '5%' }} ><b>Model:</b> </td><td style={{ width: '28%', textAlign: 'left' }}>{firstVal.modelName}</td>
                                        <td style={{ width: '3%' }}><b>Color:</b> </td><td style={{ width: '30%' }}>{firstVal.colorName}</td>
                                        <td style={{ width: '2%' }}><b>IMEI1: </b></td><td style={{ width: '18%' }}>{firstVal.imeI1}</td>
                                    </tr>
                                    <tr key="r2">
                                        <td ><b>IMEI2:</b> </td><td >{firstVal.imeI2}</td>
                                        <td ><b>SN: </b></td><td >{firstVal.sn}</td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                     
                        {
                            types.map((vItem, vIndex) => {
                                return (
                                    <div>
                                        <div>  <table style={{ width: "96%", borderCollapse: "collapse", backgroundColor: '#0d6efd', textAlign: 'left', borderColor: 'black', border: '1px', marginTop: '10px', color:'white' }}>
                                            <tr key={`line-${vIndex}`} style={{ fontSize: 'small' }} >
                                                <td className="block-example border border-dark" style={{ color: 'white', textAlign: 'left', paddingLeft: '3px' }}>
                                                    {vItem.value}
                                                </td>
                                            </tr>
                                        </table></div>
                                        {
                                            rptData.filter(m => m.LineType == vItem.value).map((lItem, index) => {
                                                return (
                                                    <div >
                                                        {/* <table key={`station-${lItem}`} style={{ width: "96%", borderCollapse: "collapse", backgroundColor: 'lavender', textAlign: 'center', borderColor: 'black', border: '1px', marginTop: '10px' }}>
                                                            <tr style={{ fontSize: 'small' }} >
                                                                <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'center', paddingLeft: '3px' }}>
                                                                    {lItem.Station}
                                                                </td>
                                                            </tr>
                                                        </table> */}
                                                        <div className="table-wrapper table-responsive " style={{ textAlign: 'center' }}>

                                                            <table style={{ width: "96%", borderCollapse: "collapse", textAlign: 'center', borderColor: 'black', border: '1px', marginTop: '10px' }}>
                                                                <thead className="block-example border border-dark" style={{ padding: '50px', marginTop: '50px' ,backgroundColor: 'lavender'}}>
                                                                    <tr style={{ fontSize: 'small' }} >
                                                                        <th style={{ width: '16%', color: 'black' }} className="block-example border border-dark">
                                                                            Line
                                                                        </th>
                                                                        <th style={{ width: '14%', color: 'black' }} className="block-example border border-dark">
                                                                            Station
                                                                        </th>
                                                                        <th style={{ width: '7%', color: 'black' }} className="block-example border border-dark">
                                                                            Status
                                                                        </th>
                                                                        <th style={{ width: '15%', color: 'black' }} className="block-example border border-dark">
                                                                            Added By
                                                                        </th>
                                                                        <th style={{ width: '16%', color: 'black' }} className="block-example border border-dark">
                                                                            Added Date
                                                                        </th>
                                                                        <th style={{ width: '16%', color: 'black' }} className="block-example border border-dark">
                                                                            Updated By
                                                                        </th>
                                                                        <th style={{ width: '16%', color: 'black' }} className="block-example border border-dark">
                                                                            Update Date
                                                                        </th>


                                                                    </tr>
                                                                </thead>
                                                                <tbody style={{ textAlign: 'Center', fontSize: 'small' }}>

                                                                    {
                                                                        rptData.filter(cm => cm.Station == lItem.Station).map((cItem, cIndex) => {
                                                                            return (
                                                                                <tr key={`item-${cIndex}`} className="block-example border border-dark">
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {cItem.LineName}
                                                                                    </td>
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {cItem.Station}
                                                                                    </td>
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {cItem.Status}
                                                                                    </td>
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                                        {cItem.CreateBy}
                                                                                    </td>
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                                        {cItem.CreateDate}
                                                                                    </td>
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                                        {cItem.UpdatedBy}
                                                                                    </td>
                                                                                    <td className="block-example border border-dark" style={{ color: 'black', textAlign: 'left', paddingLeft: '3px' }}>
                                                                                        {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                                        {cItem.UpdatedDate}
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
                                                );

                                            })
                                        }
                                    </div>
                                );

                            })

                        }
                    </div>
                </div>
            </div>

        );


    }
}
// export default React.memo(ComponentToPrint);
export default MobileHistoryData;
