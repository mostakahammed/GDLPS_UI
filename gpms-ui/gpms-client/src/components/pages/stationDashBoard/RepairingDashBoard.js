import React, { Component, Fragment } from "react";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ItemService } from "../../../shared/services/items/ItemService";
import Breadcrumb from "../../mics/Breadcrumb";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import withAuth from "../../../shared/hoc/AuthComponent";
import Select from 'react-select';
import _ from 'lodash';
import { StationService } from "../../../shared/services/stations/StationService";
import { ProductionDailyService } from "../../../shared/services/productionDailys/ProductionDailyService";
import { withRouter } from "../../../shared/hoc/withRouter";
import { NewitemService } from "../../../shared/services/newItems/NewItemservice";
import FailedMessagesModalPopup from "./FailedMessagesModalPopup";
import { ProductionRepairingService } from "../../../shared/services/productionRepairings/ProductionRepairingService";
import { StockInTransactioinService } from "../../../shared/services/stockInTransactions/StockInTransactionService";
import Autosuggest from "react-autosuggest/dist/Autosuggest";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import { faSearchDollar } from "@fortawesome/free-solid-svg-icons";
import { ModelService } from "../../../shared/services/models/ModelService";
import { Helmet } from "react-helmet";


export class RepairingDashBoard extends Component {
    constructor(props) {
        super(props);
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var curTime = today.getFullYear() + "-" + month + "-" + date;

        this.state = {
            comment: '',
            value: '',
            viewItems: [],
            stationId: 0,
            failedMessage: '',
            productionRepairingId: 0,
            failedDivContainer: false,
            suggestions: [],
            status: [],
            reqStatus: '',
            viewItemsRepairing: [],
            itemList: [],
            code: '',
            date: curTime,
            models: [],
            modelId: 0,
            stockQuantity: '',
            suggestionsModel: [],
            error: {

                comment: '',
                reqStatus: '',
                modelId: ''
            },
            modelValue: '',
            totalRows: 0,
            perPage: 10,
            currentPage: 1,
            columns: [
                {
                    name: "Code",
                    selector: (row) => row.productionDaily.productRefNum,
                    sortable: true,
                },
                {
                    name: "Status",
                    selector: (row) => row.status,
                    sortable: true,
                },
                {
                    name: "Station",
                    selector: (row) => row.productionDaily.station.name,
                    sortable: true,
                },
                {
                    name: "Reason",
                    selector: (row) => row.failedMessage.message,
                    sortable: true,
                },
                {
                    name: "Action",
                    cell: (row) => {
                        return row.status != "Repaired" ? (
                            <div>
                                <button className="main-btn warning-btn rounded-full btn-hover" onClick={() => this.updateRow(row)}> Select</button>
                            </div>
                        ) : (
                            <> <p style={{ color: 'Green' }}>Repaired</p></>
                        );
                    }
                },
            ],
            data: [],
        }
    }

    componentDidMount = async () => {

        const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
        const mainWrapper = document.querySelector(".main-wrapper");
        const overlay = document.querySelector(".overlay");

        sidebarNavWrapper.classList.add("active");
        overlay.classList.add("active");
        mainWrapper.classList.add("active");

        const defaultpage = 1;
        //get categories
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        await this.getRepairList(defaultpage);
        let model = await this.getModelList(resToken.token);


        this.setState({
            models: model.data
        })


    }
    onButtonClicked = async () => {

        const defaultpage = 1;
        await this.getRepairList(defaultpage);

    }
    getRepairList = async (pageNumber, pageSize = this.state.perPage) => {
        var viewItems = this.state.viewItems;
        var date = this.state.date;
        const status = [
            {
                value: 'Pending',
                label: 'Pending'
            },
            {
                value: 'Repaired',
                label: 'Repaired'
            },
            {
                value: 'Not Repairable',
                label: 'Not Repairable'
            }
        ];

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }


        let filter = { pageNumber, pageSize, transactionDate: date, IsFaultyReceived: true };
        this.setState({
            loading: true,
        });

        const res = await ProductionRepairingService.GetListByFilter(filter, resToken.token);

        this.setState({
            data: res.data,
            totalRows: res.searchFilter.totalCount,
            loading: false,
        });

        _.forEach(res.data, (item) => {

            var viewItem =
            {
                id: item.id,
                code: item.productionDaily.productRefNum,
                status: item.status,
                station: item.productionDaily.station.name,
                failedMessage: item.failedMessage.message,
                comment: item.comments,
            }

            viewItems.push(viewItem);
        })

