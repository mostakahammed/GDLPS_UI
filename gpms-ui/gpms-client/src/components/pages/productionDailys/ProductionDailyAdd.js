import React, { Component, Fragment } from 'react'
import { LineService } from '../../../shared/services/lines/LineService';
import Breadcrumb from '../../mics/Breadcrumb';
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineStationService } from '../../../shared/services/lineStation/LineStationService';
import { StationService } from '../../../shared/services/stations/StationService';
import { ProductionDailyService } from '../../../shared/services/productionDailys/ProductionDailyService';

export class ProductionDailyAdd extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lines: [],
            lineTypes: [],
            lineId: 0,
            stations: [],
            stationId: 0,
            date: '',
            remarks: '',


            //validation
            error: {

                lineId: '',
                stationId: '',
                sortOrder: ''
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
        let line = await this.getLineList(resToken.token).then(res => { return res });
        let station = await this.getStationList(resToken.token).then(res => { return res });

        this.setState({
            lines: line.data,
            stations: station.data
        })
    }

    getLineList = async (token) => {

        let filteredList = await LineService.GetDropdownList(token);
    
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
        // this.formValidationObject('name', this.state.name);
        // this.formValidationObject('color', this.state.color);
        // this.formValidationObject('code', this.state.code);
        // this.formValidationObject('type', this.state.type);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "lineId":
                error.lineId = !value.length || value === '' ? "line is Required" : "";
                break;
            case "stationId":
                error.stationId = !value.length || value === '' ? "Station is Required" : "";
                break;
            case "date":
                error.date = !value.length || value === '' ? "date is Required" : "";
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

        const { lineId, stationId, date, remarks } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            LineId: lineId,
            StationId: stationId,
            Date: date,
            Remarks: remarks,
            IsActive: true
        }

        const res = await ProductionDailyService.Add(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                lineId: "",
                stationId: "",
                date: "",
                remarks: ""
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

    };

    render() {
        const { lines, stations, lineId, stationId, date, remarks, error } = this.state;
        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Add Production Daily",
                            title: "Production Daily Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Production Dailys",
                            threeLayerLink: "/productionDaily",
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
                                                    <label><b>Line</b> </label>
                                                    <select className="form-control" name="lineId" id="lineId" onChange={this.handleInputChange} value={lineId}>
                                                        <option value> Select One</option>
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
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b>Station</b> </label>
                                                    <select className="form-control" name="stationId" id="stationId" onChange={this.handleInputChange} value={stationId}>
                                                        <option value> Select One</option>
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
                                                        <b>Date</b>
                                                    </label>
                                                    <input type="date" name="date" id="date" value={date} onChange={this.handleInputChange} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Remarks</b>
                                                    </label>
                                                    <input type="text" name="remarks" id="remarks" value={remarks} onChange={this.handleInputChange} />
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

export default ProductionDailyAdd
