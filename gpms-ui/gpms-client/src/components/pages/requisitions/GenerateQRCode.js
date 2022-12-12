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

class GenerateQRCode extends Component {

  constructor(props) {
    super(props);

    this.state = {
      productionId: 0
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
 
  render() {
    const { productionId } = this.state;
    return (
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
            </div>
          </div>
        </div>

        {typeof productionId !== "undefined" && productionId > 0 &&
          <ComponentToPrintQRCode id={productionId} ref={el => (this.componentRef = el)} />
        }
      </div>
    )
  }
}
export default withAuth(withRouter(GenerateQRCode))