        this.setState({

            viewItems: viewItems,
            status: status

        })

    };

    handleInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }
    getModelList = async (token) => {

        let filteredList = await ModelService.GetDropdownList(token);

        return filteredList;
    }


    validateFormOnLoginSubmit = () => {
        this.formValidationObject('comment', this.state.comment);
        this.formValidationObject('reqStatus', this.state.reqStatus);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "comment":
                error.comment = !value.length || value === '' ? "Comment is Required" : "";
                break;
            case "reqStatus":
                error.reqStatus = !value.length || value === '' ? "Staus is Required" : "";
                break;

            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };
    handleInputItem = async (event) => {

        const value = event.value;
        const label = event.label;

        var viewItemsRepairing = this.state.viewItemsRepairing;
        var items = this.state.items;
        var itemList = this.state.itemList;

        var val = parseInt(value);

        const isItemExist = _.some(itemList,
            (oItem) => {
                return oItem.itemId === val;
            }
        );

        if (isItemExist) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Already Added" });
            return;
        }
        let resToken = AuthenticationService.GetToken();

        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        var res = await StockInTransactioinService.GetRepairStoreSumByItemId(val, resToken.token);

        var viewItem =
        {
            label: label,
            itemId: val,
            quantity: '',
            stockQty: res.data,
            err: 'white'
        }
        viewItemsRepairing.splice(0, 0, viewItem);
        //viewItems.push(viewItem);

        const eachItem = {
            itemId: val,
            quantity: 0,
            id: 0,
            stockQty: res.data
        }
        itemList.splice(0, 0, eachItem);
        // itemList.push(eachItem);

        this.setState({
            viewItemsRepairing: viewItemsRepairing,
            itemName: '',
            value: ''
        });

    }
    handleInputQuantity = (event, item) => {

        var requestQty = event.target.value;
        const requestQtyName = event.target.name;

        if (!requestQty || requestQty === '') requestQty = 0;

        var itemList = this.state.itemList;
        var viewItemsRepairing = this.state.viewItemsRepairing;

        _.forEach(itemList, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.quantity = parseInt(requestQty)
        })
        _.forEach(viewItemsRepairing, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.quantity = parseInt(requestQty)
        })
        _.forEach(viewItemsRepairing, (item, index) => {
            if (item.quantity > item.stockQty) {
                viewItemsRepairing[index].err = 'red'
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Please Check Stock Quantity !!" });
                return;
            }
            else {
                viewItemsRepairing[index].err = 'white'
            }

        })

        this.setState({
            viewItemsRepairing: viewItemsRepairing
        })
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };


    updateRow = (item) => {
        this.setState({
            // failedDivContainer: !this.state.failedDivContainer,
            failedDivContainer: true,
            productionRepairingId: item.id,
            failedMessage: item.failedMessage.message,
            code: item.productionDaily.productRefNum,
            reqStatus: item.status,
            comment: item.comments == null ? '' : item.comments,
        })
    }
    handleItemDeleted = (event, item) => {
        var itemList = this.state.itemList;
        var viewItemsRepairing = this.state.viewItemsRepairing;

        var itemId = item.itemId;

        var selectedIndex = itemList.findIndex(function (x) { return x.itemId == itemId; });


        itemList.splice(selectedIndex, 1);
        viewItemsRepairing.splice(selectedIndex, 1);

        this.setState({
            itemList: itemList,
            viewItemsRepairing: viewItemsRepairing
        });
    }

    handleSubmit = async (e) => {

        var viewItems = this.state.viewItems;
        var viewItemsRepairing = this.state.viewItemsRepairing;
        var itemList = this.state.itemList;


        e.preventDefault();

        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }

        const { productionRepairingId, reqStatus, comment } = this.state;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        _.forEach(viewItemsRepairing, (item, index) => {
            if (item.quantity > item.stockQty) {
                viewItemsRepairing[index].err = 'red'
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Please Check Stock Quantity !!" });
                return;
            }

        })

        const model = {
            Id: productionRepairingId,
            Status: reqStatus,
            Comments: comment,
            ItemList: itemList

        }

        const res = await ProductionRepairingService.Edit(model, resToken.token);

        if (res.response.isSuccess) {

            // let filter = {};
            // const resList = await ProductionRepairingService.GetListByFilter(filter, resToken.token);

            // viewItems = [];
            // _.forEach(resList.data, (item) => {

            //     var viewItem =
            //     {
            //         id: item.id,
            //         code: item.productionDaily.productRefNum,
            //         status: item.status,
            //         station: item.productionDaily.station.name,
            //         failedMessage: item.failedMessage.message,
            //         comment: item.comments
            //     }

            //     viewItems.push(viewItem);
            // })
            const defaultpage = 1;
            await this.getRepairList(defaultpage);
            this.setState({
                failedMessage: '',
                comment: "",
                reqStatus: '',
                viewItems: viewItems,
                code: '',
                failedDivContainer: false
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            return;
        }


        Toaster.Notify({ type: ToasterTypeConstants.Error, message: res.response.message });

    };
    getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const SearchTerm = inputValue;
        const ModelId = this.state.modelId;

        let resToken = AuthenticationService.GetToken();

        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        let filter = { SearchTerm, ModelId };

        //get item list for ddl
        const res = await StockInTransactioinService.GetDropdownlistforRepair(filter, resToken.token);

        this.setState({
            items: res.data
        })

        var filteredList = this.state.items;

        var suggestionsList = inputLength === 0 ? [] : filteredList;
        return suggestionsList;
    };

    // Autosuggest will call this function every time you need to update suggestions.
    // You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = async ({ value }) => {

        var suggestionsList = await this.getSuggestions(value);
        this.setState({
            suggestions: suggestionsList
        });
    };


    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    handlePageChange = async (page) => {
        await this.getRepairList(page);
        this.setState({
            currentPage: page,
        });
    };

    handlePerRowsChange = async (newPerPage, page) => {
        await this.getRepairList(page, newPerPage);
        this.setState({
            perPage: newPerPage,
        });
    };

    handleOnSort = (selectedColumn, sortDirection) => {
    };

    onSuggestionsModelFetchRequested = async ({ value }) => {

        var suggestionsModelList = await this.suggestionsModelList(value);
        this.setState({
            suggestionsModel: suggestionsModelList
        });
    };

    onSuggestionsModelClearRequested = () => {
        this.setState({
            suggestionsModel: []
        });
    };
    onModelChange = (event, { newValue }) => {

        this.setState({
            modelValue: newValue
        });
        if (newValue == '') {
            this.setState({
                modelId: 0
            })
        }
    };


    suggestionsModelList = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const SearchTerm = inputValue;


        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        let filter = { SearchTerm };

        //get item list for ddl
        const res = await ModelService.GetDropdownlistByFilter(filter, resToken.token);

        this.setState({
            items: res.data
        })

        var filteredList = this.state.items;

        var suggestionsModel = inputLength === 0 ? [] : filteredList;
        return suggestionsModel;
    };

    handleModel = (event) => {
        console.log(event);
        const value = event.value;
        const label = event.label;


        this.setState({
            modelValue: label,
            modelId: value
        });

    }

    render() {
        const { models, suggestionsModel, modelValue, stockQuantity, modelId, viewItems, failedDivContainer, value, reqStatus, failedMessage, comment, error, status, code, suggestions, viewItemsRepairing, date } = this.state;

        const inputProps = {
            placeholder: 'Type Item Name',
            value,
            onChange: this.onChange
        };
        const inputModelProps = {
            placeholder: 'Type Item Name',
            value: modelValue,
            onChange: this.onModelChange
        };
        return (
            <Fragment>
                 <Helmet>
                <meta charSet="utf-8" />
                <title>Repair Dashboard</title>
            </Helmet>
                {/* <div className="container-fluid"> */}
                {/* <Breadcrumb
                        BreadcrumbParams={{
                            header: "",
                            title: "",
                            isDashboardMenu: false,
                            isThreeLayer: false,
                            threeLayerTitle: "",
                            threeLayerLink: "",
                        }}
                    /> */}

                <div className="row row-dashboard">
                    <div className="col-xl-12 col-lg-12 col-sm-12">
                        <div className="row align-items-center">
                            <div className="card-style mb-30" style={{ marginBottom: "0px" }}>

                                <div className="row">
                                    <div className="col-md-6" style={{ borderLeft: "1px" }}>
                                        <div className="card-style mb-1 border-leftcolor">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="input-style-1">
                                                        <label>
                                                            <b>Date</b>
                                                        </label>

                                                        <input type="date" name="date" id="date" value={date} onChange={this.handleInputChange} />
                                                        {/* {error.date.length > 0 && (
                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.date}</div>
                                                    )} */}

                                                    </div>
                                                </div>
                                                <div className="col-md-4" style={{ paddingTop: "9px" }}>
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
                                    <div className="col-md-6">

                                        <div className="card-style mb-1 card-height">
                                            <div className="row">

                                                {failedDivContainer &&
                                                    <div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <p><b>Code: {code} </b></p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="input-style-1">
                                                                    <p>   {failedMessage} </p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="input-style-1">
                                                                    <label>
                                                                        <b> Approved Status</b>
                                                                    </label>
                                                                    <select className="form-control" name="reqStatus" id="reqStatus" value={reqStatus} onChange={this.handleInputChange}>
                                                                        <option value=""> Select One</option>
                                                                        {status.map((item, index) => {
                                                                            return (
                                                                                <option key={index} value={item.value}>{item.label}</option>
                                                                            )
                                                                        })}

                                                                    </select>
                                                                    {error.reqStatus.length > 0 && (
                                                                        <div style={{ display: "block" }} className="invalid-feedback"> {error.reqStatus}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="input-style-1">
                                                                    <label>
                                                                        <b> Model </b>
                                                                    </label>
                                                                    <Autosuggest
                                                                        suggestions={suggestionsModel}
                                                                        onSuggestionsFetchRequested={this.onSuggestionsModelFetchRequested}
                                                                        onSuggestionsClearRequested={this.onSuggestionsModelClearRequested}
                                                                        getSuggestionValue={(suggestion) => suggestion.label}
                                                                        renderSuggestion={(suggestion) =>
                                                                            <div>
                                                                                {suggestion.label}
                                                                            </div>}
                                                                        onSuggestionSelected={(event, { suggestion, method }) => {
                                                                            console.log(suggestion);
                                                                            this.handleModel(suggestion);
                                                                        }}
                                                                        inputProps={inputModelProps}
                                                                    />
                                                                </div>
                                                                <div className="input-style-1">
                                                                    <label> <b>Model </b> </label>
                                                                    <select className="form-control" name="modelId" id="modelId" onChange={this.handleInputChange} value={modelId}>
                                                                        <option value='0'> Select One</option>
                                                                        {models.map((item, index) => {
                                                                            return (
                                                                                <option key={index} value={item.value}>{item.label}</option>)
                                                                        })}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="input-style-1">
                                                                    <label>
                                                                        <b>Item </b>
                                                                    </label>
                                                                    <Autosuggest
                                                                        suggestions={suggestions}
                                                                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                                                                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                                                                        getSuggestionValue={(suggestion) => suggestion.label}
                                                                        renderSuggestion={(suggestion) =>
                                                                            <div>
                                                                                {suggestion.label}
                                                                            </div>}
                                                                        onSuggestionSelected={(event, { suggestion, method }) => {
                                                                            this.handleInputItem(suggestion);
                                                                        }}
                                                                        inputProps={inputProps}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="table-wrapper table-responsive">
                                                                <table className="table striped-table">
                                                                    <thead className="tbHead" style={{ background: '#0d6efd', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                                                        <tr>
                                                                            <th style={{ width: '70%' }}>
                                                                                Item
                                                                            </th>
                                                                            <th style={{ width: '20%' }}>
                                                                                Quantity
                                                                            </th>
                                                                            <th> Stock Quantity</th>
                                                                            <th>
                                                                                Actions
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody style={{ textAlign: 'Center' }}>
                                                                        {viewItemsRepairing.map((item, i) => {
                                                                            return (
                                                                                <tr key={`item-${i}`}>
                                                                                    <td className="p-2" >
                                                                                        {item.label}
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        {/* <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" value={item.quantity}/> */}
                                                                                        <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" value={item.quantity} />
                                                                                    </td>
                                                                                    <td className="p-2" >
                                                                                        {/* <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" value={item.quantity}/> */}
                                                                                        <input className="form-control" type="text" name="stockQuantity" id="stockQuantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" value={item.stockQty} style={{ background: item.err }} />
                                                                                    </td>
                                                                                    <td className="p-2">
                                                                                        <button className="main-btn danger-btn btn-hover" onClick={(event) => this.handleItemDeleted(event, item)} >
                                                                                            <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                                                                        </button>
                                                                                    </td>

                                                                                </tr>
                                                                            );
                                                                        })
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="input-style-2">
                                                                    <label><span style={{ color: 'red' }}>*</span>
                                                                        &nbsp;  <b>Comment</b>
                                                                    </label>
                                                                    <div className="input-style-1">
                                                                        <input type="textArea" name="comment" id="comment" value={comment} onChange={this.handleInputChange} autoComplete='off' />
                                                                        {error.comment.length > 0 && (
                                                                            <div style={{ display: "block" }} className="invalid-feedback"> {error.comment}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className=" button-group d-flex justify-content-left flex-wrap">
                                                                <button className="main-btn primary-btn btn-hover w-60 text-center" onClick={this.handleSubmit}> Submit </button>
                                                            </div>
                                                        </div>

                                                    </div>}

                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="row">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Fragment >
        );
    }


}
export default withAuth(withRouter(RepairingDashBoard));