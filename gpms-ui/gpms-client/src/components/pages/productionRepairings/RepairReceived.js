import React, { Component } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { CategoryService } from "../../../shared/services/categories/CategoryService";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineService } from "../../../shared/services/lines/LineService";
import withAuth from "../../../shared/hoc/AuthComponent";
import { ProductionService } from "../../../shared/services/productions/ProductionService";
import { ProductionLineService } from "../../../shared/services/productionLines/ProductionLineService";
import { ProductionRepairingService } from "../../../shared/services/productionRepairings/ProductionRepairingService";
import { faSearchDollar } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

class RepairReceived extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    var curTime = today.getFullYear() + "-" + month + "-" + date;
    this.state = {
      SearchTerm: '',
      date: curTime
      , error: {
        date: '',

      },
      totalRows: 0,
      perPage: 10,
      currentPage: 1,
      columns: [
        {
          name: "Code ",
          selector: (row) => row.productionDaily.productRefNum,
          sortable: true,
        },
        {
          name: "Create date",
          selector: (row) => row.createdOn,
          sortable: true,
        },

        {
          cell: (row) => (
            <>
              <Link
                to={`/productionLineQR/${row.id}`}
                className="btn btn-sm btn-primary m-1"
              >
                <FontAwesomeIcon icon="fa-solid fa-square-pen" />
              </Link>
              {/* <button
                className="btn btn-sm btn-danger"
                onClick={() => this.handleDelete(row)}
              >
                <FontAwesomeIcon icon="fa-solid fa-trash-can" />
              </button> */}
            </>
          ),
        },
      ],
      data: [],
    };
  }

  componentDidMount = async () => {
    const defaultpage = 1;
    //get categories
    await this.getLines(defaultpage);
  };

  getLines = async (pageNumber, pageSize = this.state.perPage, TransactionDate= this.state.date, SearchTerm= this.state.SearchTerm) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    let filter = { pageNumber, pageSize, IsRepairedReceived: true,TransactionDate, SearchTerm };
    this.setState({
      loading: true,
    });

    const res = await ProductionRepairingService.GetListByFilter(filter, resToken.token);
    console.log(res);
    this.setState({
      data: res.data,
      totalRows: res.searchFilter.totalCount,
      loading: false,
    });

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
  onButtonClicked = async () => {

    const defaultpage = 1;
    await this.getLines(defaultpage);

  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
    console.log(value);
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
    const { SearchTerm, date, error } = this.state;
    return (
      <div className="container-fluid">
            <Helmet>
                    <meta charSet="utf-8" />
                    <title>Repair Receive</title>
                </Helmet>
        <Breadcrumb
          BreadcrumbParams={{
            header: "Repair Receive List",
            title: "RepairReceived",
            isDashboardMenu: false,
            isThreeLayer: false,
            threeLayerTitle: "",
            threeLayerLink: "",
          }}
        />

        <PageTopNavigator
          TopNavigator={{
            link: "/productionLine/add",
            text: "Add New",
            canShowIcon: true,
            icon: "fa-solid fa-circle-plus",
          }}
        />

        <div className="row">
          <div className="col-xl-12 col-lg-12 col-sm-12">
            <div className="tables-wrapper">
              <div className="row">
                <div className="col-lg-12">
                  <div className="card-style mb-30">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="input-style-1">
                          <label>
                            <b>Date</b>
                          </label>

                          <input type="date" name="date" id="date" value={date} onChange={this.handleInputChange} />
                          {error.date.length > 0 && (
                            <div style={{ display: "block" }} className="invalid-feedback"> {error.date}</div>
                          )}

                        </div>
                      </div>

                      <div className="col-md-4" style={{ paddingTop: "9px" }}>
                        <div className="input-style-1">
                          <br />
                          <input type="text" name="search" id="search" value={SearchTerm} placeholder="Enter search item here.."
                            autoComplete="off" onChange={(e) => this.setState({ SearchTerm: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-md-2" style={{ paddingTop: "9px" }}>
                        <br />
                        <button className="main-btn primary-btn btn-hover" onClick={this.onButtonClicked} >
                          <FontAwesomeIcon icon={faSearchDollar} /> Search
                        </button>
                      </div>
                    </div>
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

export default withAuth(RepairReceived);
