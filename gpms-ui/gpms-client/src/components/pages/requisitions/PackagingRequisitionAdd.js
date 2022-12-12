import React, { Component, Fragment } from "react";
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ItemService } from "../../../shared/services/items/ItemService";
import Breadcrumb from "../../mics/Breadcrumb";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import withAuth from "../../../shared/hoc/AuthComponent";
import Select from 'react-select';
import { RequisitionService } from "../../../shared/services/requisitions/ResquisitionService";
import _ from 'lodash';
import { StoreService } from "../../../shared/services/stores/StoreService";
import Autosuggest from 'react-autosuggest';
import { StockInTransactioinService } from "../../../shared/services/stockInTransactions/StockInTransactionService";
import { ModelService } from "../../../shared/services/models/ModelService";
import { ModelItemService } from "../../../shared/services/modelItems/ModelItemService";
import { withRouter } from "../../../shared/hoc/withRouter";
import { ColorService } from "../../../shared/services/colors/ColorService";

export class PackagingRequisitionAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            quantity: 0,
            referenceNo: "",
            date: "",
            itemList: [],
            viewItemList: [],
            viewItems: [],
            stores: [],
            fromStoreId: 1,
            toStoreId: 2,
            status: [],
            value: '',
            suggestions: [],
            reqSuggestions: [],
            reqStatus: 'Pending',
            models: [],
            modelId: 0,
            modelQty: 1,
            initialViewItems: [],
            initialItemList: [],
            types: [],
            specType: 'Packaging',
            colors: [],
            colorId: 0,
            order: '',
            requisitionId: 0,
            reqValue: '',
            reqDate: '',

            error: {

                referenceNo: '',
                fromStoreId: '',
                toStoreId: '',
                reqStatus: '',
                date: '',
                modelId: '',
                specType: '',
                colorId: '',
                order: ''
            }
        }
    }

    componentDidMount = async () => {

        const status = [
            {
                value: 'Pending',
                label: 'Pending'
            },
            {
                value: 'Approve',
                label: 'Approve'
            },
            {
                value: 'Rejected',
                label: 'Reject'
            }
        ];
        const type = [

            {
                value: 'Packaging',
                label: 'Packaging'
            }
        ];


        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        // get item list for ddl
        let store = await this.getStoreList(resToken.token);
        let model = await this.getModelList(resToken.token);
        let color = await this.getColorList(resToken.token);
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var curTime = today.getFullYear() + "-" + month + "-" + date;


        this.setState({
            stores: store.data,
            status: status,
            reqStatus: "Pending",
            models: model.data,
            date: curTime,
            types: type,
            colors: color.data,
            reqDate: curTime
        })

    }

    getColorList = async (token) => {

        let filteredList = await ColorService.GetDropdownList(token);

        return filteredList;
    }

    getStoreList = async (token) => {

        let filteredList = await StoreService.GetDropdownList(token);

        return filteredList;
    }
    getModelList = async (token) => {

        let filteredList = await ModelService.GetDropdownList(token);

        return filteredList;
    }
    getModelItem = async (filter, token) => {


        let filteredList = await await ModelItemService.GetModelListByFilter(filter, token);

        return filteredList.data;
    }

    setViewItems = async (res) => {

        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length)

        _.forEach(res, (a) => {
            var viewItem =
            {
                label: a.itemName,
                itemId: a.itemId,
                requestQty: a.quantity,
                currentQty: a.currentQty,
                error: "white"
            }
            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems
        })
    }

    handleModelChange = async (event) => {

        // const target = event.target;
        // const value = target.value;
        // const name = target.name;
        var viewItems = this.state.viewItems;
        var items = this.state.items;
        var itemList = this.state.itemList;
        var viewItemList = this.state.viewItemList;

        const value = event.value;
        const label = event.label;
        var newmodelId = value;
        var specType = this.state.specType;

        // if (specType == '') {
        //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Please Select Type" });
        //     return;
        // }
        var list = [];

        this.setState({
            // [name]: value,
            value: label,
            modelId: value,
            modelQty:1
        });

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        if (specType == "") {
            Toaster.Notify({ type: ToasterTypeConstants.Error, message: "Please select Type..." });
            return;
        }
        let filter = { modelId: newmodelId, LineType: specType,StoreId:this.state.fromStoreId };

        //get item list for ddl
        // const res = await ModelItemService.GetListByFilter(filter, resToken.token);

        let res = await this.getModelItem(filter, resToken.token);

        var aItemCount = 0;
        var pItemCount = 0;
        _.forEach(res, (item) => {
            if (item.type == 'Assembly') aItemCount++;
            else if (item.type == 'Packaging') pItemCount++;
        })
        // if (aItemCount == 0) {
        //     Toaster.Notify({ type: ToasterTypeConstants.Error, message: "Assembly Configuration not Found" });
        //     return;
        // }
        if (pItemCount == 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Error, message: "Packaging Configuration not Found" });
            return;
        }

        this.setViewItems(res);


        _.forEach(res, (item) => {

            const eachItem = {
                itemId: item.itemId,
                requestQty: item.quantity,
                currentQty: item.currentQty,
                approvedStatus: 'Pending'
            }
            itemList.push(eachItem);
        })

        _.forEach(res, (item) => {

            const eachItem = {
                itemId: item.itemId,
                requestQty: item.quantity,
                currentQty: item.currentQty,
                approvedStatus: 'Pending'
            }
            viewItemList.push(eachItem);
        })


        const initialViewItems = viewItemList;

        this.setState({
            viewItems: viewItems,
            itemList: itemList,
            initialViewItems: initialViewItems,
            itemName: '',
          
            //value: ''
        });
        if (res.length <= 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "No Item Found in Stock" });
            return;
        }
    }

    handleModelQuantityChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;
        var modelQty = value;
        var itemList = this.state.itemList;
        var viewItems = this.state.viewItems;
        var initialViewItems = this.state.initialViewItems;


        this.setState({
            [name]: value,
        });

        if (value == '') { modelQty = 1 }

        _.forEach(initialViewItems, (vItem, index) => {

            viewItems[index].requestQty = vItem.requestQty * parseInt(modelQty);
            if (viewItems[index].requestQty > initialViewItems[index].currentQty) {
                viewItems[index].error = "red"
            }
            else {
                viewItems[index].error = "white"
            }
        })

        this.setState({
            viewItems: viewItems,
        })
    }

    handleInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        if (name == 'specType') {
            this.setState({
                viewItems: [],
                modelId: ''
            });
        }
    }

    handleInputQuantity = (event, item) => {

        var requestQty = event.target.value;
        const requestQtyName = event.target.name;

        if (!requestQty || requestQty === '') requestQty = 0;
            // return;

        var viewItems = this.state.viewItems;

        _.forEach(viewItems, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.requestQty = parseInt(requestQty)
        })

        this.setState({
            [requestQtyName]: requestQty,
            viewItems: viewItems
        })
    }

    handleItemDeleted = (event, item) => {
        var itemList = this.state.itemList;
        var viewItems = this.state.viewItems;

        var itemId = item.itemId;

        var selectedIndex = itemList.findIndex(function (x) { return x.itemId == itemId; });


        itemList.splice(selectedIndex, 1);
        viewItems.splice(selectedIndex, 1);

        this.setState({
            itemList: itemList,
            viewItems: viewItems
        });

    }


    validateFormOnLoginSubmit = () => {
        //this.formValidationObject('referenceNo', this.state.referenceNo);
        this.formValidationObject('fromStoreId', this.state.fromStoreId);
        this.formValidationObject('toStoreId', this.state.toStoreId);
        this.formValidationObject('reqStatus', this.state.reqStatus);
        // this.formValidationObject('colorId', this.state.colorId);
        this.formValidationObject('date', this.state.date);
        this.formValidationObject('order', this.state.order);
        this.formValidationObject('specType', this.state.order);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            // case "referenceNo":
            //     error.referenceNo = !value.length || value === '' ? "Reference No is Required" : "";
            //     break;
            // case "fromStoreId":
            //     error.fromStoreId = !value.length || value === '' ? "From Store is Required" : "";
            //     break;
            // case "toStoreId":
            //     error.toStoreId = !value.length || value === '' ? "To Store is Required" : "";
            //     break;
            case "date":
                error.date = !value.length || value === '' ? "Date is Required" : "";
                break;
            case "reqStatus":
                error.reqStatus = !value.length || value === '' ? "Status is Required" : "";
                break;
            // case "colorId":
            //     error.colorId = !value.length || value === '' ? "Color is Required" : "";
            //     break;
            case "order":
                error.order = !value.length || value === '' ? "Order is Required" : "";
                break;
            case "specType":
                error.specType = !value.length || value === '' ? "Type is Required" : "";
                break;
            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };


    handleSubmit = async (e) => {

        var count = 0;
        e.preventDefault();
        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }
        var { itemList, referenceNo, requisitionId, date, order, colorId, fromStoreId, toStoreId, reqStatus, viewItems, modelId, modelQty, specType } = this.state;

        _.forEach(viewItems, (vItem, index) => {
            itemList[index].requestQty = vItem.requestQty;
        })

        _.forEach(itemList, (item, index) => {

            if (item.requestQty > item.currentQty) {
                count++;
            }
        })
        // if (count > 0) {
        //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Please Change Model Quantity" });
        //     return;
        // }

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        if (requisitionId <=0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Please Add Assembly Requisition" });
            return;
        }
        
        const model = {
            RequisitionNo: referenceNo,
            RequisitionDate: date,
            FromStoreId: fromStoreId,
            ToStoreId: toStoreId,
            IsActive: true,
            RequisitionStatus: reqStatus,
            RequisitionDetail: itemList,
            RequisitionFor: "WIP",
            ModelId: modelId,
            ItemQuantity: modelQty,
            Type: specType,
            ColorId: colorId,
            ReqOrder: order,
            AssemblyRequisitionId: requisitionId
        }

        if (itemList.length <= 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Please Select Item" });
            return;
        }

        const res = await RequisitionService.Add(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                itemName: "",
                quantity: "",
                referenceNo: "",
                date: "",
                fromStoreId: '',
                toStoreId: '',
                itemList: [],
                viewItems: [],
                modelId: '',
                modelQty: '',
                colorId: '',
                order: ''

            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            this.props.navigate(`/packagingRequisition`, { replace: true });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

    }

    onSuggestionsFetchRequested = async ({ value }) => {

        var suggestionsList = await this.getSuggestions(value);
        this.setState({
            suggestions: suggestionsList
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };
    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
    };


    getSuggestions = async (value) => {
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
        //const res = await ModelService.GetDropdownlistByFilter(filter, resToken.token);
        const res = await ModelService.GetListForDropdownModelWithColor(filter, resToken.token);

        this.setState({
            items: res.data
        })

        var filteredList = this.state.items;

        var suggestionsList = inputLength === 0 ? [] : filteredList;
        return suggestionsList;
    };
    onReqChange = (event, { newValue }) => {
        this.setState({
            reqValue: newValue
        });
    };
    onSuggestionsReqFetchRequested = async ({ value }) => {

        var suggestionsList = await this.getReqSuggestions(value);
        this.setState({
            reqSuggestions: suggestionsList
        });
    };
    onSuggestionsReqClearRequested = () => {
        this.setState({
            reqSuggestions: []
        });
    };
    getReqSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const SearchTerm = inputValue;
        const date = this.state.reqDate;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        let filter = { SearchTerm, TransactionDate: date };

        //get item list for ddl
        // const res = await ModelService.GetDropdownlistByFilter(filter, resToken.token);
        const res = await this.getRequisitionList(filter, resToken.token);

        this.setState({
            items: res.data
        })

        var filteredList = this.state.items;

        var suggestionsList = inputLength === 0 ? [] : filteredList;
        return suggestionsList;
    };
    getRequisitionList = async (filter, token) => {

        let filteredList = await RequisitionService.GetRequistionByFilter(filter, token);

        return filteredList;
    }

    handleReqInputItem = (event) => {
        console.log(event);
        const value = event.value;
        const label = event.label;


        this.setState({
            reqValue: label,
            requisitionId: value
        });

    }
    render() {
        const { colors, order, reqValue, colorId, status, types, suggestions, value, specType, date, reqDate, referenceNo, viewItems, stores, fromStoreId, toStoreId, reqStatus, error, models, modelId, modelQty, reqSuggestions } = this.state;
        const inputProps = {
            placeholder: 'Type Model Name',
            value,
            onChange: this.onChange
        };
        const reqInputProps = {
            placeholder: 'Type Assembly Requisition Name',
            value: reqValue,
            onChange: this.onReqChange
        };
        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Model Wise Packaging Requisition",
                            title: "Model Wise Requisition Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Requisitions",
                            threeLayerLink: "/modelWiseRequisition",
                        }}
                    />

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">
                                <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                    <div className="row">
                                        {/* <div className="col-md-4">
                                            <div className="input-style-1">
                                                <label>
                                                    <b>Reference No.</b>
                                                </label>
                                                <input type="text" name="referenceNo" id="referenceNo" value={referenceNo} onChange={this.handleInputChange} autoComplete='off' />
                                                {error.referenceNo.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.referenceNo}</div>
                                                )}
                                            </div>
                                        </div> */}

                                        <div className="col-md-2">
                                            <div className="input-style-1">
                                                <label>
                                                    <b> Type</b>
                                                </label>
                                                <select className="form-control" name="specType" readOnly id="specType" onChange={this.handleInputChange} value={specType}>
                                                    <option value=""> Select One</option>
                                                    {types.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>{item.label}</option>
                                                        )
                                                    })}
                                                </select>
                                                {error.specType.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.specType}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-2">
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
                                        {/* <div className="col-md-3">
                                            <div className="input-style-1">
                                                <label><b>Color</b> </label>
                                                <select className="form-control" name="colorId" id="colorId" onChange={this.handleInputChange} value={colorId}>
                                                    <option value='0'> Select One</option>
                                                    {colors.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>{item.label}</option>
                                                        )
                                                    })}
                                                </select>

                                                {error.colorId.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.colorId}</div>
                                                )}

                                            </div>
                                        </div> */}
                                        <div className="col-md-3">
                                            <div className="input-style-1">
                                                <label>
                                                    <b>Order</b>
                                                </label>
                                                <input type="text" name="order" id="order" value={order} onChange={this.handleInputChange} autoComplete='off' />
                                                {error.order.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.order}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="input-style-1">
                                                <label> <b>From Store</b> </label>
                                                <select readOnly className="form-control" name="fromStoreId" id="fromStoreId" onChange={this.handleInputChange} value={fromStoreId} >
                                                    <option value='0'> Select One</option>
                                                    {stores.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>{item.label}</option>
                                                        )
                                                    })}
                                                </select>
                                                {error.fromStoreId.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.fromStoreId}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="input-style-1">
                                                <label> <b>To Store</b></label>
                                                <select className="form-control" readOnly name="toStoreId" id="toStoreId" onChange={this.handleInputChange} value={toStoreId}>
                                                    <option value='0'> Select One</option>
                                                    {stores.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>{item.label}</option>
                                                        )
                                                    })}
                                                </select>
                                                {error.toStoreId.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.toStoreId}</div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="input-style-1">
                                                <label>
                                                    <b>Assembly Requisition From Date</b>
                                                </label>
                                                <input type="date" name="reqDate" id="reqDate" value={reqDate} onChange={this.handleInputChange} />

                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="input-style-1">
                                                <label>
                                                    <b> Requisition </b>
                                                </label>
                                                <Autosuggest
                                                    suggestions={reqSuggestions}
                                                    onSuggestionsFetchRequested={this.onSuggestionsReqFetchRequested}
                                                    onSuggestionsClearRequested={this.onSuggestionsReqClearRequested}
                                                    getSuggestionValue={(suggestion) => suggestion.label}
                                                    renderSuggestion={(suggestion) =>
                                                        <div>
                                                            {suggestion.label}
                                                        </div>}
                                                    onSuggestionSelected={(event, { suggestion, method }) => {
                                                        this.handleReqInputItem(suggestion);
                                                    }}
                                                    inputProps={reqInputProps}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-md-8">
                                            {/* <div className="input-style-1">
                                                <label> <b>Model </b> </label>
                                                <select className="form-control" name="modelId" id="modelId" onChange={this.handleModelChange} value={modelId}>
                                                    <option value='0'> Select One</option>
                                                    {models.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>{item.label}</option>)
                                                    })}
                                                </select>
                                            </div> */}
                                            <div className="input-style-1">
                                                <label>
                                                    <b> Model </b>
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
                                                        this.handleModelChange(suggestion);
                                                    }}
                                                    inputProps={inputProps}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="input-style-1">
                                                <label>
                                                    <b>Model Quantity</b>
                                                </label>
                                                <input type="text" name="modelQty" id="modelQty" value={modelQty} onChange={this.handleModelQuantityChange} autoComplete='off' />
                                                {/* {error.referenceNo.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.referenceNo}</div>
                                                )} */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">
                                <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                    <div className="table-wrapper table-responsive">
                                        <table className="table striped-table">
                                            <thead className="tbHead" style={{ background: '#0d6efd', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                                <tr>
                                                    <th>
                                                        Item
                                                    </th>
                                                    <th>
                                                        Quantity
                                                    </th>
                                                    <th>
                                                        Current Quantity
                                                    </th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'Center' }}>
                                                {viewItems.map((item, i) => {
                                                    return (
                                                        <tr key={`item-${i}`}>
                                                            <td className="p-2" style={{ width: '70%' }}  >
                                                                <input className="form-control" readOnly type="text" defaultValue={item.label} style={{ background: item.error }} />
                                                            </td>
                                                            <td className="p-2">
                                                                <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} />
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.requestQty} /> */}
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.currentQty} />
                                                            </td>
                                                            {/* <td className="p-2">
                                                                <button className="main-btn danger-btn btn-hover" onClick={(event) => this.handleItemDeleted(event, item)} >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                            <td>

                                                            </td> */}
                                                        </tr>
                                                    );
                                                })
                                                }
                                            </tbody>
                                        </table>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b> Approval Status</b>
                                                    </label>
                                                    <select className="form-control" name="reqStatus" id="reqStatus" onChange={this.handleInputChange} value={reqStatus}>
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
                                        <div className="row">
                                            <div className="col-md-2" style={{ paddingTop: "28px" }}>
                                                <div className=" button-group d-flex justify-content-right flex-wrap">
                                                    <button className="main-btn primary-btn btn-hover w-60 text-center" onClick={this.handleSubmit}> Submit </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </Fragment >
        );
    }


}
export default withAuth(withRouter(PackagingRequisitionAdd));