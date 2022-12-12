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
import { AuthConstants, ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineService } from "../../../shared/services/lines/LineService";
import withAuth from "../../../shared/hoc/AuthComponent";
import { ColorService } from "../../../shared/services/colors/ColorService";
import { Helmet } from "react-helmet";

class Color extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalRows: 0,
      perPage: 10,
      currentPage: 1,
      columns: [
        {
          name: "Name",
          selector: (row) => row.name,
          sortable: true,
        },
     
        {
          name: "Created On",
          selector: (row) => row.createdOn,
          sortable: true,
        },
        {
            name:'Actions',
          cell: (row) => (
            <>
             <Link
                to={`/color/edit/`+row.id}
                className="btn btn-sm btn-primary m-1"             
              >
                <FontAwesomeIcon icon="fa-solid fa-square-pen" /> 
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => this.handleDelete(row.id)}
              >
                <FontAwesomeIcon icon="fa-solid fa-trash-can" /> 
              </button>
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
    await this.getColors(defaultpage);
  };

  getColors = async (pageNumber, pageSize = this.state.perPage) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    let filter = { pageNumber, pageSize };
    this.setState({
      loading: true,
    });
    const res = await ColorService.GetListByFilter(filter, resToken.token);

        this.setState({
          data: res.data,
          totalRows: res.searchFilter.totalCount,
          loading: false,
        });
    
  };

  handleDelete = (id) => {
    confirmAlert({
      title: "Confirmation",
      message: "Are you sure you want to delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            this.deleteRow(id);
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

  deleteRow = async (id) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    const res = await ColorService.Delete(id, resToken.token);
  
      if (res.response.isSuccess) {
        const defaultpage = 1;
        //get categories
        this.getColors(defaultpage);
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
          <Helmet>
          <meta charSet="utf-8" />
          <title>Color </title>
        </Helmet>
        <Breadcrumb
          BreadcrumbParams={{
            header: "Color List",
            title: "Colors",
            isDashboardMenu: false,
            isThreeLayer: false,
            threeLayerTitle: "",
            threeLayerLink: "",
          }}
        />

        <PageTopNavigator
          TopNavigator={{
            link: "/color/add",
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
    );
  }
}

export default withAuth(Color);
