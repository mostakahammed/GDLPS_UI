import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { BrandService } from "../../../shared/services/brands/BrandService";
import withAuth from "../../../shared/hoc/AuthComponent";
import { withRouter } from "../../../shared/hoc/withRouter";

export class BrandEdit extends Component {
  state = {
    name: "",
    note: "",

    //validation
    error: {
      name: '',
      note: ''
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
    this.formValidationObject('note', this.state.note);
  }

  formValidationObject = (name, value) => {
    let error = this.state.error;
    switch (name) {
      case "name":
        error.name = !value.length || value === '' ? "Name is Required" : "";
        break;
      case "note":
        error.note = !value.length || value === '' ? "Note is Required" : "";
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

      let brandDetails = await this.getBrandDetails(Id, resToken.token);

      this.setState(
        {
          id: Id,
          name: brandDetails.name,
          note: brandDetails.note,
        }
      )
    }
    getBrandDetails = async (Id, token) => {

      const res = await BrandService.GetDetailsById(Id, token);

      return res.data;

    };


    handleSubmit = async (e) => {
      e.preventDefault();
      this.validateFormOnLoginSubmit();
      if (!ValidateForm(this.state.error)) {
        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
        return;
      }

      const { name, note, id } = this.state;
      let resToken = AuthenticationService.GetToken();
      if (!resToken.isSuccess) {
        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
        return;
      }

      const model = {
        Id: id,
        Name: name,
        Note: note,
      }

      const res = await BrandService.Edit(model, resToken.token);

      if (res.response.isSuccess) {
        this.setState({
          name: "",
          note: "",
        })
        Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
        this.props.navigate(`/brand`, { replace: true });
        return;
      }

      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });


    };
    render() {
      const { name, note, error } = this.state;
      return (
        <Fragment>
          <div className="container-fluid">
            <Breadcrumb
              BreadcrumbParams={{
                header: "Add Brand",
                title: "Brand Add",
                isDashboardMenu: false,
                isThreeLayer: true,
                threeLayerTitle: "Brands",
                threeLayerLink: "/brand",
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
                              <b>Note</b>
                            </label>
                            <input type="text" name="note" id="note" value={note} onChange={this.handleInputChange} />
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

export default withAuth(withRouter(BrandEdit));
