import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import _ from 'lodash';
import { ProductionService } from '../../../shared/services/productions/ProductionService';

class PackagingData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: [],
            curDate:''
        }
    }
    componentDidMount = async () => {
        await this.GetlineDashBoardInformation();
        this.interval = setInterval(() => {
            this.GetlineDashBoardInformation();
          }, 1000);
    }
    GetlineDashBoardInformation = async()=>{
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }
        
        let filter = {};
        this.setState({
            loading: true,
        });
        const res = await ProductionService.GetlineDashBoardInformationPackaging(filter, resToken.token)
        console.log(res);
        this.setViewItems(res.data);
    }
    setViewItems = async (res) => {
        const time = new Date();
        var curDate = time.getDate() + ":" + (time.getMonth() +1)+ ":" + time.getFullYear();
        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length);
   
        _.forEach(res, (item) => {
            var viewItem =
            {
                line: item.line,
                model: item.model,
                issue: item.imeiMerge,
                iMEIMerge: item.imeiMerge,
                weightScale: item.weightScale,
                oQCCheckedQty: item.oqcCheckedQty,
                oQCPassedQty: item.oqcPassedQty,
                oQCFailedQty: item.oqcFailedQty,
                oQCFailedPercent: item.oqcFailedPercent.toFixed(2),
                packagingAestheticCheckedQty: item.packagingAestheticCheckedQty,
                packagingAestheticPassedQty: item.packagingAestheticPassedQty,
                packagingAestheticFailedQty: item.packagingAestheticFailedQty,
                packagingAestheticFailedPercent: item.packagingAestheticFailedPercent.toFixed(2),
                oqcPass: item.oqcPass,

            }
            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems,
            curDate:curDate
        })
    }
    componentWillUnmount() {
        clearInterval(this.interval);
      }

    render() {
        const { viewItems ,curDate} = this.state;

        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-15" style={{ marginBottom: "0px", background: '#0a0946',height:'100vh' ,padding:'5px 10px' }}>
                                <div className="table-wrapper table-responsive"></div>
                                <table className="table table-bordered " style={{ width: "100%", borderCollapse: "collapse" ,borderColor:'rgb(192, 178, 178)'}}>
                                    <thead className="tbHead" style={{ color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                        <tr style={{border: 'none'}}>
                                            <th colSpan={7} style={{ textAlign: "left" ,fontSize:'large',border: 'none'}}> Packaging</th>
                                            <th colSpan={6} style={{ textAlign: "right" , border: 'none'}}>Date- {curDate}</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr style={{ background: '#720317', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                            <td rowSpan={2} style={{ width: '20%' }}> <b>Line No</b></td>
                                            <td rowSpan={2} style={{ width: '20%' }}><b>Model</b></td>
                                            <td rowSpan={2} style={{ width: '7%' }}><b>Issue</b></td>
                                            <td rowSpan={2} style={{ width: '7%' }}><b>IMEI Merged Quantity</b></td>
                                            <td colSpan={4} style={{ textAlign: "center" }} className="qualityCheckTd"><b>Packaging Aesthetic</b></td>
                                            <td rowSpan={2} style={{ width: '7%' }}><b>Weight Chekced Quantity</b></td>
                                            <td rowSpan={2} style={{ width: '11%' }}><b> Total Output (OQC Pass)</b></td>
                                        </tr>
                                        <tr style={{ background: '#720317', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                            <td style={{ width: '7%' }}> <b>Checked Quantity</b></td>
                                            <td style={{ width: '7%' }}><b>Passed Quantity</b></td>
                                            <td style={{ width: '7%' }}><b>Failed Quantity</b></td>
                                            <td style={{ width: '7%' }}> <b>Fault %</b></td>
                                          
                                        </tr>
                                        {viewItems.map((item, i) => {
                                            return (
                                                <tr key={`item-${i}` } style={{ color: 'white', textAlign: 'Center', fontSize: 'small' }} >
                                                    <td className="p-2" style={{background: '#931515', textAlign: 'Left !important'}}>
                                                        {item.line}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.model}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.issue}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.iMEIMerge}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.packagingAestheticCheckedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.packagingAestheticPassedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.packagingAestheticFailedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.packagingAestheticFailedPercent}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.weightScale}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.oqcPass}
                                                    </td>

                                                </tr>
                                            );
                                        })
                                        }

                                    </tbody >
                                </table >
                            </div >
                        </div >
                    </div >
                </div >
            </div >

        )
    }
}
// export default React.memo(ComponentToPrint);
export default PackagingData;
