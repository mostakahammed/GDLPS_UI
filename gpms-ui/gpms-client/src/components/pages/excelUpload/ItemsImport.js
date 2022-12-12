import React, { Component } from "react";
import { Fragment } from "react/cjs/react.production.min";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { LineTypeConstants, ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { ItemService } from '../../../shared/services/items/ItemService';
import withAuth from "../../../shared/hoc/AuthComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../../shared/hoc/withRouter";


class ItemsImport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnUploadText: ' Upload',
      isUploading: false,
      file: '',
      errorMsgList: [],
      models: [],
    };
  }


  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.state.file) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Please Upload valid File." });
      return;
    }

    this.setState({
      isUploading: true,
      btnUploadText: ' Uploading...',
  
    })

    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
      return;
    }

    const formData = new FormData();
    formData.append('Items', this.state.file, this.state.file.name);

    const res = await ItemService.ImportExcelFile(formData, resToken.token);

    if (!res.isSuccess) {
      this.setState({
        isUploading: false,
        btnUploadText: ' Upload',
        file: '',
        errorMsgList: []
      })
      if (res.error.length > 0) {
        this.setState({
          errorMsgList: res.error,
          file: '',
        })
      }
     
      Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.message });
      this.setState({
        file: '',
      })
      return;
    }

    if (res.isSuccess) {
      this.setState({
        file: '',
        errorMsgList: [],
        isUploading: false,
        btnUploadText: ' Upload'
      })

      Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.message });
      this.props.navigate(`/storeInItem`, { replace: true });
      return;
    }
    // this.setState({
    //   file: '',
    // })
    // Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.message });

  }


  setFile(e) {
    this.setState({ file: e.target.files[0] });
  }
  render() {
    const { errorMsgList, isUploading, btnUploadText } = this.state;
    const toggleBtnDisable = isUploading ? "disbaled" : "";

    return (

      <Fragment>
        <div className="container-fluid">
          <Breadcrumb
            BreadcrumbParams={{
              header: "File Upload",
              title: "Upload File",
              isDashboardMenu: false,
              isThreeLayer: true,
              threeLayerTitle: "Items",
              threeLayerLink: "/item",
            }}
          />

          <div className="row">
            <div className="col-xl-12 col-lg-12 col-sm-12">
              <div className="row align-items-center">

                <form className="form-elements-wrapper" onSubmit={this.handleSubmit} noValidate>
                  <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="input-style-1">
                          <label>
                            <b>Upload file</b>
                          </label>
                          <input type="file" onChange={e => this.setFile(e)} />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className=" button-group d-flex justify-content-left flex-wrap">
                          <button disabled={toggleBtnDisable} className="main-btn primary-btn btn-hover w-60 text-center" type="submit"  > <FontAwesomeIcon icon={faCloudArrowUp} />{btnUploadText} </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

              </div>

            </div>
          </div>

          {
            errorMsgList.length > 0 &&
            (
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-sm-12">
                  <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                    <div className="table-wrapper table-responsive">
                      <table className="table table-striped table-hover">
                        <thead style={{ background: 'Red', color: 'black', fontSize: 'small' }}>
                          <tr>
                            <th>Sl</th>
                            <th> Error </th>
                          </tr>
                        </thead>
                        <tbody>

                          {
                            errorMsgList.map((cItem, index) => {
                              return (
                                <tr key={index}>
                                  <th>{index + 1}</th>
                                  <td>{cItem}</td>
                                </tr>

                              )
                            })
                          }
                        </tbody>

                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>




      </Fragment>

    )
  }
}
export default withAuth(withRouter(ItemsImport))
