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
import { RoleService } from "../../../shared/services/roles/RoleService";

export class RoleEdit extends Component {
    state = {
        name: "",
        type: "",

        //validation
        error: {
            name: '',
            type: ""
        }
    };
    constructor(props) {
        super(props);
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
     //   this.formValidationObject('type', this.state.type);
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
    componentDidMount = async () => {

        const { Id } = this.props.useParams;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        let roleDetails = await this.getRoleDetails(Id, resToken.token);

        this.setState(
            {
                id: Id,
                name: roleDetails.name
            }
        )
    }
    getRoleDetails = async (Id, token) => {

        const res = await RoleService.GetDetailsById(Id, token);

        return res.data;

    };

    handleSubmit = async (e) => {
        e.preventDefault();
        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }

        const { name, type, id } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            Id: id,
            Name: name,
            IsActive: true
        }

        const res = await RoleService.Edit(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                name: "",
                type: "",
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            this.props.navigate(`/role`, { replace: true });
            return;
        }
        // this.props.navigate(`/modelRequisition`, { replace: true });
        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });


    };
    render() {
        const { name, type, lineTypes, error } = this.state;

        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Edit Role",
                            title: "Role Edit",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "roles",
                            threeLayerLink: "/role",
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
                                                        <b>Role Name</b>
                                                    </label>
                                                    <input type="text" name="name" id="name" value={name} onChange={this.handleInputChange} />

                                                    {error.name.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.name}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="row">
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
                    </div> */}
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

export default withAuth(withRouter(RoleEdit));
