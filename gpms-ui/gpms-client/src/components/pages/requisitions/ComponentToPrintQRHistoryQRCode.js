import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import { Link } from 'react-router-dom';

class ComponentToPrintQRHistoryQRCode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: [],
            productionlineId: 0
        }
    }
    componentDidMount = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        const { id, productionlineId } = this.props;

        let filter = { QRHistoryId: id };
        this.setState({
            loading: true,
            productionlineId:productionlineId
        });
        const res = await NewitemService.GetListByFilterByQRHistoryId(filter, resToken.token);
  
        this.setViewItems(res.data);

    }
    setViewItems = async (res) => {
        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length);

        _.forEach(res, (item) => {
            var viewItem =
            {
                code: item.code,
                status: item.status
            }
            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems
        })
    }

    render() {
        const { id } = this.props;
        const { viewItems, productionlineId } = this.state;


        var Barcode = require('react-barcode');
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                <div className="table-wrapper table-responsive"></div>
                                <div className="row" >
                                    {viewItems.map((item, i) => {
                                        return (

                                            <div className="col-sm-4" key={`item-${i}`} style={{ display: 'inline-block', paddingBottom: '10px', width:'8%'}}>
                                                <QRCode key={`item-${i}`} value={item.code} renderAs="canvas"   size={38}/>
                                                {/* <br />{item.code} */}

                                            </div>


                                        );
                                    })
                                    }
                                </div>
                                {/* <div className="row">
                                    <div className='col-md-10'></div>
                                    <div className='col-md-2'>
                                        <Link
                                            to={`/productionLineQR/` + productionlineId}
                                            className="main-btn warning-btn btn-hover w-60 text-center"
                                        >
                                            Back
                                        </Link>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
// export default React.memo(ComponentToPrint);
export default ComponentToPrintQRHistoryQRCode;
