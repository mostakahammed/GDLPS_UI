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
import PreRequisitionCheckData from './PreRequisitionCheckData';
import { Helmet } from 'react-helmet';
import Breadcrumb from '../../mics/Breadcrumb';



class PreRequisitionCheck extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rptDataIsShown: 'True'
        }

    }


    render() {
        const { rptDataIsShown } = this.state;
     
        return (
            <div>
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Pre Requisition",
                            title: "Pre Requisition Check",
                            isDashboardMenu: false,
                            isThreeLayer: false,
                            threeLayerTitle: "",
                            threeLayerLink: "",
                        }}
                    />
                {rptDataIsShown == 'True' &&
                    <PreRequisitionCheckData id={rptDataIsShown}  />
                }

            </div>
        )
    }
}
export default withAuth(withRouter(PreRequisitionCheck))


