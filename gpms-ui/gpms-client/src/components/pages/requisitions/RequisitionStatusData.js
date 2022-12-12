import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import _ from 'lodash';
import { ProductionService } from '../../../shared/services/productions/ProductionService';
import { mockComponent } from 'react-dom/test-utils';
import { RequisitionService } from '../../../shared/services/requisitions/ResquisitionService';

class RequisitionStatusData extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: [],
            curDate: '',
            requisitionName: '',
            total: "",
            notScanned: '',
            date: '',
            qrPrinted: 0,
            printedQR:0

        }
    }
    componentDidMount = async () => {

        await this.GetRptInformation();

    }
    setViewItems = async (res) => {

        var total = this.state.total;
        const time = new Date();
        var curDate = time.getDate() + ":" + (time.getMonth() + 1) + ":" + time.getFullYear();
        var curDate = (time.getHours() % 12 || 12) + ":"
            + time.getMinutes() + ":"
            + time.getSeconds() + ' ' + curDate;
        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length);
        //change here
        var totalScanned = 0;
        _.forEach(res, (item) => {
            var viewItem =
            {
                sn: item.rowSl,
                scannedNumber: item.scannedNumber,
                stationName: item.stationName,
            }
            viewItems.push(viewItem);
            totalScanned = parseInt(item.scannedNumber) + parseInt(totalScanned);
        })

        this.setState({
            viewItems: viewItems,
            curDate: curDate,
            notScanned: total - totalScanned
        })
    }

    GetRptInformation = async () => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }
        const { id, requisitionName } = this.props;
        let filter = { RequisitionId: id };
        this.setState({
            loading: true,
            requisitionName: requisitionName
        });
        const res = await NewitemService.RequisitionStatusByRequisitionId(filter, resToken.token);
       
        const resp = await RequisitionService.GetDetailsById(id, resToken.token);
        var reqFirstVal = _.first(res.response);

        this.setState({
            requisitionName: resp.data.requisitionNo,
            total: resp.data.itemQuantity,
            date: resp.data.requisitionDateInText,
            printedQR:res.qrPrint

        })
        if (res.response.length > 0) {
            this.setState({
               // qrPrinted: reqFirstVal.qrPrinted
            })
        }
        this.setViewItems(res.response);
    }

    render() {
        const { viewItems, curDate, qrPrinted,printedQR, requisitionName, total, notScanned, date } = this.state;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-30" style={{ marginBottom: "0px", background: '#f0ffff' }}>
                                <div className="table-wrapper table-responsive"></div>
                                <div className='row'>
                                    <div className='col-md-8'>
                                        <p className='p-2'> <b>Requisition No: </b>{requisitionName}</p>
                                    </div>
                                </div>
                                <div className='row'>

                                    <div className='col-md-3'>
                                        <p className='p-2'><b>Total:</b>  {total}</p>
                                    </div>
                                    <div className='col-md-3'>
                                        <p className='p-2'><b>Not Scanned:</b>  {notScanned}</p>
                                    </div>
                                    <div className='col-md-3'>
                                        <p className='p-2'><b> QR Printed: </b>  {printedQR}</p>
                                    </div>
                                    <div className='col-md-3'>
                                        <p className='p-2'><b> Created Date:</b>  {date}</p>
                                    </div>
                                </div>

                                <table className="table table-bordered border-primary" style={{ width: "100%", borderCollapse: "collapse" }}>
                                    <thead className="tbHead" style={{ color: 'black', textAlign: 'Center', fontSize: 'small' }}>
                                        <tr>
                                            <th> Serial </th>
                                            <th>Station </th>
                                            <th> Scanned</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewItems.map((item, i) => {
                                            return (
                                                <tr key={`item-${i}`} >
                                                    <td className="p-2">
                                                        {item.sn}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.stationName}
                                                    </td>
                                                    <td className="p-2">
                                                        {item.scannedNumber}
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
export default RequisitionStatusData;
