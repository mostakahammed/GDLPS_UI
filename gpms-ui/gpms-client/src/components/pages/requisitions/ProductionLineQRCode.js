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
import ComponentToPrintProductionLineQRCode from './ComponentToPrintProductionLineQRCode';
import { Link } from 'react-router-dom';
import { NewitemService } from '../../../shared/services/newItems/NewItemservice';

class ProductionLineQRCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modelId: 0,
      colorId: 0,
      howManyQR: 0,
      productionLineId: 0,
      requisitionId:0
    }

  }
  componentDidMount = async () => {

    const { modelId, colorId, howManyQR, productionLineId,requisitionId } = this.props.useParams;

    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }
    let filter = { ModelId: modelId, ColorId: colorId, HowManyQR: howManyQR, ProductionLineId: productionLineId, RequisitionId:requisitionId };
    this.setState({
      loading: true,
      productionLineId: productionLineId

    });
    
    this.setState({
      loading: true,
      modelId: modelId,
      colorId: colorId,
      howManyQR: howManyQR,
      productionLineId: productionLineId,
      requisitionId:requisitionId
    });
  }

  render() {
    const { modelId, colorId, howManyQR, productionLineId ,requisitionId} = this.state;
     console.log(requisitionId);
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
                    to={`/productionLineQR/` + productionLineId}
                    className="main-btn warning-btn btn-hover w-60 text-center"
                  >
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {typeof modelId != 'undefined' && modelId > 0 && howManyQR > 0 &&
          <ComponentToPrintProductionLineQRCode modelId={modelId} colorId={colorId} productionLineId={productionLineId} howManyQR={howManyQR} requisitionId={requisitionId} ref={el => (this.componentRef = el)} />
        }
      </div>
    )
  }
}
export default withAuth(withRouter(ProductionLineQRCode))
