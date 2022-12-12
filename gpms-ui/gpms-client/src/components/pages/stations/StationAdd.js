import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { LineTypeConstants, ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { StationService } from "../../../shared/services/stations/StationService";
import withAuth from "../../../shared/hoc/AuthComponent";
import { withRouter } from "../../../shared/hoc/withRouter";
import Select from 'react-select'


export class StationAdd extends Component {
  state = {
    name: "",
    type: "",
    lineTypes: [],
    alias: "",
    actionType: "",
    actionTypes: [],
    sortOrder: '',
    searchTypes: [],
    searchType: '',
    options: [],
    selected: '',
    roles:[],

    //validation
    error: {
      name: '',
      type: '',
      alias: '',
      actionType: '',
      sortOrder: '',
      searchTypes: [],
      searchType: '',
    }
  };
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.getLineTypeList();

    const actionTypes = [
      {
        value: 'OnlyPass',
        label: 'Only Pass'
      },
      {
        value: 'PassAndFail',
        label: 'Pass And Fail'
      },
      {
        value: 'Onlyfail',
        label: 'Only fail'
      }
    ];
    const searchTypes = [
      {
        value: 'Code',
        label: 'Code'
      },
      {
        value: 'IMEI',
        label: 'IMEI'
      }
    ];
    // const options = [
    //   { label: "Grapes 🍇", value: "grapes" },
    //   { label: "Mango 🥭", value: "mango" },
    //   { label: "Strawberry 🍓", value: "strawberry", disabled: true },
    // ];

    this.setState({
      actionTypes: actionTypes,
      searchTypes: searchTypes
    })
  }

  getLineTypeList = () => {
    let lineTypes = [];

    Object.values(LineTypeConstants).forEach(val => {
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
  handleInputChangeMultiselect = (event) => {
  
    this.setState({
      roles: event
    })
 
  };

  validateFormOnLoginSubmit = () => {
    this.formValidationObject('name', this.state.name);
    this.formValidationObject('type', this.state.type);
    this.formValidationObject('alias', this.state.type);
    this.formValidationObject('actionType', this.state.type);
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
      case "alias":
        error.type = !value.length || value === '' ? "Alias is Required" : "";
        break;
      case "actionType":
        error.actionType = !value.length || value === '' ? "Action Type is Required" : "";
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

    const { name, type, alias, actionType, sortOrder, searchType } = this.state;
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }

    const model = {
      Name: name,
      Type: type,
      IsActive: true,
      Alias: alias,
      ActionType: actionType,
      SortOrder: sortOrder,
      SearchType: searchType
    }

    const res = await StationService.Add(model, resToken.token);

    if (res.response.isSuccess) {
      this.setState({
        name: "",
        type: "",
        alias: "",
        actionType: "",
        sortOrder: ''
      })
      Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
      this.props.navigate(`/station`, { replace: true });
      return;
    }

    Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

  };
  render() {
    const { name, type, lineTypes, error, alias, actionType, actionTypes, sortOrder,
      searchTypes, searchType, options, selected,roles } = this.state;
      console.log(this.state.roles);
   
    return (
      <Fragment>
        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "Add Station",
              title: "Station Add",
              isDashboardMenu: false,
              isThreeLayer: true,
              threeLayerTitle: "Stations",
              threeLayerLink: "/station",
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
                            <option value=""> Select One</option>
                            {lineTypes.map((item, index) => {
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
                        <div className="input-style-1">
                          <label>
                            <b>Alias</b>
                          </label>
                          <input type="text" name="alias" id="alias" value={alias} onChange={this.handleInputChange} />

                          {error.alias.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.alias}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Action Type</b>
                          </label>

                          <select className="form-control" name="actionType" id="actionType" onChange={this.handleInputChange} value={actionType}>
                            <option value=""> Select One</option>
                            {actionTypes.map((item, index) => {
                              return (
                                <option key={index} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>
                          {/* {error.actiontype.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.type}</div>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Search Type</b>
                          </label>

                          <select className="form-control" name="searchType" id="searchType" onChange={this.handleInputChange} value={searchType}>
                            <option value=""> Select One</option>
                            {searchTypes.map((item, index) => {
                              return (
                                <option key={index} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>
                          {/* {error.actiontype.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.type}</div>
                          )} */}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b> Sort Order</b>
                          </label>
                          <input type="text" name="sortOrder" id="sortOrder" value={sortOrder} onChange={this.handleInputChange} />
                          {error.sortOrder.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.sortOrder}</div>
                          )}
                        </div>
                      </div>
                      {/* <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Search Type</b>
                          </label>
                          <Select
                            defaultValue={[options[2], options[3]]}
                            isMulti
                            name="selected"
                            options={options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange = {this.handleInputChangeMultiselect}
                          />
                        
                        </div>
                      </div> */}
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

export default withAuth(withRouter(StationAdd));
