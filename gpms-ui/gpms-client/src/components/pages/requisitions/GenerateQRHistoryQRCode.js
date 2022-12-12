import React, { Component } from 'react'
import ReactToPrint from 'react-to-print';
import ComponentToPrint from './ComponentToPrint';
import withAuth from "../../../shared/hoc/AuthComponent";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { RequisitionService } from '../../../shared/services/requisitions/ResquisitionService';
import { withRouter } from '../../../shared/hoc/withRouter';
import { ProductionService } from '../../../shared/services/productions/ProductionService';
import ComponentToPrintQRCode from './ComponentToPrintQRCode';
import ComponentToPrintQRHistoryQRCode from './ComponentToPrintQRHistoryQRCode';
import { Link } from 'react-router-dom';

class GenerateQRHistoryQRCode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            qrHistoryId: 0,
            productionlineId: 0
        }

    }
    componentDidMount = async () => {

        const { Id, productionlineId } = this.props.useParams;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        this.setState({
            loading: true,
            qrHistoryId: Id,
            productionlineId: productionlineId
        });
    }

    render() {
        const { qrHistoryId, productionlineId } = this.state;
        return (
            <div>
                <div className="row py-1">
                    <div className="col-md-12">
                        <div className="card">
                            <div className='row'>
                                <div className='col-md-10'>
                                    <div className="d-flex flex-row-reverse">
                                        <div className="p-2">
                                            <ReactToPrint
                                                trigger={() => <a href="#">Print this out!</a>}
                                                content={() => this.componentRef}
                                            />

                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-2 p-2'>
                                    <Link
                                        to={`/productionLineQR/` + productionlineId}
                                        className="main-btn warning-btn btn-hover w-60 text-center"
                                    >
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {typeof qrHistoryId !== "undefined" && qrHistoryId > 0 &&
                    <ComponentToPrintQRHistoryQRCode id={qrHistoryId} productionlineId={productionlineId} ref={el => (this.componentRef = el)} />
                }
            </div>
        )
    }
}
export default withAuth(withRouter(GenerateQRHistoryQRCode))
