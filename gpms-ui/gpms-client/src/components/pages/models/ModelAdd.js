import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { ModelService } from "../../../shared/services/models/ModelService";
import withAuth from "../../../shared/hoc/AuthComponent";
import { withRouter } from "../../../shared/hoc/withRouter";
import { ColorService } from "../../../shared/services/colors/ColorService";

export class ModelAdd extends Component {
  state = {
    name: "",
    color: "",
    code: "",
    type: "",
    colors: [],
    colorId: '',
    sysTypes: [],
    sysName: '',
    projectName: '',
    mblTypes: [],
    lot: '',

    //validation
    error: {
      name: '',
      colorId: '',
      code: '',
      type: '',
      lot: '',
      sysName: ''
    }
  };
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    let resToken = AuthenticationService.GetToken();

    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }
    const sysTypes = [{
      value: 'XOLO',
      label: 'XOLO'
    },
    {
      value: 'EMES',
      label: 'EMES'
    }
    ]
    const mblTypes = [{
      value: 'Smart',
      label: 'Smart'
    },
    {
      value: 'Feature',
      label: 'Feature'
    }
    ]
    let color = await this.getColorList(resToken.token);

    this.setState({
      colors: color.data,
      sysTypes: sysTypes,
      mblTypes: mblTypes
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
    this.formValidationObject('colorId', this.state.colorId);
    this.formValidationObject('code', this.state.code);
    this.formValidationObject('type', this.state.type);
    this.formValidationObject('lot', this.state.type);
    this.formValidationObject('sysName', this.state.sysName);

  }

  formValidationObject = (name, value) => {
    let error = this.state.error;
    switch (name) {
      case "name":
        error.name = !value.length || value === '' ? "Name is Required" : "";
        break;
      case "colorId":
        error.colorId = !value.length || value === '' ? "Color is Required" : "";
        break;
      case "type":
        error.type = !value.length || value === '' ? "Type is Required" : "";
        break;
      case "lot":
        error.lot = !value.length || value === '' ? "Lot is Required" : "";
        break;
      case "sysName":
        error.sysName = !value.length || value === '' ? "System is Required" : "";
        break;
      default:
        break;
    }

    this.setState({
      error,
      [name]: value
    })
  };

  getColorList = async (token) => {

    let filteredList = await ColorService.GetDropdownList(token);

    return filteredList;
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.validateFormOnLoginSubmit();
    if (!ValidateForm(this.state.error)) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
      return;
    }

    const { name, color, code, type, colorId, sysName, projectName, lot } = this.state;
    let resToken = AuthenticationService.GetToken();

    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }

    const model = {
      Name: name,
      ColorId: colorId,
      Code: code,
      Type: type,
      System: sysName,
      Project: projectName,
      Lot: lot,
      IsActive: true
    }

    const res = await ModelService.Add(model, resToken.token);

    if (res.response.isSuccess) {
      this.setState({
        name: "",
        color: "",
        code: "",
        type: "",
        sysName: "",
        projectName: "",
        lot: ''
      })
      Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
      this.props.navigate(`/model`, { replace: true });
      return;
    }

    Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

  };
  render() {
    const { name, colors, colorId, lot, code, type, error, sysTypes, sysName, projectName, mblTypes } = this.state;
    
    return (
      <Fragment>
        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "Add Model",
              title: "Model Add",
              isDashboardMenu: false,
              isThreeLayer: true,
              threeLayerTitle: "Models",
              threeLayerLink: "/model",
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
                            <b>Name</b>
                          </label>
                          <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleInputChange} />

                          {error.name.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.name}</div>
                          )}

                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label><b>Color</b> </label>
                          <select className="form-control" name="colorId" id="colorId" onChange={this.handleInputChange} value={colorId}>
                            <option value=''> Select One</option>
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
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Lot</b>
                          </label>
                          <input type="text" name="lot" id="lot" value={lot} onChange={this.handleInputChange} />

                          {error.lot.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.lot}</div>
                          )}

                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b> Project(XOLO) </b>
                          </label>
                          <input type="text" name="projectName" id="projectName" value={projectName} onChange={this.handleInputChange} />

                          {/* {error.code.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.code}</div>
                          )} */}

                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Code</b>
                          </label>
                          <input type="text" name="code" id="code" value={code} onChange={this.handleInputChange} />

                          {error.code.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.code}</div>
                          )}

                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Type</b>
                          </label>
                          {/* <input type="text" name="type" id="type" value={type} onChange={this.handleInputChange} /> */}
                          <select className="form-control" name="type" id="type" onChange={this.handleInputChange} value={type}>
                            <option value>Select One</option>
                            {mblTypes.map((item, index) => {
                              return (
                                <option key={index} value={item.value}>{item.label}</option>
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
                        <div className="input-style-1">
                          <label>
                            <b>System</b>
                          </label>

                          <select className="form-control" name="sysName" id="sysName" onChange={this.handleInputChange} value={sysName}>
                            <option value>Select One</option>
                            {sysTypes.map((item, index) => {
                              return (
                                <option key={index} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>
                          {error.sysName.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.sysName}</div>
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

export default withAuth(withRouter(ModelAdd));
