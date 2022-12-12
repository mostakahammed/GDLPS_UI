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
import { Fragment } from "react/cjs/react.production.min";
import { Helmet } from "react-helmet";

class ProductionLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalRows: 0,
      perPage: 10,
      currentPage: 1,
      columns: [
        {
          name: "Line ",
          selector: (row) => row.line.name,
          sortable: true,
        },
        {
          name: "Model",
          selector: (row) => row.model.name,
          sortable: true,
        },
        {
          name: "Color",
          selector: (row) => row.color.name,
          sortable: true,
        },
        {
          name: "Create date",
          selector: (row) => row.createdOn,
          sortable: true,
        },
        {
          name: " Approximate production",
          selector: (row) => row.approxQty,
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

  getLines = async (pageNumber, pageSize = this.state.perPage) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    let filter = { pageNumber, pageSize };
    this.setState({
      loading: true,
    });
    const res = await ProductionLineService.GetListByFilter(filter, resToken.token);

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
      <Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Production Line</title>
        </Helmet>
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
      </Fragment>
    );
  }
}

export default withAuth(ProductionLine);
