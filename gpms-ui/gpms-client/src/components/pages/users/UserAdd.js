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
import { RoleService } from "../../../shared/services/roles/RoleService";
import { UserService } from "../../../shared/services/users/UserService";

export class UserAdd extends Component {
    state = {
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        roleId: "",
        roles: [],
        address: "",
        password: "",

        //validation
        error: {
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            roleId: '',
            address: "",
            password:""
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
        this.formValidationObject('firstName', this.state.firstName);
        this.formValidationObject('lastName', this.state.lastName);
        this.formValidationObject('email', this.state.email);
        this.formValidationObject('address', this.state.address);
        this.formValidationObject('password', this.state.password);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "name":
                error.name = !value.length || value === '' ? "Name is Required" : "";
                break;
            case "firstName":
                error.firstName = !value.length || value === '' ? "First Name is Required" : "";
                break;
            case "lastName":
                error.lastName = !value.length || value === '' ? "Last Name is Required" : "";
                break;
            case "email":
                error.type = !value.length || value === '' ? "Email is Required" : "";
                break;
            case "address":
                error.type = !value.length || value === '' ? "Address is Required" : "";
                break;
            case "password":
                error.type = !value.length || value === '' ? "Password is Required" : "";
                break;
            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };
    componentDidMount = () => {
        this.getRoleList();
    }

    getRoleList = async () => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const res = await RoleService.GetDropdownList(resToken.token)
        this.setState({
            roles: res.data
        })
    }


    handleSubmit = async (e) => {
        e.preventDefault();
        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }

        const { name, firstName, lastName, email, address, roleId, password } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            UserName: name,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Password: password,
            Address: address,
            RoleId: roleId,
            IsActive: true
        }

        const res = await UserService.Add(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                name: "",
                firstName: "",
                lastName: "",
                email: "",
                address: "",
                roleId: "",
                password:""
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            this.props.navigate(`/user`, { replace: true });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

    };
    render() {
        const { name, firstName, lastName, email, error, roleId, roles, address, password } = this.state;
        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Add User",
                            title: "User Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "users",
                            threeLayerLink: "/user",
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
                                                        <b>First Name</b>
                                                    </label>
                                                    <input type="text" name="firstName" id="firstName" value={firstName} onChange={this.handleInputChange} />

                                                    {error.firstName.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.firstName}</div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Last Name</b>
                                                    </label>
                                                    <input type="text" name="lastName" id="lastName" value={lastName} onChange={this.handleInputChange} />

                                                    {error.lastName.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.lastName}</div>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Email</b>
                                                    </label>
                                                    <input type="text" name="email" id="email" value={email} onChange={this.handleInputChange} />

                                                    {error.email.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.email}</div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Address</b>
                                                    </label>
                                                    <input type="text" name="address" id="address" value={address} onChange={this.handleInputChange} />

                                                    {error.address.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.lastName}</div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                      
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>User Name</b>
                                                    </label>
                                                    <input type="text" name="name" id="name" value={this.state.name} onChange={this.handleInputChange} autoComplete="off" />

                                                    {error.name.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.itemname}</div>
                                                    )}

                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Password</b>
                                                    </label>
                                                    <input type="password" name="password" id="password" value={password} onChange={this.handleInputChange} autoComplete="off" />

                                                    {error.password.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.itemname}</div>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b>Role</b> </label>
                                                    <select className="form-control" name="roleId" id="roleId" onChange={this.handleInputChange} value={roleId}>
                                                        <option value={0}> Select One</option>
                                                        {roles.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                    {error.roleId.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.roleId}</div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Password</b>
                                                    </label>
                                                    <input type="password" name="password" id="password" value={password} onChange={this.handleInputChange} autoComplete="off" />

                                                    {error.password.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.itemname}</div>
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

export default withAuth(UserAdd);
