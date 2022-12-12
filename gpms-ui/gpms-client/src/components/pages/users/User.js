import React, { Component } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "../../mics/Breadcrumb";
import PageTopNavigator from "../../mics/PageTopNavigator";
import { ModelService } from "../../../shared/services/models/ModelService";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import withAuth from "../../../shared/hoc/AuthComponent";
import { UserService } from "../../../shared/services/users/UserService";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { Toaster } from "../../../shared/utilities/Toaster";
import { Helmet } from "react-helmet";

class User extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalRows: 0,
      perPage: 10,
      currentPage: 1,
      columns: [
        {
          name: "user Name",
          selector: (row) => row.username,
          sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
          },
        {
          name: "Address",
          selector: (row) => row.address,
          sortable: true,
        },
        {
          cell: (row) => (
            <>
              <Link
                to={"/user/edit/" + row.id}
                className="btn btn-sm btn-primary m-1"
                title="Edit"
              >
                <FontAwesomeIcon icon="fa-solid fa-square-pen" />
              </Link>
              <button
                className="btn btn-sm btn-danger"
                title="Delete"
                onClick={()=>this.handleDelete(row)}
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
    await this.getModels(defaultpage);
  };

  getModels = async (pageNumber, pageSize = this.state.perPage) => {
    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    let filter = { pageNumber, pageSize };
    this.setState({
      loading: true,
    });
    const res = await UserService.GetListByFilter(filter, resToken.token);
  
        this.setState({
          data: res.data,
          totalRows: res.searchFilter.totalCount,
          loading: false,
        });
   
  };

  handleDelete = async (row) => {
    //added confirmation

    let resToken = AuthenticationService.GetToken();
    if (!resToken.isSuccess) {
      return;
    }

    const res = await UserService.Delete(row.id, resToken.token);

        if (res.response.isSuccess) {
          const defaultpage = 1;
          //get categories
          this.getModels(defaultpage);
        }
        const type = res.response.isSuccess
        ? ToasterTypeConstants.Success
        : ToasterTypeConstants.Warning;

      Toaster.Notify({ type: type, message: res.response.message });
   
  };

  handlePageChange = async (page) => {
    await this.getModels(page);
    this.setState({
      currentPage: page,
    });
  };

  handlePerRowsChange = async (newPerPage, page) => {
    await this.getModels(page, newPerPage);
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
          <title>User</title>
        </Helmet>
        <Breadcrumb
          BreadcrumbParams={{
            header: "User List",
            title: "Users",
            isDashboardMenu: false,
            isThreeLayer: false,
            threeLayerTitle: "",
            threeLayerLink: "",
          }}
        />

        <PageTopNavigator
          TopNavigator={{
            link: "/user/add",
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

export default withAuth(User);
