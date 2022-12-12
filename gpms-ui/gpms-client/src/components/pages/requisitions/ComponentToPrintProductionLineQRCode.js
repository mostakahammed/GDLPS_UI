import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import { ProductionLineService } from '../../../shared/services/productionLines/ProductionLineService';
import { Link } from 'react-router-dom';
import { Toaster } from '../../../shared/utilities/Toaster';
import { ToasterTypeConstants } from '../../../shared/utilities/GlobalConstrants';
import { withRouter } from '../../../shared/hoc/withRouter';
import withAuth from '../../../shared/hoc/AuthComponent';

class ComponentToPrintProductionLineQRCode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: [],
            productionLineId:0
        }
    }
    componentDidMount = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        const { modelId, colorId, howManyQR, productionLineId ,requisitionId} = this.props;
        
        let filter = { ModelId: modelId, ColorId: colorId, HowManyQR: howManyQR, ProductionLineId: productionLineId, RequisitionId:requisitionId };
        this.setState({
            loading: true,
            productionLineId:productionLineId

        });
        
        const res = await NewitemService.GetByModelColorFilter(filter, resToken.token);
 
        if (!res.isSuccess) {
            //this.props.navigate(`/productionLineQR/`+ productionLineId, { replace: true });
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.message});
            return;
        }
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
        const { viewItems,productionLineId } = this.state;
     console.log(viewItems);

        var Barcode = require('react-barcode');
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                <div className="table-wrapper table-responsive"></div>
                                <div className="row">
                                    {viewItems.map((item, i) => {
                                        return (

                                            <div className="col-sm-4" key={`${i}`} style={{ display: 'inline-block', width: '20%', paddingBottom: '10px' }}>
                                                <QRCode key={`item-${i}`} value={item.code} renderAs="canvas"  size={38}/>
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
                                            to={`/productionLineQR/` + productionLineId}
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
export default (ComponentToPrintProductionLineQRCode);
