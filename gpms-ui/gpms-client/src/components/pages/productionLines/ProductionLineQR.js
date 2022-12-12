import React, { Component, Fragment } from 'react'
import { LineService } from '../../../shared/services/lines/LineService';
import Breadcrumb from '../../mics/Breadcrumb';
import { AuthenticationService } from "../../../shared/services/authentications/AuthenticationService";
import { ValidateForm } from "../../../shared/utilities/ValidateForm";
import { Toaster } from "../../../shared/utilities/Toaster";
import { ToasterTypeConstants } from "../../../shared/utilities/GlobalConstrants";
import { LineStationService } from '../../../shared/services/lineStation/LineStationService';
import { StationService } from '../../../shared/services/stations/StationService';
import Select from 'react-select'
import withAuth from '../../../shared/hoc/AuthComponent';
import { UserService } from '../../../shared/services/users/UserService';
import { withRouter } from '../../../shared/hoc/withRouter';
import { RequisitionService } from '../../../shared/services/requisitions/ResquisitionService';
import { ProductionService } from '../../../shared/services/productions/ProductionService';
import { ProductionLineService } from '../../../shared/services/productionLines/ProductionLineService';
import filter from 'lodash/filter';
import _ from 'lodash';
import Item from '../items/Item';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { confirmAlert } from 'react-confirm-alert';
import Autosuggest from 'react-autosuggest';

