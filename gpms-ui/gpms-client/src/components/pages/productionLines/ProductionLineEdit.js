import React, { Component, Fragment } from 'react'
import { LineService } from '../../../shared/services/lines/LineService';
import Breadcrumb from '../../mics/Breadcrumb';
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineStationService } from '../../../shared/services/lineStation/LineStationService';
import { StationService } from '../../../shared/services/stations/StationService';
import Select from 'react-select'
import withAuth from '../../../shared/hoc/AuthComponent';
import { UserService } from '../../../shared/services/users/UserService';
import { withRouter } from '../../../shared/hoc/withRouter';
import { RequisitionService } from '../../../shared/services/requisitions/ResquisitionService';
import { ProductionService } from '../../../shared/services/productions/ProductionService';
import { ProductionLineService } from '../../../shared/services/productionLines/ProductionLineService';

export class ProductionLineEdit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lines: [],
            lineTypes: [],
            lineId: 19,
            users: [],
            lineLeaderUserId: 0,
            sortOrder: "",
            date: "",
            requisitionNo: "",
            manpower: "",
            manpowerPresent: "",
            manpowerAbsent: "",
            requisitionId:0,
            id:0,

            //validation
            error: {
                lineId: '',
                lineLeaderUserId: '',
                sortOrder: '',
                date: "",
                requisitionNo: "",
                manpower: "",
                manpowerPresent: "",
                manpowerAbsent: "",
            }
        }
    }

    componentDidMount = async () => {

        const { Id } = this.props.useParams;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        //get station list for ddl
        let line = await this.getLineList(resToken.token);
        let user = await this.getUserList(resToken.token);
  
        this.setState(
            {
              lines:line.data,
              users:user.data,
            }
          )
        let productionDetails = await this.getProductionDetails(Id, resToken.token);
         console.log(productionDetails);
        let requisitionDetails = await this.getRequisitionDetails(productionDetails.requisitionId, resToken.token);
    
    this.setState(
      {
        id: productionDetails.id,
        lineId: productionDetails.lineId,
        requisitionId: productionDetails.requisitionId,
        lineLeaderUserId: productionDetails.lineLeaderUserId,
        // date:  productionDetails.date,
        manpower: productionDetails.manpower,
        manpowerPresent: productionDetails.manpowerPresent,
        manpowerAbsent: productionDetails.manpowerAbsent,   
        requisitionNo: requisitionDetails.data.requisitionNo,
      }
    )

    }

    getLineList = async (token) => {

        let filteredList = await LineService.GetDropdownList(token);

        return filteredList;
    }
    getUserList = async (token) => {

        let filteredList = await UserService.GetDropdownList(token);

        return filteredList;
    }
    getRequisitionDetails = async (Id, token) => {

        this.setState({
            loading: true,
        });
        const res = await RequisitionService.GetDetailsById(Id, token);

        return res;

    };
    getProductionDetails = async (Id, token) => {

        const res = await ProductionLineService.GetDetailsById(Id, token);
    
        return res.data;
    
      };



    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        this.formValidationObject(name, value);
    };

    validateFormOnLoginSubmit = () => {

        this.formValidationObject('lineId', this.state.lineId.toString());
        this.formValidationObject('lineLeaderUserId', this.state.lineLeaderUserId.toString());
        this.formValidationObject('date', this.state.date);
        this.formValidationObject('requisitionNo', this.state.requisitionNo);
        this.formValidationObject('manpower', this.state.manpower.toString());
        this.formValidationObject('manpowerPresent', this.state.manpowerPresent.toString());
        this.formValidationObject('manpowerAbsent', this.state.manpowerAbsent.toString());
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "lineId":
                error.lineId = !value.length || value === '' ? "line is Required" : "";
                break;
            case "lineLeaderUserId":
                error.lineLeaderUserId = !value.length || value === '' ? "line Leader User is Required" : "";
                break;
            case "date":
                error.date = !value.length || value === '' ? "Date is Required" : "";
                break;
            case "requisitionNo":
                error.requisitionNo = !value.length || value === '' ? "RequisitionNo is Required" : "";
                break;
            case "Manpower":
                error.manpower = !value.length || value === '' ? "Manpower User is Required" : "";
                break;
            case "manpowerPresent":
                error.manpowerPresent = !value.length || value === '' ? "man power Present is Required" : "";
                break;
            case "manpowerAbsent":
                error.manpowerAbsent = !value.length || value === '' ? "Man power Absent is Required" : "";
                break;
            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };


    handleSubmit = async (e) => {
        e.preventDefault();
        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }

        const { id,lineId, requisitionId, lineLeaderUserId, date, manpower, manpowerPresent, manpowerAbsent} = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            Id:id,
            LineId: lineId,
            requisitionId: requisitionId,
            LineLeaderUserId:lineLeaderUserId,
            ProductionDate: date,
            Manpower:manpower,
            ManpowerPresent:manpowerPresent,
            ManpowerAbsent:manpowerAbsent,
            IsActive: true
        }

        const res = await ProductionService.Edit(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                lineId: "",
                lineLeaderUserId: "",
                lineLeaderUserId: 0,
                sortOrder: "",
                date: "",
                requisitionNo: "",
                manpower: "",
                manpowerPresent: "",
                manpowerAbsent: "",
                requisitionId:0,
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            this.props.navigate(`/productionLine`, { replace: true });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });


    };


    render() {
        const { lines, stations, lineId, stationId, sortOrder, error, lineLeaderUserId, users, date, requisitionNo, manpower, manpowerPresent, manpowerAbsent } = this.state;
        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Add Production",
                            title: "Production Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Productions",
                            threeLayerLink: "/productionLine",
                        }}
                    />

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">

                                <form className="form-elements-wrapper" onSubmit={this.handleSubmit} noValidate>
                                    <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Requisition No.</b>
                                                    </label>
                                                    <input type="text" name="requisitionNo" id="requisitionNo" value={requisitionNo} onChange={this.handleInputChange} autoComplete='off' />
                                                    {error.requisitionNo.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.requisitionNo}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Date</b>
                                                    </label>
                                                    <input type="date" name="date" id="date" value={date} onChange={this.handleInputChange} />
                                                    {error.date.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.date}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b>Line</b> </label>
                                                    <select className="form-control" name="lineId" id="lineId" onChange={this.handleInputChange} value={lineId}>
                                                        <option value=""> Select One</option>
                                                        {lines.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.lineId.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.lineId}</div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b> Line Leader</b> </label>
                                                    <select className="form-control" name="lineLeaderUserId" id="lineLeaderUserId" onChange={this.handleInputChange} value={lineLeaderUserId}>
                                                        <option value=""> Select One</option>
                                                        {users && users.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.lineLeaderUserId.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.stationId}</div>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Manpower</b>
                                                    </label>
                                                    <input type="text" name="manpower" id="manpower" value={manpower} onChange={this.handleInputChange} autoComplete='off' />
                                                    {error.manpower.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.manpower}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Manpower Present</b>
                                                    </label>
                                                    <input type="text" name="manpowerPresent" id="manpowerPresent" value={manpowerPresent} onChange={this.handleInputChange} />

                                                    {error.manpowerPresent.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.manpowerPresent}</div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">

                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Manpower Absent</b>
                                                    </label>
                                                    <input type="text" name="manpowerAbsent" id="manpowerAbsent" value={manpowerAbsent} onChange={this.handleInputChange} />

                                                    {error.manpowerAbsent.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.manpowerAbsent}</div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className=" button-group d-flex justify-content-left flex-wrap">
                                                    <button className="main-btn primary-btn btn-hover w-60 text-center" type="submit"> Submit </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                            </div>

                        </div>
                    </div>
                </div>

            </Fragment>
        )
    }
}

export default withAuth(withRouter(ProductionLineEdit));
