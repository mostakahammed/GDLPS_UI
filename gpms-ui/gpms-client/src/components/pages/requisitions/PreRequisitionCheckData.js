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
import PreRequisitieRpt from "./PreRequisitieRpt";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faPrint } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from "xlsx";


export class PreRequisitionCheckData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            quantity: 0,
            referenceNo: "",
            itemList: [],
            viewItemList: [],
            viewItems: [],

            value: '',
            suggestions: [],
            reqStatus: 'Pending',
            models: [],
            modelId: 0,
            modelQty: 1,
            initialViewItems: [],
            initialItemList: [],

        }
    }

    componentDidMount = async () => {

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }


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
                error: "white",
                extraNeeded: 0
            }
            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems
        })
    }

    handleModelChange = async (event) => {


        var viewItems = this.state.viewItems;
        var items = this.state.items;
        var itemList = this.state.itemList;
        var viewItemList = this.state.viewItemList;

        const value = event.value;
        const label = event.label;
        var newmodelId = value;

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

        let filter = { modelId: newmodelId, LineType: '' };

        //get item list for ddl
        // const res = await ModelItemService.GetListByFilter(filter, resToken.token);
        let res = await this.getModelItem(filter, resToken.token);

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
                viewItems[index].error = "red";
                viewItems[index].extraNeeded = viewItems[index].requestQty - initialViewItems[index].currentQty;
            }
            else {
                viewItems[index].error = "white";
                viewItems[index].extraNeeded = 0;
            }
        })

        this.setState({
            viewItems: viewItems,
        })
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

    downloadExcel = () => {
        const newData = this.state.viewItems;

        newData.map((row, index) => {
            row['Label'] = row['label'];
            row['RequestQty'] = row['requestQty'];
            row['CurrentQty'] = row['currentQty'];
            row['ExtraNeeded'] = row['extraNeeded'];
            delete row['label'];
            delete row['requestQty'];
            delete row['currentQty'];
            delete row['extraNeeded'];
            delete row['itemId'];
            delete row['error'];
        });

        const workSheet = XLSX.utils.json_to_sheet(newData)
        const workBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workBook, workSheet, "students")
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, "StudentsData.xlsx");

    }
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
       // const res = await ModelService.GetDropdownlistByFilter(filter, resToken.token);
       const res = await ModelService.GetListForDropdownModelWithColor(filter, resToken.token);
        

        this.setState({
            items: res.data
        })

        var filteredList = this.state.items;

        var suggestionsList = inputLength === 0 ? [] : filteredList;
        return suggestionsList;
    };

    render() {
        const { suggestions, value, viewItems, stores, fromStoreId, toStoreId, reqStatus, error, models, modelId, modelQty } = this.state;

        const inputProps = {
            placeholder: 'Type Item Name',
            value,
            onChange: this.onChange
        };

        return (
            <Fragment>

                <div className="container-fluid">

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">
                                <div className="card-style mb-30" style={{ marginBottom: "0px" }}>

                                    <div className="row">
                                        <div className="col-md-3" >

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
                                        <div className="col-md-3" >
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
                                        <div className='col-md-6' style={{ textAlign: 'right' }}>
                                            <div className="row">
                                            <div className='col-md-10'></div>
                                            <div className='col-md-2' style={{ textAlign: 'right' }}>
                                                <ReactToPrint
                                                    trigger={() => <a href="#"> <FontAwesomeIcon icon={faPrint} />
                                                     PDF</a>}
                                                    content={() => this.componentRef}
                                                />
                                                </div>
                                                {/* <div className='col-md-1'>
                                                    <button className="btn-primary" onClick={(event) => this.downloadExcel()} >
                                                    <FontAwesomeIcon icon={faFileExcel} />
                                                    </button>  
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">
                                <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                    <div className="table-wrapper table-responsive ">
                                        <table className="table striped-table">
                                            <thead className="tbHead" style={{ background: '#0d6efd', color: 'white', textAlign: 'Center', fontSize: 'small' }}>
                                                <tr>
                                                    <th>
                                                        Item
                                                    </th>
                                                    <th>
                                                        Required Quantity
                                                    </th>
                                                    <th>
                                                        Current Quantity
                                                    </th>
                                                    <th >
                                                        Extra Needed
                                                    </th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'Center' }}>
                                                {viewItems.map((item, i) => {
                                                    return (
                                                        <tr key={`item-${i}`}>
                                                            <td className="p-2" style={{ width: '60%', background: item.error }} >
                                                                <input className="form-control" readOnly type="text" defaultValue={item.label} />
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.requestQty} />
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.currentQty} />
                                                            </td>
                                                            <td className="p-2 " style={{ background: item.error }}>
                                                                <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.extraNeeded} />

                                                            </td>
                                                            {/* <td>

                                                            </td>  */}
                                                        </tr>
                                                    );
                                                })
                                                }
                                            </tbody>
                                        </table>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ display: 'None' }}>
                    <PreRequisitieRpt model={value} qty={modelQty} data={viewItems} ref={el => (this.componentRef = el)} />
                </div>
            </Fragment >

        );
    }


}
export default withAuth((PreRequisitionCheckData));