export class ProductionLineQR extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lines: [],
            lineTypes: [],
            lineId: 19,
            users: [],
            lineLeaderUserId: 0,
            sortOrder: "",
            date: "",
            requisitionNo: "",
            manpower: "",
            manpowerPresent: "",
            manpowerAbsent: "",
            requisitionId: 0,
            value: '',
            id: 0,
            createdOn: '',
            howManyQR: 0,
            lineName: '',
            modelName: '',
            colorName: '',
            productionlineId: 0,
            viewItems: [],
            requisitionList: [],
            requisitionId: 0,
            suggestions: [],


            //validation
            error: {
                lineId: '',
                lineLeaderUserId: '',
                sortOrder: '',
                date: "",
                requisitionNo: "",
                manpower: "",
                manpowerPresent: "",
                manpowerAbsent: "",
            }
        }
    }

    componentDidMount = async () => {

        const { Id } = this.props.useParams;
        var viewItems = this.state.viewItems;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        //get station list for ddl
        var today = new Date();
        var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
        var date = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
        var curTime = today.getFullYear() + "-" + month + "-" + date;
        let line = await this.getLineList(resToken.token);
        let user = await this.getUserList(resToken.token);
        // let requisition = await this.getRequisitionList(resToken.token);


        this.setState(
            {
                lines: line.data,
                users: user.data,
                date: curTime
                //  requisitionList:requisition.data
            }
        )
        var filter = { productionLineId: Id };
        let productionDetails = await this.getProductionDetails(Id, resToken.token);
        let lineQRDetails = await this.getlineQRDetails(filter, resToken.token);

        _.forEach(lineQRDetails, (item, index) => {
            var viewItem =
            {
                sl: index + 1,
                quantity: item.quantity,
                createdOn: item.createdOn,
                id: item.id
            }
            viewItems.push(viewItem);
        })


        this.setState(
            {
                productionlineId: productionDetails.id,
                lineName: productionDetails.line.name,
                modelName: productionDetails.model.name,
                colorName: productionDetails.color.name,
                lineId: productionDetails.lineId,
                modelId: productionDetails.modelId,
                colorId: productionDetails.colorId,
                createdOn: productionDetails.createdOn,
                viewItems: viewItems,

            }
        )

    }

    getLineList = async (token) => {

        let filteredList = await LineService.GetDropdownList(token);

        return filteredList;
    }
    getUserList = async (token) => {

        let filteredList = await UserService.GetDropdownList(token);

        return filteredList;
    }
    getRequisitionList = async (filter, token) => {

        let filteredList = await RequisitionService.GetRequistionByFilter(filter, token);

        return filteredList;
    }
    getRequisitionDetails = async (Id, token) => {

        this.setState({
            loading: true,
        });
        const res = await RequisitionService.GetDetailsById(Id, token);

        return res;

    };
    getlineQRDetails = async (filter, token) => {

        const res = await ProductionLineService.getQRHistoryByProductionLineId(filter, token);

        return res.data;

    };
    getProductionDetails = async (Id, token) => {

        const res = await ProductionLineService.GetDetailsById(Id, token);

        return res.data;

    };



    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        this.formValidationObject(name, value);
    };

    validateFormOnLoginSubmit = () => {

        this.formValidationObject('howManyQR', this.state.howManyQR);

    }

    formValidationObject = (name, value) => {
        let error = this.state.error;
        switch (name) {
            case "lineId":
                error.lineId = !value.length || value === '' ? "line is Required" : "";
                break;
            case "lineLeaderUserId":
                error.lineLeaderUserId = !value.length || value === '' ? "line Leader User is Required" : "";
                break;
            case "date":
                error.date = !value.length || value === '' ? "Date is Required" : "";
                break;
            case "requisitionNo":
                error.requisitionNo = !value.length || value === '' ? "RequisitionNo is Required" : "";
                break;
            case "Manpower":
                error.manpower = !value.length || value === '' ? "Manpower User is Required" : "";
                break;
            case "manpowerPresent":
                error.manpowerPresent = !value.length || value === '' ? "man power Present is Required" : "";
                break;
            case "manpowerAbsent":
                error.manpowerAbsent = !value.length || value === '' ? "Man power Absent is Required" : "";
                break;
            case "howManyQR":
                error.howManyQR = !value.length || value === '' ? "how Many QR is Required" : "";
                break;

            default:
                break;
        }

        this.setState({
            error,
            [name]: value
        })
    };

    confirmPrint = () => {
        confirmAlert({
            title: "Confirmation",
            message: "Are you sure you want to Print?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        this.printQR();
                    },
                    className: "btn btn-sm btn-primary btn-info",
                },
                {
                    label: "No",
                    onClick: () => console.log("no"),
                    className: "btn btn-sm btn-danger btn-no-alert",
                },
            ],
        });
    }
    printQR = () => {

        var productionlineId = this.state.productionlineId;
        var modelId = this.state.modelId;
        var colorId = this.state.colorId;
        var requisitionId = this.state.requisitionId;
        console.log(requisitionId);
        var howManyQR = parseInt(this.state.howManyQR);

        if (howManyQR <= 0) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Please Check QR Print Quantity" });
            return;
        }

        this.props.navigate(`/productionLineQRCode/${modelId}/${colorId}/${howManyQR}/${productionlineId}/${requisitionId}`, { replace: true });
    };

    QRHistoryprintQR = (event, item) => {

        var productionlineId = this.state.productionlineId;
        this.props.navigate(`/generateQRHistoryQRCode/${item.id}/${productionlineId}`, { replace: true });
    };


    handleSubmit = async (e) => {
        e.preventDefault();

        this.confirmPrint();
    };

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

    handleInputItem = (event) => {

        const value = event.value;
        const label = event.label;


        this.setState({
            value: label,
            requisitionId: value
        });

    }
    getSuggestions = async (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        const SearchTerm = inputValue;
        const date = this.state.date;

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
    render() {
        const { lineName, modelName, colorName, viewItems, requisitionList, requisitionId, value, suggestions,
            createdOn, howManyQR, lines, stations, colorId, lineId, modelId, stationId, sortOrder, error, lineLeaderUserId, users, date, requisitionNo, manpower, manpowerPresent, manpowerAbsent } = this.state;


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
                            header: "Add Production",
                            title: "Production Add",
                            isDashboardMenu: false,
                            isThreeLayer: true,
                            threeLayerTitle: "Productions",
                            threeLayerLink: "/productionLine",
                        }}
                    />

                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            <div className="row align-items-center">

                                <form className="form-elements-wrapper" onSubmit={this.handleSubmit} noValidate>
                                    <div className="card-style mb-30" style={{ marginBottom: "0px" }}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Line No:</b>   {lineName}
                                                    </label>

                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Model: </b> {modelName}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Color: </b> {colorName}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b>Create Date :</b>   {createdOn}
                                                    </label>

                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            {/* <div className="col-md-6">
                                                <div className="input-style-1">
                                                    <label><b> Requisition</b> </label>
                                                    <select className="form-control" name="requisitionId" id="requisitionId" onChange={this.handleInputChange} value={requisitionId}>
                                                        <option value=""> Select One</option>
                                                        {requisitionList.map((item, index) => {
                                                            return (
                                                                <option key={index} value={item.value}>{item.label}</option>
                                                            )
                                                        })}
                                                    </select>

                                                
                                                </div>
                                            </div> */}

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
                                            <div className="col-md-3">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b> Requisition </b>
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
                                            <div className="col-md-3">
                                                <div className="input-style-1">
                                                    <label>
                                                        <b> How Many QR want to Print </b>
                                                    </label>

                                                    <input type="text" name="howManyQR" id="howManyQR" value={howManyQR} onChange={this.handleInputChange} autoComplete='off' />

                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <label>

                                                </label>
                                                <div className=" button-group d-flex justify-content-left flex-wrap">
                                                    <button className="main-btn btn-info btn-hover w-60 text-center" type="submit" >
                                                        <FontAwesomeIcon icon={faPrint}></FontAwesomeIcon> Print </button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </form>

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
                                                        sl
                                                    </th>
                                                    <th>
                                                        Quantity
                                                    </th>
                                                    <th>
                                                        Date
                                                    </th>
                                                    <th> Print QR </th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: 'Center' }}>
                                                {viewItems.map((item, i) => {
                                                    return (
                                                        <tr key={`item-${i}`}>
                                                            <td className="p-2" style={{ width: '10%' }}  >
                                                                <input className="form-control" readOnly type="text" defaultValue={item.sl} style={{ background: item.error }} />
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                <input className="form-control" readOnly type="text" name="quantity" id="quantity" value={item.quantity} />
                                                            </td>
                                                            <td className="p-2">
                                                                {/* <input className="form-control" readOnly type="text" name="quantity" id="quantity" onChange={(event) => this.handleInputQuantity(event, item)} value={item.requestQty} /> */}
                                                                <input className="form-control" readOnly type="text" name="createdOn" id="createdOn" value={item.createdOn} />
                                                            </td>
                                                            <td className="p-2">
                                                                <button className="main-btn btn-info btn-hover" onClick={(event) => this.QRHistoryprintQR(event, item)} >
                                                                    <FontAwesomeIcon icon={faPrint}></FontAwesomeIcon> Print
                                                                </button>
                                                            </td>
                                                            {/* <td>

                                                            </td> */}
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

            </Fragment>
        )
    }
}

export default withAuth(withRouter(ProductionLineQR));
