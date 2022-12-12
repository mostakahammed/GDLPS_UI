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
import { withRouter } from "../../../shared/hoc/withRouter";
import { ColorService } from "../../../shared/services/colors/ColorService";

export class RequisitionModelEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            itemName: "",
            quantity: 0,
            referenceNo: "",
            date: "",
            itemList: [],
            viewItems: [],
            stores: [],
            fromStoreId: 0,
            toStoreId: 0,
            status: [],
            value: '',
            suggestions: [],
            reqStatus: '',
            requisitionId: 0,
            modelQty: 0,
            initialViewItems: [],
            actualQty: 0,
            initialItemList: [],
            isUploading: true,
            btnUploadText: ' Submit',
            colors: [],
            colorId: 0,
            type: "",
            order: '',
            error: {

                referenceNo: '',
                fromStoreId: '',
                toStoreId: '',
                reqStatus: '',
                date: '',
                colorId: '',
                order: ''
            }
        }
    }

    componentDidMount = async () => {

        const status = [
            // {
            //     value: 'Pending',
            //     label: 'Pending'
            // },
            {
                value: 'Approved',
                label: 'Approve'
            },
            {
                value: 'Rejected',
                label: 'Reject'
            }
        ];
        var viewItems = this.state.viewItems;
        var itemList = this.state.itemList;
        var initialItemList = this.state.initialItemList;
        var initialColorViewItems = this.state.initialColorViewItems;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        const { requisitionId } = this.props.useParams;

        let store = await this.getStoreList(resToken.token);
        let requisitionDetails = await this.getRequisitionDetails(requisitionId, resToken.token);
        let color = await this.getColorList(resToken.token);

        var reqFirstVal = _.first(requisitionDetails.data);

        if (reqFirstVal.approvedStatus == 'Approved') {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Alredy approved" });

            this.setState({
                requisitionId: 0
            })
            return;
        }
        _.forEach(requisitionDetails.data, (rItem) => {
            var viewItem =
            {
                label: rItem.itemName,
                itemId: rItem.itemId,
                requestQty: rItem.requestQty,
                currentQty: rItem.currentQty,
                error: "white"
            }

            viewItems.push(viewItem);
        });


        _.forEach(requisitionDetails.data, (rItem) => {
            const eachItem = {
                Id: rItem.id,
                requisitionId: rItem.requisitionId,
                itemId: rItem.itemId,
                requestQty: rItem.requestQty,
                approvedStatus: 'Pending'
            }
            itemList.push(eachItem);
        });

        _.forEach(requisitionDetails.data, (rItem) => {
            const eachItem = {
                Id: rItem.id,
                requisitionId: rItem.requisitionId,
                itemId: rItem.itemId,
                requestQty: rItem.requestQty,
                approvedStatus: 'Pending'
            }
            initialItemList.push(eachItem);
        });

        const referenceNo = reqFirstVal.requisitionNo;
        const order = reqFirstVal.reqOrder;
        const fromStoreId = reqFirstVal.fromStoreId;
        const toStoreId = reqFirstVal.toStoreId;
        // const date = reqFirstVal.requisitionDate;
        const modelQty = reqFirstVal.itemQuantity;
        const type = reqFirstVal.type;
        const colorId = reqFirstVal.colorId;
        const initialViewItems = initialItemList;
        const requisitionDateInText = reqFirstVal.requisitionDateInText;


        this.setState(
            {
                requisitionId: requisitionId,
                status: status,
                stores: store.data,
                referenceNo: referenceNo,
                fromStoreId: fromStoreId,
                toStoreId: toStoreId,
                viewItems: viewItems,
                date: requisitionDateInText,
                modelQty: modelQty,
                itemList: itemList,
                initialViewItems: initialViewItems,
                actualQty: modelQty,
                colorId: colorId,
                colors: color.data,
                order: order,
                type: type
            }
        )
    }

    getStoreList = async (token) => {

        let filteredList = await StoreService.GetDropdownList(token);

        return filteredList;
    }
    getRequisitionDetails = async (requisitionId, token) => {

        this.setState({
            loading: true,
        });
        const res = await RequisitionService.GetDetailsByRequisitionIdWithCurrentQty(requisitionId, token);

        return res;

    };
    getColorList = async (token) => {

        let filteredList = await ColorService.GetDropdownList(token);

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

        var requestQty = event.target.value;
        const requestQtyName = event.target.name;

        if (!requestQty || requestQty === '') requestQty = 0;

        var itemList = this.state.itemList;
        var viewItems = this.state.viewItems;

        _.forEach(itemList, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.requestQty = parseInt(requestQty)
        })
        _.forEach(viewItems, (oitem) => {
            if (oitem.itemId === item.itemId)
                oitem.requestQty = parseInt(requestQty)
        })

        this.setState({
            // [requestQtyName]: requestQty,
            viewItems: viewItems
        })
    }
    handleModelQuantityChange = (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;
        var modelQty = value;

        var viewItems = this.state.viewItems;
        var initialViewItems = this.state.initialViewItems;
        const actualQty = this.state.actualQty;


        this.setState({
            [name]: value,
        });

        if (value == '') { modelQty = 1 }

        _.forEach(initialViewItems, (vItem, index) => {

            viewItems[index].requestQty = (vItem.requestQty / actualQty) * parseInt(modelQty);
        })
        // _.forEach(initialViewItems, (vItem, index) => {

        //     itemList[index].requestQty = (vItem.requestQty/actualQty) * parseInt(modelQty);
        // })

        this.setState({
            viewItems: viewItems
        })
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
    }


    validateFormOnLoginSubmit = () => {
        this.formValidationObject('referenceNo', this.state.referenceNo);
        // this.formValidationObject('fromStoreId', this.state.fromStoreId);
        // this.formValidationObject('toStoreId', this.state.toStoreId);
        this.formValidationObject('reqStatus', this.state.reqStatus);
        this.formValidationObject('date', this.state.date);
        this.formValidationObject('order', this.state.order);
    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "referenceNo":
                error.referenceNo = !value.length || value === '' ? "Reference No is Required" : "";
                break;
            case "fromStoreId":
                error.fromStoreId = !value.length || value === '' ? "From Store is Required" : "";
                break;
            case "toStoreId":
                error.toStoreId = !value.length || value === '' ? "To Store is Required" : "";
                break;
            case "date":
                error.date = !value.length || value === '' ? "Date is Required" : "";
                break;
            case "reqStatus":
                error.reqStatus = !value.length || value === '' ? "Status is Required" : "";
                break;
            case "order":
                error.order = !value.length || value === '' ? "Order is Required" : "";
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
        var requisitionId = parseInt(this.state.requisitionId);

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
            RequisitionId: requisitionId,
            itemId: val,
            requestQty: 0,
            approvedStatus: 'Pending'
        }

        itemList.push(eachItem);

        this.setState({
            viewItems: viewItems,
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
        const { itemList, modelQty, referenceNo,type, date, order, fromStoreId, toStoreId, reqStatus, requisitionId, initialColorViewItems } = this.state
        var viewItems = this.state.viewItems;
        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        if (requisitionId <= 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Already approved" });
        }

        _.forEach(viewItems, (vItem, index) => {

            itemList[index].requestQty = vItem.requestQty;
        })

        const model = {
            Id: requisitionId,
            RequisitionNo: referenceNo,
            RequisitionDate: date,
            FromStoreId: fromStoreId,
            ToStoreId: toStoreId,
            IsActive: true,
            RequisitionStatus: reqStatus,
            RequisitionDetail: itemList,
            ItemQuantity: modelQty,
            ReqOrder: order,
            Type:type,
        }

        if (itemList.length <= 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: " Please Select Item" });
            return;
        }

        const res = await RequisitionService.Add(model, resToken.token);
     
        if (res.response.isSuccess) {
            this.setState({
                requisitionId: 0,
                itemName: "",
                quantity: "",
                referenceNo: "",
                date: "",
                fromStoreId: '',
                toStoreId: '',
                viewItems: [],
                isUploading: false,
                btnUploadText: 'Submit'

            })
       
            if (this.state.type == "Assembly") {
                Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
                this.props.navigate(`/modelWiseRequisition`, { replace: true });
                return;
            }
            else {
                Toaster.Notify({ type: ToasterTypeConstants.Success, message: res.response.message });
                this.props.navigate(`/packagingRequisition`, { replace: true });
                return;
            }
        }

        _.forEach(viewItems, (vItem, index) => {
            // viewItems[index].error = "#e9ecef";
            viewItems[index].error = "white";
            if (res.response.errorList.includes(index)) {
                viewItems[index].error = "red";
            }
        })

        this.setState({
            viewItems: viewItems,
            btnUploadText: 'Submit'
        })
        Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });
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
        const { status, order, date, colors, colorId, referenceNo, viewItems, stores, fromStoreId, toStoreId, value, suggestions, reqStatus, error, modelQty, btnUploadText } = this.state;

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
                            header: "Edit Requisition",
                            title: "Requisition Add",
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
                                        <div className="col-md-6">
                                            <div className="input-style-1">
                                                <label>
                                                    <b>Reference No.</b>
                                                </label>
                                                <input type="text" name="referenceNo" id="referenceNo" value={referenceNo} onChange={this.handleInputChange} autoComplete='off' />
                                                {error.referenceNo.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.referenceNo}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
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
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-style-1">
                                                <label> <b>From Store</b> </label>
                                                <select className="form-control" name="fromStoreId" id="fromStoreId" onChange={this.handleInputChange} value={fromStoreId}>
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
                                        <div className="col-md-6">
                                            <div className="input-style-1">
                                                <label> <b>To Store</b> </label>
                                                <select className="form-control" name="toStoreId" id="toStoreId" onChange={this.handleInputChange} value={toStoreId}>
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

                                        <div className="col-md-6">
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
                                        <div className="col-md-6">
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
                                        </div>
                                        {/* <div className="col-md-4">
                                                <div className="input-style-1">
                                                    <label><b>Color</b> </label>
                                                    <input type="text" name="colorId" id="colorId" value={colorId} onChange={this.handleInputChange} autoComplete='off' />
                                                     
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
                                                {error.referenceNo.length > 0 && (
                                                    <div style={{ display: "block" }} className="invalid-feedback"> {error.referenceNo}</div>
                                                )}
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
                                                    <th style={{ width: "70%" }}>
                                                        Item
                                                    </th>
                                                    <th>
                                                        Quantity
                                                    </th>
                                                    <th>
                                                        Current Quantity
                                                    </th>
                                                    {/*  <th> </th> */}
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'Center' }}>
                                                {viewItems.map((item, i) => {
                                                    return (
                                                        <tr key={`item-${i}`}>
                                                            <td className="p-2" style={{ width: "70%" }} >
                                                                <input className="form-control" readOnly type="text" defaultValue={item.label} style={{ background: item.error }} />
                                                            </td>
                                                            <td className="p-2">
                                                                <input className="form-control" type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} />
                                                                {/* <input className="form-control" readonly type="text" name="quantity" id="quantity"  defaultValue={item.requestQty} />  */}
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.requestQty} /> */}
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" readonly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} Value={item.requestQty} /> */}
                                                                {/* <input className="form-control" readonly type="text" name="quantity" id="quantity"  defaultValue={item.requestQty} />  */}
                                                                <input className="form-control" readOnly type="text" defaultValue={item.currentQty} />
                                                            </td>
                                                            {/* <td className="p-2">
                                                                <button className="main-btn danger-btn btn-hover" onClick={(event) => this.handleItemDeleted(event, item)} >
                                                                    Delete
                                                                </button>
                                                            </td> */}
                                                            {/* <td>

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
                                                    <select className="form-control" name="reqStatus" id="reqStatus" onChange={this.handleInputChange}>
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
                                                <div className=" button-group d-flex justify-content-right ">
                                                    <button className="main-btn primary-btn btn-hover w-60 text-center" onClick={this.handleSubmit}> {btnUploadText} </button>
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
export default withAuth(withRouter(RequisitionModelEdit));