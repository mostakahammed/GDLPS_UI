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
import withAuth from "../../../shared/hoc/AuthComponent";
import { ItemService } from "../../../shared/services/items/ItemService";
import { ModelService } from "../../../shared/services/models/ModelService";
import { BrandService } from "../../../shared/services/brands/BrandService";
import { faMagnifyingGlassPlus, faSearchDollar } from "@fortawesome/free-solid-svg-icons";
import { StockInTransactioinService } from "../../../shared/services/stockInTransactions/StockInTransactionService";
import { StoreService } from "../../../shared/services/stores/StoreService";
import { RequisitionService } from "../../../shared/services/requisitions/ResquisitionService";
import { Helmet } from "react-helmet";
import { Fragment } from "react/cjs/react.production.min";

class Requisition extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stores: [],
            storeId: 0,
            totalRows: 0,
            perPage: 10,
            currentPage: 1,
            SearchTerm: '',
            columns: [
                {
                    name: "Requisition No",
                    selector: (row) => row.requisitionNo,
                    sortable: true,
                },
                {
                    name: "From Store",
                    selector: (row) => row.fromStore.name,
                    sortable: true,
                },
                {
                    name: "To Store",
                    selector: (row) => row.toStore.name,
                    sortable: true,
                },
                {
                    name: "Requisition For",
                    selector: (row) => row.requisitionFor,
                    sortable: true,
                },

                {
                    name: "Status",
                    cell: (row) => {
                        return row.requisitionStatus == "Pending" ? (
                            <p style={{ color: "Blue" }}>{row.requisitionStatus}</p>

                        ) : (
                            <p style={{ color: "Green" }}>{row.requisitionStatus}</p>
                        );
                    }
                },
                {
                    name: "Action",
                    cell: (row) => {
                        return row.requisitionStatus == "Pending" ? (
                            <div>
                                <Link
                                    to={"/requisition/edit/" + row.id}
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
                            </div>

                        ) : (
                           
                           <div>
                                
                           </div>
                        );
                    }
                },
            ],
            data: [],
        };
    }

    componentDidMount = async () => {
        const defaultpage = 1;
        await this.getItems(defaultpage);
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        //get model list for ddl
        let store = await this.getStoreList(resToken.token).then(res => { return res });

        this.setState({
            stores: store.data,

        })
    }
    getStoreList = async (token) => {

        let filteredList = await StoreService.GetDropdownList(token);

        return filteredList;
    }


    getItems = async (pageNumber, pageSize = this.state.perPage, StoreId = this.state.storeId, SearchTerm = this.state.SearchTerm) => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        let filter = { pageNumber, pageSize, SearchTerm, StoreId };
        this.setState({
            loading: true,
        });
        const res = await RequisitionService.GetListByFilter(filter, resToken.token)

        this.setState({
            data: res.data,
            totalRows: res.searchFilter.totalCount,
            loading: false
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

        const res = await StockInTransactioinService.Delete(row.id, resToken.token)

        if (res.response.isSuccess) {
            const defaultpage = 1;
            this.getItems(defaultpage);
        }
        const type = res.response.isSuccess
            ? ToasterTypeConstants.Success
            : ToasterTypeConstants.Warning;

        Toaster.Notify({ type: type, message: res.response.message });

    };

    handlePageChange = async (page) => {
        await this.getItems(page);
        this.setState({
            currentPage: page,
        });
    };

    handlePerRowsChange = async (newPerPage, page) => {
        await this.getItems(page, newPerPage);
        this.setState({
            perPage: newPerPage,
        });
    };

    handleOnSort = (selectedColumn, sortDirection) => {
        console.log(selectedColumn.name);
        console.log(sortDirection);
    };
    onButtonClicked = async () => {

        const defaultpage = 1;
        await this.getItems(defaultpage);
        this.setState({
            SearchTerm:''
        })

    }

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    };


    render() {
        const { stores, storeId, SearchTerm } = this.state;
        return (
            <Fragment>
            <Helmet>
              <meta charSet="utf-8" />
              <title>Manual Requisition</title>
            </Helmet>
            <div className="container-fluid">
                <Breadcrumb
                    BreadcrumbParams={{
                        header: "Requisition List",
                        title: "Requisitions",
                        isDashboardMenu: false,
                        isThreeLayer: false,
                        threeLayerTitle: "",
                        threeLayerLink: "",
                    }}
                />

                <PageTopNavigator
                    TopNavigator={{
                       // link: "/requisition/add",
                       link:"/manualModelRequisition",
                        text: "Add Requisition",
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
                                            {/* <div className="col-md-3">
                                                <div className="input-style-1">
                                                    <label> <b> Store</b> </label>
                                                    <select className="form-control" name="storeId" id="storeId" onChange={this.handleInputChange} value={storeId}>
                                                        <option value='0'> Select One</option>
                                                        {stores.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>
                                                </div>
                                            </div> */}

                                            <div className="col-md-4" style={{ paddingTop: "9px" }}>
                                                <div className="input-style-1">
                                                    <br />
                                                    <input type="text" name="search" id="search" value={SearchTerm} placeholder="Enter serach item here.."
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
            </Fragment>
        );
    }
}

export default withAuth(Requisition);
