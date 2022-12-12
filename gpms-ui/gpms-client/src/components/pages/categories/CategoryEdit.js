import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { CategoryService } from "../../../shared/services/categories/CategoryService";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import withAuth from "../../../shared/hoc/AuthComponent";
import { withRouter } from "../../../shared/hoc/withRouter";

export class CategoryEdit extends Component {
  state = {
    itemname: "",
    remarks: "",

    //validation
    error: {
      itemname: '',
      remarks: ""
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
    this.formValidationObject('itemname', this.state.itemname);
    this.formValidationObject('remarks', this.state.remarks);
  }

  formValidationObject = (name, value) => {
    let error = this.state.error;
    switch (name) {
      case "itemname":
        error.itemname = !value.length || value === '' ? "Name is Required" : "";
        break;
      case "remarks":
        error.remarks = !value.length || value === '' ? "Remarks is Required" : "";
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

    let categoryDetails = await this.getCategoryDetails(Id, resToken.token);
    console.log(categoryDetails);

    this.setState(
        {
            id: Id,
            itemname: categoryDetails.name,
            remarks: categoryDetails.note,
        }
    )
}
getCategoryDetails = async (Id, token) => {

  const res = await CategoryService.GetDetailsById(Id, token);

  return res.data;

};


  handleSubmit = async (e) => {
    e.preventDefault();
    this.validateFormOnLoginSubmit();
    if (!ValidateForm(this.state.error)) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
      return;
    }

    const { itemname, remarks, id } = this.state;
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }

    const model = {
      Id: id,
      Name: itemname,
      Note: remarks,
      IsActive: true
    }

    const res = await CategoryService.Edit(model, resToken.token);

    if (res.response.isSuccess) {
      this.setState({
        itemname: "",
        remarks: "",
      })
      Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
      this.props.navigate(`/category`, { replace: true });
      return;
    }

    Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

  };
  render() {
    const { itemname, remarks, error } = this.state;
    return (
      <Fragment>
        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "Add Category",
              title: "Category Add",
              isDashboardMenu: false,
              isThreeLayer: true,
              threeLayerTitle: "Categories",
              threeLayerLink: "/category",
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
                            <b>Item Name</b>
                          </label>
                          <input type="text" name="itemname" id="itemname" value={this.state.itemname} onChange={this.handleInputChange} />

                          {error.itemname.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.itemname}</div>
                          )}

                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="input-style-1">
                          <label>
                            <b>Remarks</b>
                          </label>
                          <textarea
                            rows="3"
                            name="remarks"
                            id="remarks"
                            value={this.state.remarks}
                            onChange={this.handleInputChange}
                          >
                          </textarea>
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

export default withAuth(withRouter(CategoryEdit));
