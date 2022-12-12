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
import { withRouter } from '../../../shared/hoc/withRouter';

export class ModelItemEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            quantity: 0,
            itemList: [],
            viewItems: [],
            modelId: 0,
            value: '',
            suggestions: [],
            reqStatus: '',
            models: [],
            modelColors: [],
            modelColor: '',
            isUploading: true,
            btnUploadText: ' Submit',
            types: [],
            specType: '',
            error: {

                modelId: '',
                specType: ''

            }
        }
    }

    componentDidMount = async () => {

        const type = [
            {
                value: 'Assembly',
                label: 'Assembly'
            },
            {
                value: 'Packaging',
                label: 'Packaging'
            }
        ];
        const { Id } = this.props.useParams;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        // get item list for ddl

        let model = await this.getModelList(resToken.token);
        let modelColor = await this.getModelColorList(resToken.token);

        this.setState({
            models: model.data,
            types: type,
            specType: "Assembly",
            modelColors: modelColor.data
        })

        this.handleModelChange(Id);

    }

    getModelList = async (token) => {

        let filteredList = await ModelService.GetDropdownList(token);

        return filteredList;
    }
    getModelColorList = async (token) => {

        let filteredList = await ModelService.GetListForDropdownModelColor(token);

        return filteredList;
    }
    handleModelChange = async (value, type) => {

        // const target = event.target;
        // const value = target.value;
        // const name = target.name;
        var viewItems = this.state.viewItems;
        var items = this.state.items;
        var itemList = this.state.itemList;
        var newmodelId = value;
        var specType = this.state.specType;
        if (type != null) {
            specType = type;
        }
        var list = [];

        this.setState({
            modelId: value,
        });

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        let filter = { modelId: newmodelId, LineType: specType };

        //get item list for ddl
        // const res = await ModelItemService.GetListByFilter(filter, resToken.token);

        let res = await this.getModelItem(filter, resToken.token);

        this.setViewItems(res);
        itemList.splice(0, itemList.length)
        _.forEach(res, (item) => {

            const eachItem = {
                itemId: item.itemId,
                quantity: item.quantity,
                id: item.id,
                type: item.type
            }
            itemList.push(eachItem);
        })

        const initialViewItems = itemList;
        this.setState({
            viewItems: viewItems,
            itemList: itemList,
            initialViewItems: initialViewItems,
            itemName: '',
            value: ''
        });
    }
    getModelItem = async (filter, token) => {

        let filteredList = await await ModelItemService.GetListByFilter(filter, token);

        return filteredList.data;
    }
    setViewItems = async (res) => {
        var viewItems = this.state.viewItems;
        viewItems.splice(0, viewItems.length)

        _.forEach(res, (x) => {
            var viewItem =
            {
                label: x.item.title,
                itemId: x.itemId,
                quantity: x.quantity,
                id: x.id
            }
            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems
        })
    }

    handleInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });


        var modelId = this.state.modelId;

        // this.handleModelChange(modelId, value);
    }
    handleTypeChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });


        var modelId = this.state.modelId;

        this.handleModelChange(modelId, value);
    }

    handleInputQuantity = (event, item) => {

        var requestQty = event.target.value;
        const requestQtyName = event.target.name;

        if (!requestQty || requestQty === '') requestQty = 0;

        var itemList = this.state.itemList;
        var viewItems = this.state.viewItems;

        _.forEach(itemList, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.quantity = parseInt(requestQty)
        })
        _.forEach(viewItems, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.quantity = parseInt(requestQty)
        })

        this.setState({
            viewItems: viewItems
        })
    }

    handleItemDeleted = async (event, item) => {
        const { Id } = this.props.useParams;
        var itemList = this.state.itemList;
        var viewItems = this.state.viewItems;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        if (item.id > 0) {
            await ModelItemService.Delete(item.id, resToken.token);
        }


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
        this.formValidationObject('modelId', this.state.modelId);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "modelId":
                error.modelId = !value.length || value === '' ? "Model No is Required" : "";
                break;

            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };

    handleInputItem = (event) => {

        const value = event.value;
        const label = event.label;

        var viewItems = this.state.viewItems;
        var items = this.state.items;
        var itemList = this.state.itemList;
        var specType = this.state.specType;

        var val = parseInt(value);

        const isItemExist = _.some(viewItems,
            (oItem) => {
                return oItem.itemId === val;
            }
        );

        if (isItemExist) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Already Added" });
            return;
        }

        var viewItem =
        {
            label: label,
            itemId: val,
            quantity: ''
        }
        viewItems.splice(0, 0, viewItem);
        //viewItems.push(viewItem);

        const eachItem = {
            itemId: val,
            quantity: 0,
            id: 0,
            type: specType
        }
        itemList.splice(0, 0, eachItem);
        // itemList.push(eachItem);

        this.setState({
            viewItems: viewItems,
            itemName: '',
            value: ''
        });

    }
    copyModel = async () => {
        var modelId = this.state.modelId;
        var copyfromModelId = this.state.modelColor;
        var viewItems = this.state.viewItems;
        var items = this.state.items;
        var itemList = this.state.itemList;
        var specType = this.state.specType;

        let resToken = AuthenticationService.GetToken();

        var Cfilter = { ModelId: modelId, CopyfromModelId: copyfromModelId, LineType: specType }

        let response = await ModelService.CopyModel(Cfilter, resToken.token);
        // if (response.isSuccess) {
        //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "IMEI Not Found in System" });
        // }

        let filter = { modelId: modelId, LineType: specType };

        //get item list for ddl
        // const res = await ModelItemService.GetListByFilter(filter, resToken.token);

        let res = await this.getModelItem(filter, resToken.token);

        this.setViewItems(res);
        itemList.splice(0, itemList.length)
        _.forEach(res, (item) => {

            const eachItem = {
                itemId: item.itemId,
                quantity: item.quantity,
                id: item.id,
                type: item.type
            }
            itemList.push(eachItem);
        })

        const initialViewItems = itemList;
        this.setState({
            viewItems: viewItems,
            itemList: itemList,
            initialViewItems: initialViewItems,
            itemName: '',
            value: ''
        });

    }

    handleSubmit = async (e) => {

        // e.preventDefault();
        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }
        this.setState({
            isUploading: true,
            btnUploadText: ' Submitting...'
        })
        const { itemList, modelId } = this.state

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        const model = {
            ModelId: modelId,
            IsActive: true,
            ItemList: itemList
        }
        // if (itemList.length <= 0) {
        //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Please Select Item" });
        //     return;
        // }
       console.log(model);
        const res = await ModelItemService.Edit(model, resToken.token);

        if (res.response.isSuccess) {
            this.setState({
                quantity: "",
                modelId: '',
                itemList: [],
                viewItems: [],
                isUploading: false,
                btnUploadText: 'Submit'
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
            this.props.navigate(`/model`, { replace: true });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });

        this.setState({
            isUploading: false,
            btnUploadText: 'Submit'
        })
    }

    getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const SearchTerm = inputValue;
        const StoreId = this.state.fromStoreId;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        let filter = { SearchTerm, StoreId };

        //get item list for ddl
        const res = await StockInTransactioinService.GetListByFilterAndStore(filter, resToken.token);

        this.setState({
            items: res.data
        })

        var filteredList = this.state.items;

        var suggestionsList = inputLength === 0 ? [] : filteredList;
        return suggestionsList;
    };


    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });
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

    render() {
        const { modelColors,
            modelColor, btnUploadText, types, viewItems, models, modelId, value, suggestions, specType, error } = this.state;

        const inputProps = {
            placeholder: 'Type Item Name',
            value,
            onChange: this.onChange
        };

        return (
            <Fragment>
                <div className="container-fluid">
                    <Breadcrumb
                        BreadcrumbParams={{
                            header: "Spec for a Model ",
                            title: "SpecforModel Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Model",
                            threeLayerLink: "/model",
                        }}
                    />

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">
                                <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-style-1">
                                                <label> <b>Model </b> </label>
                                                {/* <select className="form-control" name="modelId" id="modelId" onChange={this.handleModelChange} value={modelId}> */}
                                                <select className="form-control" name="modelId" readOnly id="modelId" value={modelId}>
                                                    <option value='0'> Select One</option>
                                                    {models.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item.value}>{item.label}</option>
                                                        )
                                                    })}
                                                </select>
                                                {error.modelId.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.fromStoreId}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="input-style-1">
                                                <label>
                                                    <b> Type</b>
                                                </label>
                                                <select className="form-control" name="specType" id="specType" onChange={this.handleTypeChange} value={specType}>
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

                                    </div>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label> <b>Copy from Model </b> </label>
                                                    {/* <select className="form-control" name="modelId" id="modelId" onChange={this.handleModelChange} value={modelId}> */}
                                                    <select className="form-control" name="modelColor" id="modelColor" value={modelColor} onChange={this.handleInputChange}>
                                                        <option value='0'> Select One</option>
                                                        {modelColors.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                </div>
                                            </div>
                                            <div className="col-md-2" style={{ paddingTop: "28px" }}>
                                                <div className=" button-group d-flex justify-content-right flex-wrap">
                                                    <button className="main-btn info-btn btn-hover w-60 text-center" onClick={this.copyModel}> Copy </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                        Actions
                                                    </th>
                                                    <th> </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'Center' }}>
                                                {viewItems.map((item, i) => {
                                                    return (
                                                        <tr key={`item-${i}`}>
                                                            <td className="p-2" >
                                                                {item.label}
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" value={item.quantity}/> */}
                                                                <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" value={item.quantity} />
                                                            </td>
                                                            <td className="p-2">
                                                                <button className="main-btn danger-btn btn-hover" onClick={(event) => this.handleItemDeleted(event, item)} >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                            <td>

                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                                }
                                            </tbody>
                                        </table>
                                        {/* <div className="row">
                                            <div className="col-md-2" style={{ paddingTop: "28px" }}>
                                                <div className=" button-group d-flex justify-content-right flex-wrap">
                                                    <button className="main-btn primary-btn btn-hover w-60 text-center" onClick={this.handleSubmit}> {btnUploadText} </button>
                                                </div>
                                            </div>

                                        </div> */}
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
export default withAuth(withRouter(ModelItemEdit));