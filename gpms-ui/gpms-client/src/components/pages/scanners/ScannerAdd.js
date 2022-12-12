import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { LineTypeConstants, ScannerTypeConstants, ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { StationService } from "../../../shared/services/stations/StationService";
import { ScannerService } from "../../../shared/services/scanners/ScannerService";


export class ScannerAdd extends Component {
  state = {
    name: "",
    type: "",
    scannerTypes: [],

    //validation
    error: {
      name: '',
      type: ''
    }
  };
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.getTypeList()
  }

  getTypeList = () => {
    let scannerTypes = [];

    Object.values(ScannerTypeConstants).forEach(val => {
      scannerTypes.push(val);
    });

    this.setState({
      scannerTypes: scannerTypes
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
    this.formValidationObject('name', this.state.name);
    this.formValidationObject('type', this.state.type);
  }

  formValidationObject = (name, value) => {
    let error = this.state.error;
    switch (name) {
      case "name":
        error.name = !value.length || value === '' ? "Name is Required" : "";
        break;
      case "type":
        error.type = !value.length || value === '' ? "Type is Required" : "";
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

    const { name, type } = this.state;
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }
    var typeVal = false;
    if (type == "yes") typeVal = true;
    else typeVal = false;

    const model = {
      Name: name,
      Type: typeVal,
      IsActive: true
    }

    const res = await ScannerService.Add(model, resToken.token);

    if (res.response.isSuccess) {
      this.setState({
        name: "",
        type: "",
      })
      Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
      return;
    }

    Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });


  };
  render() {
    const { name, type, scannerTypes, error } = this.state;

    return (
      <Fragment>
        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "Add Scanner",
              title: "Scanner Add",
              isDashboardMenu: false,
              isThreeLayer: true,
              threeLayerTitle: "Scanners",
              threeLayerLink: "/scanner",
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
                            <b>Station Name</b>
                          </label>
                          <input type="text" name="name" id="name" value={name} onChange={this.handleInputChange} />

                          {error.name.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.name}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Type</b>
                          </label>

                          <select className="form-control" name="type" id="type" onChange={this.handleInputChange} value={type}>
                            <option value> Select One</option>
                            {scannerTypes.map((item, index) => {
                              return (
                                <option key={index} value={item}>{item}</option>
                              )
                            })}
                          </select>
                          {error.type.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.type}</div>
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
    );
  }
}

export default ScannerAdd;
