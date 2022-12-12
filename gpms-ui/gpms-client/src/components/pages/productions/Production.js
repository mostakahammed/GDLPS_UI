import React, { Component } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import withAuth from "../../../shared/hoc/AuthComponent";
import { ProductionService } from "../../../shared/services/productions/ProductionService";
import { RequisitionService } from "../../../shared/services/requisitions/ResquisitionService";
import { faBank, faBarChart, faBarcode, faBoxOpen, faBuildingColumns, faMobileScreenButton, faPeopleCarryBox, faQrcode, faVcard } from "@fortawesome/free-solid-svg-icons";
import { withRouter } from "../../../shared/hoc/withRouter";

class Production extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalRows: 0,
      perPage: 10,
      currentPage: 1,
      columns: [
        {
          name: " Requisition Id",
          selector: (row) => row.requisitionId,
          sortable: true,
        },
        {
          name: " Start Time",
          selector: (row) => row.startTimeInText,
          sortable: true,
        },
        {
          name: "Status",
          selector: (row) => row.productionStatus,
          sortable: true,
        },

        {
          name: "View",
          cell: (row) => (
            <>
              <Link
                to={`/production/edit/` + row.id}
                className="btn btn-sm btn-primary m-1"
              >
                <FontAwesomeIcon icon={faVcard} />
              </Link>
               <button className="btn btn-sm btn-primary m-1" title="Generate QrCode"
                onClick={() => this.generateQRCode(row.id)}
              > <FontAwesomeIcon icon={faBarcode} />
              </button> 
            </>
          ),

        },
        // {
        //   name: "Logistic Approve",
        //   cell: (row) => {

        //     return row.productionStatus == "Production End" ? (
        //       <div>

        //         <button
        //           className="btn btn-sm info-btn"
        //           onClick={() => this.endProduction(row)}
        //         > <FontAwesomeIcon icon={faBoxOpen} />
        //         </button>
        //       </div>
        //     ) : (
        //       <></>
        //     );
        //   }
        // },
      ],
      data: [],
    };
  }

  componentDidMount = async () => {
    const defaultpage = 1;
    //get categories
    await this.getLines(defaultpage);
  };

  getLines = async (pageNumber, pageSize = this.state.perPage) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    let filter = { pageNumber, pageSize };
    this.setState({
      loading: true,
    });
    const res = await ProductionService.GetListByFilter(filter, resToken.token);

    this.setState({
      data: res.data,
      totalRows: res.searchFilter.totalCount,
      loading: false,
    });

  };

  endProduction = async (row) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }
    this.props.navigate(`/storeInItem`, { replace: true });
    let filter = { ProductionId: row.id };
    var res=await RequisitionService.EndProduction(filter, resToken.token);
    console.log(res);
    Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
  };


  handleDelete = (row) => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteRow(row);
          },
          className: "btn btn-sm btn-primary btn-yes-alert",
        },
        {
          label: "No",
          onClick: () => console.log("no"),
          className: "btn btn-sm btn-danger btn-no-alert",
        },
      ],
    });
  };
  generateQRCode = async (id) => {
         
    // let resToken = AuthenticationService.GetToken();
    // if (!resToken.isSuccess) {
    //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
    //     return;
    // }
    // let isExist = await ProductionService.GetDetailsByRequisitionId(row.id, resToken.token);

    // if (isExist.isSuccess) {
    //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Production Already started for this Requisition" });
    //     return;
    // }
     this.props.navigate(`/generateQRCode/${id}`, { replace: true });
    // this.props.navigate(`/production/add/${row.requisition.id}`, { replace: true });
  
   

};
  deleteRow = async (row) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    const res = await ProductionService.Delete(row.id, resToken.token);

    if (res.response.isSuccess) {
      const defaultpage = 1;
      //get categories
      this.getLines(defaultpage);
    }
    const type = res.response.isSuccess
      ? ToasterTypeConstants.Success
      : ToasterTypeConstants.Warning;

    Toaster.Notify({ type: type, message: res.response.message });

  };

  handlePageChange = async (page) => {
    await this.getLines(page);
    this.setState({
      currentPage: page,
    });
  };

  handlePerRowsChange = async (newPerPage, page) => {
    await this.getLines(page, newPerPage);
    this.setState({
      perPage: newPerPage,
    });
  };

  handleOnSort = (selectedColumn, sortDirection) => {
    console.log(selectedColumn.name);
    console.log(sortDirection);
  };

  render() {
    return (
      <div className="container-fluid">
        <Breadcrumb
          BreadcrumbParams={{
            header: "Production List",
            title: "Productions",
            isDashboardMenu: false,
            isThreeLayer: false,
            threeLayerTitle: "",
            threeLayerLink: "",
          }}
        />

        {/* <PageTopNavigator
          TopNavigator={{
            link: "",
            text: "",
            canShowIcon: false,

          }}
        /> */}

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-sm-12">
            <div className="tables-wrapper">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card-style mb-30">
                    <div className="table-wrapper table-responsive">
                      <DataTable
                        //title="Your Ttile"
                        className="table"
                        columns={this.state.columns}
                        data={this.state.data}
                        progressPending={this.props.loading}
                        pagination
                        paginationServer
                        paginationTotalRows={this.state.totalRows}
                        paginationDefaultPage={this.state.currentPage}
                        onChangeRowsPerPage={this.handlePerRowsChange}
                        onChangePage={this.handlePageChange}
                        onSort={this.handleOnSort}
                        //selectableRows
                        onSelectedRowsChange={({ selectedRows }) =>
                          console.log(selectedRows)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(withRouter(Production));
