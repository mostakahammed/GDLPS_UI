import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Fragment } from 'react/cjs/react.production.min'
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';
import QRCode from 'qrcode.react';
import _ from 'lodash';
import { CartonDoneService } from '../../../shared/services/cartonDones/CartonDoneService';

class IMEIData extends Component {

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
        
        let boxId= id;
        const res = await CartonDoneService.GetCartonIMEIDetailsById(boxId, resToken.token)
        console.log(res);
        this.setViewItems(res.data);

    }
    setViewItems = async (res) => {
        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length);

        _.forEach(res, (item) => {
            var viewItem =
            {
                imeI1: item.imeI1,
                imeI2: item.imeI2,
                sn:item.sn
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
                               <table className="table table-striped table-hover" style={{ width: "100%" }}> 
                                  <thead className="tbHead" style={{ background: '#0d6efd', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                       <tr >
                                       <th colSpan={3} style={{textAlign:'center'}}> BOX ID: {id} </th>
                                       </tr>
                                        <tr style={{ background: 'White', color: 'Black', textAlign: 'Center', fontSize: 'small' }}>
                                            <th style={{width:"30%"}}>
                                             IMEI 1            
                                            </th>
                                            <th>
                                            IMEI 2
                                            </th>
                                            <th>
                                            Serial No
                                            </th>                                     
                                        </tr>
                                    </thead> 
                                        <tbody style={{ textAlign: 'Center' }}>
                                            {viewItems.map((item, i) => {
                                                return (
                                                    <tr key={`item-${i}`} >
                                                        <td className="p-2" style={{width:"30%"}}>
                                                            {item.imeI1} 
                                                        </td>
                                                        <td className="p-2">
                                                            {item.imeI2} 
                                                        </td>
                                                        <td className="p-2">
                                                        {item.sn} 
                                                        </td>
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

        )
    }
}
// export default React.memo(ComponentToPrint);
export default IMEIData;
