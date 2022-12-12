import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import QRCode from 'qrcode.react';
import _ from 'lodash';

class ComponentToPrint extends Component {

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

        let requisitionId = id;

        let filter = { RequisitionId: requisitionId };
        this.setState({
            loading: true,
        });
        const res = await NewitemService.GetListByFilter(filter, resToken.token)
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
        const{viewItems}=this.state;
    

        var Barcode = require('react-barcode');
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                <div className="table-wrapper table-responsive"></div>
                                {/* <table className="table table-striped table-hover" style={{ width: "100%" }}> */}
                                    {/* <thead className="tbHead" style={{ background: '#0d6efd', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                        <tr>
                                            <th style={{width:"30%"}}>
                                                Code
                                            </th>
                                            <th>
                                                Status
                                            </th>
                                            <th>
                                              QRCode
                                            </th>                                     
                                        </tr>
                                    </thead> */}
                                        {/* <tbody style={{ textAlign: 'Center' }}>
                                            {viewItems.map((item, i) => {
                                                return (
                                                    <tr key={`item-${i}`} >
                                                        <td className="p-2" style={{width:"30%"}}>
                                                            {item.code} 
                                                        </td>
                                                        <td className="p-2">
                                                            {item.status} 
                                                        </td>
                                                        <td className="p-2">
                                                             <Barcode value={item.code} /> 
                                                            <QRCode value={item.code}  renderAs="canvas" />
                                                            <br/>{item.code}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            }
                                        </tbody> */}
                                {/* </table> */}
                                <div class="row">
                                    {viewItems.map((item, i) => {
                                        return (
                                       
                                            <div className="col-sm-4" style={{display:'inline-block', width:'20%', paddingBottom:'10px'}}>
                                                <QRCode value={item.code} renderAs="canvas" />
                                                <br />{item.code}
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
export default ComponentToPrint;
