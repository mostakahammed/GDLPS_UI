import React, { Component } from 'react'
import ReactToPrint from 'react-to-print';
import withAuth from "../../../shared/hoc/AuthComponent";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { AuthenticationService } from '../../../shared/services/authentications/AuthenticationService';
import { RequisitionService } from '../../../shared/services/requisitions/ResquisitionService';
import { withRouter } from '../../../shared/hoc/withRouter';
import IMEIData from './IMEIData';
import Breadcrumb from '../../mics/Breadcrumb';
import { Link } from 'react-router-dom';


class CartonIMEI extends Component {

  constructor(props) {
    super(props);

    this.state = {
        boxId: 0
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
      boxId: Id.toString(),
    });
  }
 
  render() {
    const { boxId } = this.state;
    return (
      <div>
         <Breadcrumb
                        BreadcrumbParams={{
                            header: "Carton IMEI",
                            title: "Carton IMEI",
                            isDashboardMenu: false,
                            isThreeLayer: false,
                            threeLayerTitle: "cartonDone",
                            threeLayerLink: "/cartonDone",
                        }}
                    />
        <div className="row py-1">
          <div className="col-md-12">
            <div className="card">
              {/* <div className="d-flex flex-row-reverse">
                <div className="p-2">
                  <ReactToPrint
                    trigger={() => <a href="#">Print this out!</a>}
                    content={() => this.componentRef}
                  />
                </div>
              </div> */}
              <div className='row'>
                <div className='col-md-12'>
                  <div className="d-flex flex-row-reverse">
                    <div className="p-2">
                      <ReactToPrint
                        trigger={() => <a href="#">Print this out!</a>}
                        content={() => this.componentRef}
                      />

                    </div>
                  </div>
                </div>
                {/* <div className='col-md-2 p-2'>
                  <Link
                    to={`/logisticApproved`}
                    className="main-btn warning-btn btn-hover w-60 text-center"
                  >
                    Back
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {typeof boxId !== "undefined" && (boxId.length) > 0 &&
          <IMEIData id={boxId} ref={el => (this.componentRef = el)} />
        }
      </div>
    )
  }
}
export default withAuth(withRouter(CartonIMEI))
