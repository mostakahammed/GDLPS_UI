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

class StartProduction extends Component {

  constructor(props) {
    super(props);

    this.state = {
      RequisitionId: 0
    }

  }
  componentDidMount = async () => {

    const { Id } = this.props.useParams;

    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }

    let requisitionDetails = await this.getRequisitionDetails(Id, resToken.token);
    // let productionDetails = await this.getProductionDetailsByRequisitionId(Id, resToken.token);
   
    var data = requisitionDetails.data;
  
    const model = {
      Id: Id,
      RequisitionNo: data.requisitionNo,
      RequisitionDate: data.RequisitionDate,
      IsActive: true,
      RequisitionFor: "WIP",
      ModelId: data.modelId,
      ItemQuantity: data.itemQuantity,
      RequisitionStatus: "Approved",
      // ProductionId:productionDetails.data.id
    }

    const res = await RequisitionService.StartProduction(model, resToken.token);
 
    
    this.setState({
      loading: true,
      RequisitionId: Id,
    });
  }
  getRequisitionDetails = async (Id, token) => {

    this.setState({
      loading: true,
    });
    const res = await RequisitionService.GetDetailsById(Id, token);

    return res;

  };
  getProductionDetailsByRequisitionId = async (Id, token) => {

    this.setState({
      loading: true,
    });
    const res = await ProductionService.GetDetailsByRequisitionId(Id, token);

    return res;

  };


  render() {
    const { RequisitionId } = this.state;
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

        {typeof RequisitionId !== "undefined" && RequisitionId > 0 &&
          <ComponentToPrint id={RequisitionId} ref={el => (this.componentRef = el)} />
        }
      </div>
    )
  }
}
export default withAuth(withRouter(StartProduction))
