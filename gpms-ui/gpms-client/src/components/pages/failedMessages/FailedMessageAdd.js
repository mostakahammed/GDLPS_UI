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
import FailedMessage from './FailedMessage';
import { FailedMessageCategoryService } from '../../../shared/services/failedMessageCategories/FailedMessageCategoryService';
import { FailedMessageService } from '../../../shared/services/failedMessages/FailedMessageService';
import { withRouter } from '../../../shared/hoc/withRouter';

export class FailedMessageAdd extends Component {
    constructor(props) {
        super(props)

        this.state = {
            failedCategories: [],
            lineTypes: [],
            categoryId: 0,
            stations: [],
            stationId: 0,
            message: "",

            //validation
            error: {
                categoryId: '',
                stationId: '',
                message: ''
            }
        }
    }

    componentDidMount = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        //get station list for ddl
        let failedCategory = await this.getfailedCategoryList(resToken.token);
        let station = await this.getStationList(resToken.token);

        this.setState({
            failedCategories: failedCategory.data,
            stations: station.data
        })
    }

    getfailedCategoryList = async (token) => {

        let filteredList = await FailedMessageCategoryService.GetDropdownList(token);

        return filteredList;
    }
    getStationList = async (token) => {

        let filteredList = await StationService.GetDropdownList(token);

        return filteredList;
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
        this.formValidationObject('categoryId', this.state.categoryId);
        this.formValidationObject('stationId', this.state.stationId);
        this.formValidationObject('message', this.state.message);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "categoryId":
                error.categoryId = !value.length || value === '' ? "line is Required" : "";
                break;
            case "stationId":
                error.stationId = !value.length || value === '' ? "Type is Required" : "";
                break;
            case "message":
                error.message = !value.length || value === '' ? "Sort Order is Required" : "";
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

        const { categoryId, stationId, message } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            failedCategoryId: categoryId,
            StationId: stationId,
            Message: message,
            IsActive: true
        }

        const res = await FailedMessageService.Add(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                categoryId: "",
                stationId: "",
                message: "",
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            this.props.navigate(`/failedMessage`, { replace: true });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });


    };


    render() {
        const { lines, stations, categoryId, stationId, message, error,failedCategories } = this.state;   
        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Add Failed Messasge",
                            title: "failed Message Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Failed Messages",
                            threeLayerLink: "/failedMessage",
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
                                                    <label><b>Category</b> </label>
                                                    <select className="form-control" name="categoryId" id="categoryId" onChange={this.handleInputChange} value={categoryId}>
                                                        <option value=""> Select One</option>
                                                        {failedCategories.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.categoryId.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.categoryId}</div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b>Station</b> </label>
                                                    <select className="form-control" name="stationId" id="stationId" onChange={this.handleInputChange} value={stationId}>
                                                        <option value=""> Select One</option>
                                                        {stations && stations.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.stationId.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.stationId}</div>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Message</b>
                                                    </label>
                                                    <input type="text" name="message" id="message" value={message} onChange={this.handleInputChange} />

                                                    {error.message.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.message}</div>
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

export default withAuth(withRouter(FailedMessageAdd))
