import React, { Component, Fragment } from 'react'
import { LineService } from '../../../shared/services/lines/LineService';
import Breadcrumb from '../../mics/Breadcrumb';
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineStationService } from '../../../shared/services/lineStation/LineStationService';
import { StationService } from '../../../shared/services/stations/StationService';
import { ScannerService } from '../../../shared/services/scanners/ScannerService';
import { StationScannerService } from '../../../shared/services/stationScanners/StationScannerService';

export class StationScannerAdd extends Component {
    constructor(props) {
        super(props)

        this.state = {
            scanners: [],
            lineTypes: [],
            scannerId: 0,
            stations: [],
            stationId: 0,


            //validation
            error: {  
                scannerId: '',
                stationId: ''
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
        let scanner= await this.getScannerList(resToken.token).then(res=>{return res});
        let station = await this.getStationList(resToken.token).then(res => { return res });

        this.setState({
            scanners: scanner.data,
            stations: station.data
        })
    }

    getScannerList= async(token)=>{

        let filteredList= await ScannerService.GetDropdownList(token);
    
        return filteredList
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
            case "scannerId":
                error.scannerId = !value.length || value === '' ? "line is Required" : "";
                break;
            case "stationId":
                error.stationId = !value.length || value === '' ? "Type is Required" : "";
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

        const {scannerId, stationId} = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            ScannerId: scannerId,
            StationID: stationId,
            IsActive: true
        }

        const res =  await StationScannerService.Add(model, resToken.token);

                if (res.response.isSuccess) {
                    this.setState({
                        LineId: "",
                        StationId: "",
                        SortOrder: "",
                    })
                    Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
                    return;
                }

                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

    };

    render() {
        const { scanners, stations, scannerId, stationId, error } = this.state;
        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Add Station Scanner",
                            title: "Station Scanner Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Station Scanners",
                            threeLayerLink: "/stationScanner",
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
                                                    <label><b>Scanner</b> </label>
                                                    <select className="form-control" name="scannerId" id="scannerId" onChange={this.handleInputChange} value={scannerId}>
                                                        <option value=""> Select One</option>
                                                        {scanners.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.scannerId.length > 0 && (
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

export default StationScannerAdd
