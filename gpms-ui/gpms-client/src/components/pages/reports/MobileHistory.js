import React, { Component } from 'react'
import ReactToPrint from 'react-to-print';
import withAuth from "../../../shared/hoc/AuthComponent";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { RequisitionService } from '../../../shared/services/requisitions/ResquisitionService';
import { withRouter } from '../../../shared/hoc/withRouter';
import { ProductionService } from '../../../shared/services/productions/ProductionService';
import { ProductionDailyService } from '../../../shared/services/productionDailys/ProductionDailyService';
import MobileHistoryData from './MobileHistoryData';
import _ from 'lodash';
import { faSearchDollar, faWindowRestore } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Fragment } from 'react/cjs/react.production.min';

class MobileHistory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            product: '',
            viewItems:[1,2],
            lineTypes:[],
            firstVal:[]


        }

    }
    componentDidMount = async () => {

        const { Id } = this.props.useParams;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        this.setState({
            loading: true,
            productionId: Id,
        });
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

    };

    onButtonClicked = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        let filter = { QRCode: this.state.product };
        this.setState({
            loading: true,
        });
        const res = await ProductionDailyService.GetProductionDailybyProductRef(filter, resToken.token)
        console.log(res);
          var viewItems = this.state.viewItems;
        viewItems=[];
        var reqFirstVal = _.first(res.data);
        _.forEach(res.data, (a) => {
            var viewItem =
            {
                rowSl: a.rowSl,
                Product: a.product,
                LineName: a.lineName,
                LineType: a.lineType,
                Station:a.station,
                Status:a.status,
                CreateBy:a.createBy,
                CreateDate:a.createDate,
                UpdatedBy:a.updatedBy,
                UpdatedDate:a.updatedDate

            }
            var lineType={
                LineType: a.lineType
            }
            viewItems.push(viewItem);
        })
     
        this.setState({
            viewItems:viewItems,
            firstVal:reqFirstVal
        })
   
     

    }

    render() {
        const { viewItems ,product,firstVal} = this.state;
    
        return (
            <Fragment>
            <div>
                <div className="row py-1">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="d-flex flex-row-reverse">
                <div className="p-2">
                  <ReactToPrint
                    trigger={() => <a href="#">Print this out!</a>}
                    content={() => this.componentRef}
                  />
                </div>
              </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="input-style-1">
                                        <label>
                                            <b>Product</b>
                                        </label>
                                        <input type="text" name="product" id="product" value={product} onChange={this.handleInputChange} />

                                    </div>
                                </div>
                                <div className="col-md-2" style={{ paddingTop: "9px" }}>
                                    <br />
                                    <button className="main-btn primary-btn btn-hover" onClick={ this.onButtonClicked} >
                                        <FontAwesomeIcon icon={faSearchDollar} /> Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {viewItems.length >0 &&
                    <MobileHistoryData rptData={viewItems} firstVal={firstVal}  ref={el => (this.componentRef = el)} />
                }
                 {viewItems.length == 0 &&
                    <div  className='card' style={{color:'red',textAlign:'center'}}>
                        Data Not Found Invalid Code !!
                    </div>
                }
            </div>
            </Fragment>
        )
    }
}
export default withAuth(withRouter(MobileHistory))
