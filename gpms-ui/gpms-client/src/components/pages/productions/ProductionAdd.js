import React, { Component, Fragment } from 'react'
import { LineService } from '../../../shared/services/lines/LineService';
import Breadcrumb from '../../mics/Breadcrumb';
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { Status, ToasterTypeConstants, TypeConstants } from "../../../shared/utilities/GlobalConstrants";

import Select from 'react-select'
import withAuth from '../../../shared/hoc/AuthComponent';
import { UserService } from '../../../shared/services/users/UserService';
import { withRouter } from '../../../shared/hoc/withRouter';

import { ProductionLineService } from '../../../shared/services/productionLines/ProductionLineService';
import { Link } from 'react-router-dom';

export class ProductionAdd extends Component {
    constructor(props) {
        super(props)
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0'+(today.getMonth() + 1) :(today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0'+ today.getDate() : today.getDate();
        var curTime = today.getFullYear()+"-" + month + "-" + date;

        this.state = {
            lines: [],
            lineTypes: [],
            statusList: [],
            lineId: 0,
            users: [],
            lineLeaderUserId: 0,
            sortOrder: "",
            date: curTime,
            requisitionNo: "",
            manpower: "",
            manpowerPresent: "",
            manpowerAbsent: "",
            colors: [],
            colorId: 0,
            status: '',
            type: '',

            //validation
            error: {
                lineId: '',
                lineLeaderUserId: '',
                sortOrder: '',
                date: '',
                manpower: "",
                manpowerPresent: "",
                manpowerAbsent: "",
                colorId: "",
                status: '',
                type: ''
            }
        }
    }

    componentDidMount = async () => {


        const colorList = [
            {
                value: 1,
                label: 'Red'
            },
            {
                value: 2,
                label: 'Blue'
            },
            {
                value: 3,
                label: 'Green'
            }
        ];
        const { Id, type, status } = this.props.useParams;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        const filter = { ProductionId: Id, LineType: type }
        //get station list for ddl
        let line = await this.getLineList(resToken.token);
        let user = await this.getUserList(resToken.token);
        this.getStatusList();
        this.getLineTypeList();

        let productionLineDetails = await this.getProductionLineDetails(filter, resToken.token);
        if (productionLineDetails != null) {
            this.setState({
                lineId: productionLineDetails.lineId,
                lineLeaderUserId: productionLineDetails.lineLeaderUserId,
                manpower: productionLineDetails.manpower,
                manpowerPresent: productionLineDetails.manpowerPresent,
                manpowerAbsent: productionLineDetails.manpowerAbsent,
                colorId: productionLineDetails.colorId,
                productionId: productionLineDetails.productionId
            })
        }
        this.setState({
            lines: line.data,
            users: user.data,
            colors: colorList,
            productionId: Id,
            type: type,
            status: status
        })
    }
    getProductionLineDetails = async (filter, token) => {

        const res = await ProductionLineService.getDetailsByProductionId(filter, token);

        return res.data;

    };

    getLineList = async (token) => {

        let filteredList = await LineService.GetDropdownList(token);

        return filteredList;
    }
    getUserList = async (token) => {

        let filteredList = await UserService.GetDropdownList(token);

        return filteredList;
    }
    getStatusList = () => {
        let statusList = [];

        Object.values(Status).forEach(val => {
            statusList.push(val);
        });
        this.setState({
            statusList: statusList
        })
    }
    getLineTypeList = () => {
        let lineTypes = [];

        Object.values(TypeConstants).forEach(val => {
            lineTypes.push(val);
        });

        this.setState({
            lineTypes: lineTypes
        })
    }
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
        this.formValidationObject('manpower', this.state.manpower.toString());
        this.formValidationObject('manpowerPresent', this.state.manpowerPresent.toString());
       // this.formValidationObject('manpowerAbsent', this.state.manpowerAbsent.toString());
        this.formValidationObject('status', this.state.status);
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
            case "Manpower":
                error.manpower = !value.length || value === '' ? "Manpower User is Required" : "";
                break;
            case "manpowerPresent":
                error.manpowerPresent = !value.length || value === '' ? "man power Present is Required" : "";
                break;
            case "manpowerAbsent":
                error.manpowerAbsent = !value.length || value === '' ? "Man power Absent is Required" : "";
                break;
            case "status":
                error.status = !value.length || value === '' ? "Status is Required" : "";
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

        const { status, type, productionId, lineId, lineLeaderUserId, date, manpower, manpowerPresent, manpowerAbsent, colorId } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            LineId: lineId,
            LineLeaderUserId: lineLeaderUserId,
            ProductionDate: date,
            Manpower: manpower,
            ManpowerPresent: manpowerPresent,
            ManpowerAbsent: manpowerAbsent,
            IsActive: true,
            ColorId: colorId,
            ProductionId: productionId,
            Status: status,
            Type: type
        }

        const res = await ProductionLineService.Add(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                lineId: "",
                lineLeaderUserId: "",
                lineLeaderUserId: 0,
                sortOrder: "",
                date: "",
                manpower: "",
                manpowerPresent: "",
                manpowerAbsent: "",
                requisitionId: 0,
                colorId: 0,
                status: '',
                type: ''
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            // this.props.navigate(`/production`, { replace: true });
            this.props.navigate(`/production/edit/`+ productionId, { replace: true });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

    };


    render() {
        const { colorId, colors, lines, lineId,
            error, lineLeaderUserId, users, date, manpower, manpowerPresent, manpowerAbsent,
            status, statusList, lineTypes, type, productionId } = this.state;
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
                            threeLayerLink: "/production",
                        }}
                    />

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">
                                <form className="form-elements-wrapper" onSubmit={this.handleSubmit} noValidate>
                                    <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                        <div className="row">
                                            {/* <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b>Status</b> </label>
                                                    <select className="form-control" name="status" id="status" onChange={this.handleInputChange} value={status}>
                                                        <option value=""> Select One</option>
                                                        {statusList.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.status.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.lineId}</div>
                                                    )}

                                                </div>
                                            </div> */}
                                            {/* <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b>Color</b> </label>
                                                    <select className="form-control" name="colorId" id="colorId" onChange={this.handleInputChange} value={colorId}>
                                                        <option value='0'> Select One</option>
                                                        {colors.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.colorId.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.colorId}</div>
                                                    )}

                                                </div>
                                            </div> */}
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
                                        {status == "OnGoing" &&
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
                                        }
                                        {/* <div className="row">
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

                                        </div> */}
                                        {/* <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b> Type </b> </label>
                                                    <select className="form-control" name="type" id="type" onChange={this.handleInputChange} value={type}>
                                                        <option value='0'> Select One</option>
                                                        {lineTypes.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.type.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.colorId}</div>
                                                    )}

                                                </div>
                                            </div>
                                        </div> */}
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className=" button-group d-flex justify-content-left flex-wrap">
                                                    <div className="col-md-3">
                                                        <button className="main-btn primary-btn btn-hover w-60 text-center" type="submit"> Submit </button>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <Link
                                                            to={`/production/edit/` + productionId}
                                                            className="main-btn warning-btn btn-hover w-60 text-center"
                                                        >
                                                            Close
                                                        </Link>
                                                    </div>
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

export default withAuth(withRouter(ProductionAdd));
