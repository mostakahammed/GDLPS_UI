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

export class ModelItem extends Component {
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
            models:[],
            error: {

                modelId: ''
            }
        }
    }

    componentDidMount = async () => {


        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

       // get item list for ddl
        let model = await this.getModelList(resToken.token);

        this.setState({
            models: model.data
        })

        
    }

    getModelList = async (token) => {

        let filteredList = await ModelService.GetDropdownList(token);

        return filteredList;
    }

    handleInputChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    handleInputQuantity = (event, item) => {

        const requestQty = event.target.value;
        const requestQtyName = event.target.name;

        if (!requestQty || requestQty === '')
            return;

        var itemList = this.state.itemList;

        _.forEach(itemList, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.quantity = parseInt(requestQty)
        })

        this.setState({
            [requestQtyName]: requestQty
        })

        console.log(itemList)
    }

    handleItemDeleted = (event, item) => {
        var itemList = this.state.itemList;
        var viewItems = this.state.viewItems;

        var itemId = item.itemId;

        var selectedIndex = itemList.findIndex(function (x) { return x.itemId == itemId; });

        console.log(selectedIndex);

        itemList.splice(selectedIndex, 1);
        viewItems.splice(selectedIndex, 1);

        this.setState({
            itemList: itemList,
            viewItems: viewItems
        });
        console.log(itemList)
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

        var viewItem =
        {
            label: label,
            itemId: val
        }

        viewItems.push(viewItem);

        const eachItem = {
            itemId: val,
            quantity: 0
        }

        itemList.push(eachItem);

        this.setState({
            viewItems: viewItems,
            itemName: '',
            value:''
        });

    }

    handleSubmit = async (e) => {

        // e.preventDefault();
        this.validateFormOnLoginSubmit();
        if (!ValidateForm(this.state.error)) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! You must fill all the required fields" });
            return;
        }
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
        if (itemList.length <= 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Please Select Item" });
            return;
        }
         console.log(model);
        const res = await ModelItemService.Add(model, resToken.token);

        if (res.isSuccess) {
            this.setState({
                quantity: "",
                modelId: '',
                itemList: [],
                viewItems: []
            })
            Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.message });
            return;
        }

        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.message });
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
        const { viewItems, models, modelId, value, suggestions, reqStatus, error } = this.state;

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
                            isThreeLayer: false,
                            threeLayerTitle: "",
                            threeLayerLink: "",
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
                                                <select className="form-control" name="modelId" id="modelId" onChange={this.handleInputChange} value={modelId}>
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
                                                                <input className="form-control" readOnly type="text" defaultValue={item.label} />
                                                            </td>
                                                            <td className="p-2">
                                                                <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} autoComplete="off" />
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
export default withAuth(ModelItem);