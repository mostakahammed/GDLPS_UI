import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import QRCode from 'qrcode.react';
import _ from 'lodash';

class ComponentToPrintQRCode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            viewItems: []
        }
    }
    componentDidMount = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        const { id } = this.props;
        let filter = { ProductionId: id };
        this.setState({
            loading: true,
        });
        const res = await NewitemService.GetListByFilterByProductionId(filter, resToken.token);
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
        const { viewItems } = this.state;


        var Barcode = require('react-barcode');
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                <div className="table-wrapper table-responsive"></div>
                                <div class="row">
                                    {viewItems.map((item, i) => {
                                        return (

                                            <div className="col-sm-4" style={{display:'inline-block', width:'20%', paddingBottom:'10px',width:'8%'}}>
                                                <QRCode value={item.code} renderAs="canvas" size={38} />            
                                            </div>


                                        );
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
// export default React.memo(ComponentToPrint);
export default ComponentToPrintQRCode;
