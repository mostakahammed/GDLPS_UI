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
import { CartonDoneService } from "../../../shared/services/cartonDones/CartonDoneService";
import { NewitemService } from "../../../shared/services/newItems/NewItemservice";
import { faSearchDollar,faBarsProgress, faTicket, faVcard } from "@fortawesome/free-solid-svg-icons";
import withAuth from "../../../shared/hoc/AuthComponent";
import { withRouter } from "../../../shared/hoc/withRouter";
import { Helmet } from "react-helmet";

class OQCApprovedCarton extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var curTime = today.getFullYear() + "-" + month + "-" + date;
        this.state = {
            totalRows: 0,
            perPage: 10,
            currentPage: 1,
            searchTerm: '',
            date: curTime,
            error: {
                date: '',

            },
            columns: [
                {
                    name: "Work Order",
                    selector: (row) => row.workOrder,
                    sortable: true,
                },
                {
                    name: "Box Id",
                    selector: (row) => row.cartonCode,
                    sortable: true,
                },
                {
                    name: "Total Quantity",
                    selector: (row) => row.wottlQty,
                    sortable: true,
                },
                {
                    name: "Quantity",
                    selector: (row) => row.quantity,
                    sortable: true,
                },
                {
                    name: "Date",
                    selector: (row) => row.createdOn,
                    sortable: true,
                },

                {
                    name: "Status",
                    cell: (row) => {
                        return row.isFinished == true ? (
                            <p style={{ color: "Green" }}> <b> Approved</b> </p>
                        ) : (
                            <p style={{ color: "Blue" }}>Pending</p>
                        );
                    }
                },
                {
                    name: "Logistic Approved",
                    cell: (row) => {

                        return row.isFinished == true ? (
                            <p style={{ color: "Green" }}> <b>Approved</b> </p>
                        ) : (
                            <button className="btn btn-sm btn-primary m-1" onClick={() => this.logisticApproved(row.cartonCode)}>
                                <FontAwesomeIcon icon={faBarsProgress} />
                            </button>
                        );


                    },
                },
                {
                    name:"View",
                    cell: (row) => <>
                        <button className="btn btn-success btn-primary m-1"  style={{ padding: '0.075rem 0.75rem'}} onClick={() => this.GetCartonIMEIDetailsById(row.cartonCode)}>
                            <FontAwesomeIcon icon={faVcard} />
                        </button>

                        </>
                },

            ],
            data: [],
        };
    }
    GetCartonIMEIDetailsById= async (boxId)=>{
        this.props.navigate(`/cartonDoneIMEI/${boxId}`,{replace:true})
    }
    componentDidMount = async () => {
        const defaultpage = 1;
        //get categories
        await this.getItems(defaultpage);
    };

    getItems = async (pageNumber, pageSize = this.state.perPage) => {

        
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }
        const searchTerm = this.state.searchTerm;
        let filter = { pageNumber, pageSize, IsLogisticPage: false, IsOQCPassed:true, SearchTerm:searchTerm, TransactionDate: this.state.date };
        this.setState({
            loading: true,
        });

        const res = await CartonDoneService.GetListByFilter(filter, resToken.token);

        this.setState({
            data: res.data,
            totalRows: res.searchFilter.totalCount,
            loading: false,
        });

    };
    
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
        console.log(value);
    };

    logisticApproved = async (boxId) => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }
        const res = await NewitemService.ConsumeBoxItemDetails(boxId, resToken.token);
       
        if (!res.response.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });
            return;
        }
        Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
        const defaultpage = 1;
        //get categories
        await this.getItems(defaultpage);
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
    onButtonClicked = async () => {

        const defaultpage = 1;
        await this.getItems(defaultpage);

    }
    deleteRow = async (row) => {
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            return;
        }

        const res = await LineService.Delete(row.id, resToken.token);

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
        const { SearchTerm, date, error } = this.state;
        return (
            <div className="container-fluid">
                   <Helmet>
                    <meta charSet="utf-8" />
                    <title>OQC Approved Carton</title>
                </Helmet>
                <Breadcrumb
                    BreadcrumbParams={{
                        header: "Total OQC Approved Carton",
                        title: "CartonDones",
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
                                                        autoComplete="off" onChange={this.handleInputChange}
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

export default withAuth(withRouter(OQCApprovedCarton));
