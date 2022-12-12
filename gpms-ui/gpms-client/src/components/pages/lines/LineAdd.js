import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { LineTypeConstants, ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineService } from "../../../shared/services/lines/LineService";
import withAuth from "../../../shared/hoc/AuthComponent";
import { withRouter } from "../../../shared/hoc/withRouter";

export class LineAdd extends Component {
  state = {
    name: "",
    type: "",
    lineTypes: [],
    lineNumber:'',
    numbers:[],

    //validation
    error: {
      name: '',
      type: '',
      lineNumber:''
    }
  };
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.getLineTypeList();

    const numbers=[
      // {
      //   label:'0',
      //   value:0
      // },
      {
        label:'1',
        value:1
      },
      {
        label:'2',
        value:2
      },
      {
        label:'3',
        value:3
      },
      {
        label:'4',
        value:4
      },
      {
        label:'5',
        value:5
      },
      {
        label:'6',
        value:6
      },
      {
        label:'7',
        value:7
      },
      {
        label:'8',
        value:8
      },
      {
        label:'9',
        value:9
      }

    ]
    this.setState({
      numbers:numbers
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

  validateFormOnLoginSubmit = () => {
    this.formValidationObject('name', this.state.name);
    this.formValidationObject('type', this.state.type);
    this.formValidationObject('lineNumber', this.state.lineNumber);
    
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
        case "lineNumber":
        error.type = !value.length || value === '' ? "Line Number is Required" : "";
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

    const { name, type, lineNumber } = this.state;
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }

    const model = {
      Name: name,
      Type: type,
      LineNumber:lineNumber,
      IsActive: true
    }

    const res = await LineService.Add(model, resToken.token);

    if (res.response.isSuccess) {
      this.setState({
        name: "",
        type: "",
        lineNumber:''
      })
      Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
      this.props.navigate(`/line`, { replace: true });
      return;
    }

    Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });


  };
  render() {
    const { name, type, lineTypes, error,lineNumber,numbers } = this.state;

    return (
      <Fragment>
        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "Add Line",
              title: "Line Add",
              isDashboardMenu: false,
              isThreeLayer: true,
              threeLayerTitle: "Lines",
              threeLayerLink: "/line",
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
                            <b>Line Name</b>
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
                            <option value>Select One</option>
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
                            <b>Line Number</b>
                          </label>

                          <select className="form-control" name="lineNumber" id="lineNumber" onChange={this.handleInputChange} value={lineNumber}>
                            <option value>Select One</option>
                            {numbers.map((item, index) => {
                              return (
                                <option key={index} value={item.value}>{item.label}</option>
                              )
                            })}
                          </select>
                          {error.lineNumber.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.lineNumber}</div>
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

export default withAuth(withRouter(LineAdd));
