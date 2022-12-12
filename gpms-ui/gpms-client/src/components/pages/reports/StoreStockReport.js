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
import { faMagnifyingGlassPlus, faPrint, faSearchDollar } from "@fortawesome/free-solid-svg-icons";
import { StockInTransactioinService } from "../../../shared/services/stockInTransactions/StockInTransactionService";
import { StoreService } from "../../../shared/services/stores/StoreService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { withRouter } from "../../../shared/hoc/withRouter";
import { Fragment } from "react/cjs/react.production.min";
import { Helmet } from "react-helmet";
import StockRptData from "./StockRptData";
import _ from 'lodash';
import ReactToPrint from "react-to-print";

class StoreStockReport extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var curTime = today.getFullYear() + "-" + month + "-" + date;
        this.state = {
            stores: [],
            storeId: 1,
            totalRows: 0,
            perPage: 10,
            currentPage: 1,
            SearchTerm: '',
            date: curTime,
            toDate: curTime,
            fromDate: curTime,
            viewItems: [],
            rptData: [],
            error: {
                date: '',

            },
            columns: [
                {
                    name: "SKU",
                    selector: (row) => row.sku,
                    sortable: true,
                    autoHeight: true
                },
                {
                    name: "Item Name",
                    selector: (row) => row.title,
                    sortable: true,
                },
                {
                    name: "Model",
                    selector: (row) => row.model,
                    sortable: true,
                },
                {
                    name: "Stock ",
                    selector: (row) => row.stock,
                    sortable: true,
                },


            ],
            data: [],
        };
    }

    validateFormOnLoginSubmit = () => {
        this.formValidationObject('date', this.state.date);

    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "date":
                error.date = !value.length || value === '' ? "Date is Required" : "";
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


    getItems = async (pageNumber, pageSize = this.state.perPage, StoreId = this.state.storeId, SearchTerm = this.state.SearchTerm, FromDate = this.state.fromDate, ToDate = this.state.toDate) => {

        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }
        // if(TransactionDate = 0) TransactionDate= null;
        let filter = { pageNumber, pageSize, SearchTerm, StoreId, FromDate, ToDate };
        this.setState({
            loading: true,
        });

        const res = await StockInTransactioinService.GetStockSumByFilter(filter, resToken.token)
        var viewItems = this.state.viewItems;
        viewItems=[];
        _.forEach(res.rptData, (a) => {
            var viewItem =
            {
                sku: a.sku,
                Title: a.title,
                StoreName: a.storeName,
                Stock: a.stock,
                Model:a.model

            }
            viewItems.push(viewItem);
        })

        this.setState({
            data: res.data,
            totalRows: res.searchFilter.totalCount,
            loading: false,
            SearchTerm: '',
            rptData: viewItems,
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


    render() {
        const { stores, storeId, SearchTerm, toDate, error, fromDate, rptData } = this.state;

        return (
            <Fragment>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Store Items</title>
                </Helmet>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Stock Report",
                            title: "stock",
                            isDashboardMenu: false,
                            isThreeLayer: false,
                            threeLayerTitle: "",
                            threeLayerLink: "",
                        }}
                    />

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="tables-wrapper">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="card-style mb-30">
                                            <div style={{textAlign:'right'}}>
                                                <ReactToPrint
                                                    trigger={() => <a href="#"> <FontAwesomeIcon icon={faPrint} />
                                                        PDF</a>}
                                                    content={() => this.componentRef}
                                                />
                                            </div>
                                            <div className="row">
                                                <div className="col-md-3">
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
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="input-style-1">
                                                        <label>
                                                            <b>From Date</b>
                                                        </label>

                                                        <input type="date" name="fromDate" id="fromDate" value={fromDate} onChange={this.handleInputChange} />
                                                        {/* {error.date.length > 0 && (
                                                            <div style={{ display: "block" }} className="invalid-feedback"> {error.date}</div>
                                                        )} */}

                                                    </div>
                                                </div>
                                                <div className="col-md-2">
                                                    <div className="input-style-1">
                                                        <label>
                                                            <b>To Date</b>
                                                        </label>

                                                        <input type="date" name="toDate" id="toDate" value={toDate} onChange={this.handleInputChange} />
                                                        {/* {error.date.length > 0 && (
                                                            <div style={{ display: "block" }} className="invalid-feedback"> {error.date}</div>
                                                        )} */}

                                                    </div>
                                                </div>
                                                <div className="col-md-3" style={{ paddingTop: "9px" }}>
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
                <div  style={{ display: 'None' }}>
                    <StockRptData fromDate={fromDate} toDate={toDate} data={rptData} ref={el => (this.componentRef = el)} />
                </div>
            </Fragment>
        
        );
    }
}

export default withAuth(withRouter(StoreStockReport));
