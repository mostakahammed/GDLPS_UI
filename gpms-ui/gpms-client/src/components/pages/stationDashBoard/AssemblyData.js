import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import _ from 'lodash';
import { ProductionService } from '../../../shared/services/productions/ProductionService';
import { mockComponent } from 'react-dom/test-utils';

class AssemblyData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: [],
            curDate: ''
        }
    }
    componentDidMount = async () => {

        await this.GetlineDashBoardInformation();
        this.interval = setInterval(() => {
            this.GetlineDashBoardInformation();
        }, 1000);

    }
    setViewItems = async (res) => {
        const time = new Date();
        var curDate = time.getDate() + ":" + (time.getMonth() + 1) + ":" + time.getFullYear();
        var curDate = (time.getHours() % 12 || 12) + ":"
            + time.getMinutes() + ":"
            + time.getSeconds() + ' '+ curDate;
        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length);

        _.forEach(res, (item) => {
            var viewItem =
            {
                line: item.line,
                model: item.model,
                issue: item.issue,
                screwDone: item.screwDone,
                functionQCCheckedQty: item.functionQCCheckedQty,
                functionQCPassedQty: item.functionQCPassedQty,
                functionQCFailedQty: item.functionQCFailedQty,
                functionQCFailedPercent: item.functionQCFailedPercent.toFixed(2),
                aestheticQCCheckedQty: item.aestheticQCCheckedQty,
                aestheticQCPassedQty: item.aestheticQCPassedQty,
                aestheticQCFailedQty: item.aestheticQCFailedQty,
                aestheticQCFailedPercent: item.aestheticQCFailedPercent == 0 ? item.aestheticQCFailedPercent : item.aestheticQCFailedPercent.toFixed(2),
                qcPass: item.qcPass,

            }
            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems,
            curDate: curDate
        })
    }

    GetlineDashBoardInformation = async () => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        let filter = {};
        this.setState({
            loading: true,
        });
        const res = await ProductionService.GetlineDashBoardInformation(filter, resToken.token);
 
        this.setViewItems(res.data);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { viewItems, curDate } = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-15" style={{ marginBottom: "0px", background: '#0a0946',height:'100vh' ,padding:'5px 10px'}}>
                                <div className="table-wrapper table-responsive"></div>
                                <table className="table table-bordered " style={{ width: "100%", borderCollapse: "collapse" ,borderColor:'rgb(192, 178, 178)'}}>
                                    <thead className="tbHead" style={{ color: 'black', textAlign: 'Center', fontSize: 'small' }}>
                                        <tr style={{ border: 'none',  color: 'white'}}>
                                            <th colSpan={7} style={{ textAlign: "left", fontSize: 'large', border: 'none' }}>Assembly </th>
                                            <th colSpan={6} style={{ textAlign: "right", border: 'none' }}>Date- {curDate}</th>
                                        </tr>
                                    </thead>

                                    <tbody >
                                        <tr style={{ background: '#720317', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                            <td rowSpan={3} style={{ width: '15%' }}><b>Line No</b></td>
                                            <td rowSpan={3} style={{ width: '15%' }}><b>Model</b></td>
                                            <td rowSpan={3} style={{ width: '5%' }}><b>Issue</b></td>
                                            <td rowSpan={3} style={{ width: '5%' }}><b>screw Done</b></td>
                                            <td colSpan={8} style={{ textAlign: "center" }} className="qualityCheckTd"><b>Quality Check Results</b></td>
                                            <td rowSpan={3}><b> Total Output (QC Pass)</b></td>
                                        </tr>
                                        <tr style={{ background: '#720317', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                            <td colSpan={4} style={{ textAlign: "center" }}> <b>Function </b></td>
                                            <td colSpan={4} style={{ textAlign: "center" }}> <b>Aesthetic</b></td>

                                        </tr>
                                        <tr style={{ background: '#720317', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                            <td style={{ width: '5%' }}> <b>Checked Quantity</b></td>
                                            <td style={{ width: '5%' }}><b>Passed Quantity</b></td>
                                            <td style={{ width: '5%' }}><b>Failed Quantity</b></td>
                                            <td style={{ width: '5%' }}> <b>Fault %</b></td>
                                            <td style={{ width: '5%' }}><b>Checked Qauntity</b></td>
                                            <td style={{ width: '5%' }}><b>Passed Quantity</b></td>
                                            <td style={{ width: '5%' }}><b>Failed Quantity</b></td>
                                            <td style={{ width: '5%' }}><b>Fault %</b></td>
                                        </tr>
                                        {viewItems.map((item, i) => {
                                            return (
                                                <tr key={`item-${i}`} style={{ color: 'white', textAlign: 'Center', fontSize: 'small' }} >
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
                                                        {item.screwDone}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.functionQCCheckedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.functionQCPassedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.functionQCFailedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.functionQCFailedPercent}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.aestheticQCCheckedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.aestheticQCPassedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.aestheticQCFailedQty}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.aestheticQCFailedPercent}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.qcPass}
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
export default AssemblyData;
