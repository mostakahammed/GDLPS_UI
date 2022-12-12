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
import { FailedMessageService } from "../../../shared/services/failedMessages/FailedMessageService";
import { StationService } from "../../../shared/services/stations/StationService";
import { ProductionDailyService } from "../../../shared/services/productionDailys/ProductionDailyService";
import { withRouter } from "../../../shared/hoc/withRouter";
import { NewitemService } from "../../../shared/services/newItems/NewItemservice";
import FailedMessagesModalPopup from "./FailedMessagesModalPopup";
import { CartonDoneService } from "../../../shared/services/cartonDones/CartonDoneService";
import { BarcodeScanner } from "./BarcodeScanner";
import { ProductionRepairingService } from "../../../shared/services/productionRepairings/ProductionRepairingService";
import filter from "lodash/filter";
import useDocumentTitle from "../../title/UseDocumentTitle";
import { LineService } from "../../../shared/services/lines/LineService";




export class StationDashBoard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            qrCode: '',
            date: '',
            value: '',
            viewItems: [],
            failedMessages: [],
            failedStatus: '',
            failedDivContainer: false,
            aliasName: "",
            stationId: 0,
            sortOrder: 0,
            actionType: "",
            productionId: 0,
            showModalPopup: false,
            passed: 0,
            failed: 0,
            faultPercent: 0,
            total: 0,
            productionDailyId: 0,
            stationAlias: '',
            imei: '',
            inputQr: '',
            searchType: '',

            error: {

                modelId: ''
            }
        }
    }

    componentDidMount = async () => {


        const sidebarNavWrapper = document.querySelector(".sidebar-nav-wrapper");
        const mainWrapper = document.querySelector(".main-wrapper");
        const overlay = document.querySelector(".overlay");

        sidebarNavWrapper.classList.add("active");
        overlay.classList.add("active");
        mainWrapper.classList.add("active");

        const { alias } = this.props.useParams;
        var viewItems = this.state.viewItems;
        var passed = this.state.passed;
        var failed = this.state.failed;
        var faultPercent = this.state.faultPercent;
        var total = this.state.total;

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }


        let failedMessage = await this.getFailedMessageList(resToken.token);
        let aliasInfo = await this.getAliasInfo(alias, resToken.token);


        let filter = { StationId: aliasInfo.data.id };

        const res = await ProductionDailyService.GetListByFilter(filter, resToken.token);

        const resPassFailData = await ProductionDailyService.GetPassFailDataByFilter(filter, resToken.token);
        if (resPassFailData.data.length > 0) {
            passed = resPassFailData.data[0].passed;
            failed = resPassFailData.data[0].failed;
            faultPercent = resPassFailData.data[0].faultPercent;
            total = passed + failed;
        }
        document.title = aliasInfo.data.name + ' ' + "Dashboard";
        if (aliasInfo.data.alias == 'cartonDone') {
            await this.passCartonDone('', resToken.token);
        }
        else if (aliasInfo.data.alias == 'faultyReceived') {
            await this.receiveFaulty('', resToken.token);
        }
        else if (aliasInfo.data.alias == 'repairedReceived') {
            await this.receiveRepair('', resToken.token);
        }

        else {
            viewItems = [];
            _.forEach(res.data, (item) => {

                var viewItem =
                {
                    productRefNum: item.productRefNum,
                    imei1: item.newItem == null ? '' : item.newItem.imeI1,
                    imei2: item.newItem == null ? '' : item.newItem.imeI2,
                    station: item.station.name,
                    date: item.date,
                    stationStatus: item.stationStatus,
                    isFailed: item.isFailed,
                }

                viewItems.push(viewItem);
            })
            this.setState({
                viewItems: viewItems,
                total: total,
                passed: passed,
            })

        }
        this.setState({
            failedMessages: failedMessage.data,
            aliasName: aliasInfo.data.name,
            stationId: aliasInfo.data.id,
            sortOrder: aliasInfo.data.sortOrder,
            searchType: aliasInfo.data.searchType,
            //  viewItems: viewItems,
            qrCode: "",
            actionType: aliasInfo.data.actionType,
            // passed: passed,
            failed: failed,
            faultPercent: parseInt(faultPercent.toFixed(2)),
            //  total: total,
            stationAlias: aliasInfo.data.alias
        })
        this.barGncodeAutoFocus();

    }

    getFailedMessageList = async (token) => {

        let filteredList = await FailedMessageService.GetDropdownList(token);

        return filteredList;
    }
    getAliasInfo = async (alias, token) => {

        let filteredList = await StationService.GetDetailsByAlias(alias, token);

        return filteredList;
    }

    handleInputChange = async (event) => {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            productionDailyId: 0
        })
        var lastTwo = value.substr(value.length - 2); // => "Tabs1"

        if (lastTwo == "-Y") {
            var code = value.slice(0, value.length - 2);

            this.handleInputItem(code);
        }
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


    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });

    };
    handleInputItem = async (code, lineNo, imei) => {

        // const value = event.value;
        // const label = event.label;

        // const qrCode = code;
        const qrCode = code;
        var lineNo = lineNo;
        // const qrCode = this.state.qrCode;

        const stationId = this.state.stationId;
        const sortOrder = this.state.sortOrder;

        var viewItems = this.state.viewItems;
        var IsFailed = false;
        var productionDailyId = 0;

        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        const lineInfo = await LineService.GetLineByLineNo(lineNo, resToken.token);
        var lineId = lineInfo.data.id;
        if (qrCode == "") {
            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            if (this.state.stationAlias == 'IMEIMerge') {
                document.getElementById("SearchbyCode").focus();
            }
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Please enter Valid QR Code" });
            return;
        }

        if (this.state.stationAlias == 'cartonDone') {
            await this.passCartonDone(qrCode, resToken.token);

        }
        else if (this.state.stationAlias == 'faultyReceived') {
            await this.receiveFaulty(qrCode, resToken.token);
        }
        else if (this.state.stationAlias == 'repairedReceived') {
            await this.receiveRepair(qrCode, resToken.token);
        }
        else {

            const { searchType } = this.state;
            //const isExist = await NewitemService.GetDetailsByCode(qrCode, resToken.token);
            var isExist = await this.checkCode(searchType, qrCode, resToken.token);

            var updateIMEIRes = true;
            var checkImeiWeightRes = true;

            if (!isExist.isSuccess) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: isExist.message });
                this.setState({
                    qrCode: "",
                    imei: '',
                    inputQr: '',

                });
                if (this.state.stationAlias == 'IMEIMerge') {
                    document.getElementById("SearchbyCode").focus();
                }
                //Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Please enter Valid QR Code" });
                return;
            }

            if (isExist.data.productStationId != stationId && isExist.data.isFailed && isExist.data.station.name != "OQC" && this.state.stationAlias != "WeightScale") {
                Toaster.Notify({ type: ToasterTypeConstants.Error, message: `Failed in ${isExist.data.station.name} Station` });
                return;
            }

            if (isExist.data.productStationId == stationId && isExist.data.isFailed == false) {
                Toaster.Notify({ type: ToasterTypeConstants.Error, message: `This Product Already Passed This Station..!!` });
                return;
            }

            if (this.state.stationAlias == 'IMEIMerge') {
                var updateIMEI = await this.mergeIMEI(qrCode, resToken.token, imei);
                if (!updateIMEI.data.isSuccess) { updateIMEIRes = false };
            }

            else if (this.state.stationAlias == 'WeightScale') {
                var checkImeiWeight = await this.checkImeiWeight(qrCode, resToken.token);
                if (!checkImeiWeight.isSuccess) { checkImeiWeightRes = false };
            }
            else if (this.state.stationAlias == 'OQC') {
                var updateCarton = await this.updateCartonByIMEI(qrCode, resToken.token,false);
                if (!updateCarton) {
                    Toaster.Notify({ type: ToasterTypeConstants.Warning, message: updateCarton.message });
                    return;
                };
            }
            if (!updateIMEIRes) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: updateIMEI.message });
                return;
            }
            if (!checkImeiWeightRes) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: checkImeiWeight.message });
                return;
            }
            let codeFilter = { StationId: stationId, QRCode: qrCode };

            const duplicate = await ProductionDailyService.GetDetailsByBarcode(codeFilter, resToken.token);

            if (duplicate.data != null && duplicate.data.id > 0) {
                productionDailyId = duplicate.data.id;
            }

            const sortOrderPrev = await StationService.GetDetailsById(isExist.data.productStationId, resToken.token);

            if ((sortOrder != 1) && (sortOrderPrev.data.alias == "OQC") && (isExist.data.isFailed) && (this.state.stationAlias != "WeightScale")) {
                Toaster.Notify({ type: ToasterTypeConstants.Error, message: `Failed in ${isExist.data.station.name} Station. Need To Pass Weight Scale Station Again ..!!! ` });
                this.setState({
                    qrCode: "",
                    imei: '',
                    inputQr: '',

                });
                return;
            }
            if (isExist.data.productStationId > 0 && (this.state.stationAlias == "WeightScale") && (sortOrderPrev.data.alias == "OQC") && (isExist.data.isFailed)) {
                if (productionDailyId > 0) await this.updateProductionDaily(qrCode, productionDailyId, IsFailed, lineId)
                else { await this.addProductionDaily(qrCode, IsFailed, isExist.data.id, lineId); }
            }
            else if (isExist.data.productStationId > 0 && (sortOrderPrev.data.sortOrder == sortOrder - 1 || sortOrderPrev.data.sortOrder == sortOrder)) {
                if (productionDailyId > 0) await this.updateProductionDaily(qrCode, productionDailyId, IsFailed, lineId)
                else { await this.addProductionDaily(qrCode, IsFailed, isExist.data.id, lineId); }
            }
            else if (isExist.data.productStationId > 0 && sortOrderPrev.data.sortOrder > sortOrder) {
                this.setState({
                    qrCode: "",
                    imei: '',
                    inputQr: '',

                });
                Toaster.Notify({ type: ToasterTypeConstants.Error, message: `This Product Already Passed by ${isExist.data.station.name} Station` });
                return;
            }
            else if (sortOrder == 1) {
                if (productionDailyId > 0) await this.updateProductionDaily(qrCode, productionDailyId, IsFailed, lineId)
                else { await this.addProductionDaily(qrCode, IsFailed, isExist.data.id, lineId); }

            }
            else {
                // Toaster.Notify({ type: ToasterTypeConstants.Error, message: `${sortOrderPrev.data.name} station not completed` });
                this.setState({
                    qrCode: "",
                    imei: '',
                    inputQr: '',

                });
                Toaster.Notify({ type: ToasterTypeConstants.Error, message: `${sortOrderPrev.data.name} Station just completed !! missed previous station` });
                return;
            }
            // if (this.state.stationAlias == 'OQC') {

            //     var updateCarton = await this.updateCartonByIMEI(qrCode, resToken.token, false);
            //     if (!updateCarton) {
            //         Toaster.Notify({ type: ToasterTypeConstants.Warning, message: updateCarton.message });
            //         return;
            //     };
            // }
            if (this.state.stationAlias == 'IMEIMerge') {
                document.getElementById("SearchbyCode").focus();
            }

            // if (this.state.stationAlias == 'IMEIMerge') {
            //     var updateIMEI = await this.mergeIMEI(qrCode, resToken.token);
            //     if (!updateIMEI.data.isSuccess) { updateIMEIRes = false };
            // }

            // else if (this.state.stationAlias == 'WeightScale') {
            //     var checkImeiWeight = await this.checkImeiWeight(qrCode, resToken.token);
            //     if (!checkImeiWeight.isSuccess) { checkImeiWeightRes = false };
            // }
            // else if (this.state.stationAlias == 'OQC') {
            //     var updateCarton = await this.updateCartonByIMEI(qrCode, resToken.token);
            //     if (!updateCarton.isSuccess) {
            //         Toaster.Notify({ type: ToasterTypeConstants.Warning, message: updateCarton.message });
            //         return;
            //     };
            // }
            // if (!updateIMEIRes) {
            //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: updateIMEI.message });
            //     return;
            // }
            // if (!checkImeiWeightRes) {
            //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: checkImeiWeight.message });
            //     return;
            // }
        }

    }

    checkCode = async (searchType, qrCode, token) => {
        if (searchType == "Code") {
            const isExist = await NewitemService.GetDetailsByCode(qrCode, token);
            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            return isExist;
        }
        else {
            const isExist = await NewitemService.GetDetailsByIMEI(qrCode, token);
            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            return isExist;
        }

    }
    addProductionDaily = async (code, IsFailed, newItemId, lineId) => {
        const qrCode = code;
        //const qrCode = this.state.qrCode;
        const stationId = this.state.stationId;
        var viewItems = this.state.viewItems;
        var passed = this.state.passed;
        var failed = this.state.failed;
        var faultPercent = this.state.faultPercent;
        var total = this.state.total;
        var productionDailyId = this.state.productionDailyId;

        const model = {
            ProductRefNum: qrCode,
            StationId: stationId,
            Stationstatus: true,
            IsActive: true,
            IsFailed: IsFailed,
            NewItemId: newItemId,
            lineId: lineId
        }

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        var savedRes = await ProductionDailyService.Add(model, resToken.token);
        if (!savedRes.response.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Error in Add Production Daily" });

            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            return;
        }

        let codeFilter = { StationId: stationId, QRCode: qrCode };

        const duplicate = await ProductionDailyService.GetDetailsByBarcode(codeFilter, resToken.token);

        if (duplicate.data != null) {
            productionDailyId = duplicate.data.id;
        }

        let filter = { StationId: stationId };

        const res = await ProductionDailyService.GetListByFilter(filter, resToken.token);
        const resPassFailData = await ProductionDailyService.GetPassFailDataByFilter(filter, resToken.token);
        if (resPassFailData.data.length > 0) {
            passed = resPassFailData.data[0].passed;
            failed = resPassFailData.data[0].failed;
            faultPercent = resPassFailData.data[0].faultPercent;
            total = passed + failed;
        }

        viewItems = [];
        _.forEach(res.data, (item) => {

            var viewItem =
            {
                productRefNum: item.productRefNum,
                station: item.station.name,
                imei1: item.newItem.imeI1,
                imei2: item.newItem.imeI2,
                date: item.date,
                stationStatus: item.stationStatus,
                isFailed: item.isFailed,
            }

            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems,
            qrCode: "",
            inputQr: '',
            productionDailyId: productionDailyId,
            passed: passed,
            failed: failed,
            faultPercent: parseInt(faultPercent.toFixed(2)),
            total: total,
            imei: ''

        });
    }
    updateProductionDaily = async (code, productionDailyId, IsFailed, lineId) => {
        const qrCode = code;
        //const qrCode = this.state.qrCode;
        const stationId = this.state.stationId;
        var viewItems = this.state.viewItems;
        var passed = this.state.passed;
        var failed = this.state.failed;
        var faultPercent = this.state.faultPercent;
        var total = this.state.total;


        const model = {
            Id: productionDailyId,
            IsFailed: IsFailed,
            StationId: stationId,
            ProductRefNum: qrCode,
            lineId: lineId
        }

        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }

        var savedRes = await ProductionDailyService.Edit(model, resToken.token);
        if (!savedRes.response.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Error in Add Production Daily" });

            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            return;
        }

        let filter = { StationId: stationId };

        const res = await ProductionDailyService.GetListByFilter(filter, resToken.token);
        const resPassFailData = await ProductionDailyService.GetPassFailDataByFilter(filter, resToken.token);
        if (resPassFailData.data.length > 0) {
            passed = resPassFailData.data[0].passed;
            failed = resPassFailData.data[0].failed;
            faultPercent = resPassFailData.data[0].faultPercent;
            total = passed + failed;
        }

        viewItems = [];
        _.forEach(res.data, (item) => {

            var viewItem =
            {
                productRefNum: item.productRefNum,
                station: item.station.name,
                imei1: item.newItem.imeI1,
                imei2: item.newItem.imeI2,
                date: item.date,
                stationStatus: item.stationStatus,
                isFailed: item.isFailed,
            }

            viewItems.push(viewItem);
        })

        this.setState({
            viewItems: viewItems,
            qrCode: "",
            inputQr: '',
            productionDailyId: productionDailyId,
            passed: passed,
            failed: failed,
            faultPercent: parseInt(faultPercent.toFixed(2)),
            total: total,
            imei: ''

        });

    }
    mergeIMEI = async (code, token, imei) => {

        var isExist = await this.checkCode("Code", code, token);
        if (isExist.data.isIssued == null) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: `${isExist.data.station.name} Not Passed Yet` });
            return;
        }
        //var imei = this.state.imei;
        var qrCode = code;

        let filter = { IMEI1: imei, QRCode: qrCode };

        const res = await NewitemService.CheckIMEI(filter, token);

        if (!res.data.isSuccess) {
            if (this.state.stationAlias == 'IMEIMerge') {
                document.getElementById("SearchbyCode").focus();
            }
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.data.message });
            return;
        }
        return res;
    }
    checkImeiWeight = async (code, token) => {

        const res = await NewitemService.CheckImeiWeight(code, token);
        if (!res.data.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "IMEI Not Found in System" });
            return;
        }
        return res.data;
    }
    IMEIGetByBoxId = async (token) => {
        var imei = this.state.imei;
        var qrCode = this.state.qrCode;

        let filter = { IMEI1: imei, QRCode: qrCode };

        const res = await NewitemService.IMEIGetByBoxId(filter, token);
        console.log(res);

    }
    updateCartonByIMEI = async (code, token, isFailed) => {
        const res = await NewitemService.UpdateCartonByIMEI(code, isFailed, token);
       
        if (!res.data.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Error, message: res.data.message });
            return false;
        }
        return res.data;

    }
    passCartonDone = async (val, token) => {

        var viewItems = this.state.viewItems;
        if (val != '') {
            var response = await NewitemService.IMEIGetByBoxIdAddCarton(val, token);
            if (!response.response.isSuccess) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: response.response.message });
                return;
            }
        }
        var filter = { IsDashBoard: true };
        const res = await CartonDoneService.GetListByFilter(filter, token);

        viewItems = [];
        _.forEach(res.data, (item) => {
            var viewItem =
            {
                productRefNum: item.cartonCode,
                date: item.createdOn,
                isFailed: false,
            }

            viewItems.push(viewItem);
        })
        this.setState({
            viewItems: viewItems,
            passed: res.data.length,
            total: res.data.length,
            qrCode: '',
            inputQr: '',
        })
    }
    receiveFaulty = async (val, token) => {

        var viewItems = this.state.viewItems;

        if (val != '') {
            let filter = { IMEI1: val, IsFaultyReceived: true };
            const res = await ProductionRepairingService.UpdateFaultyReceived(filter, token);

            if (!res.response.isSuccess) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });
                return;
            }

        }
        let filter = { IsFaultyReceived: true };
        const list = await ProductionRepairingService.GetListByFilter(filter, token);
        var viewItems = [];
        _.forEach(list.data, (item) => {
            var viewItem =
            {
                productRefNum: item.productionDaily.productRefNum,
                date: item.createdOn,
                isFailed: false,
            }

            viewItems.push(viewItem);
        })
        this.setState({
            viewItems: viewItems,
            passed: list.data.length,
            total: list.data.length,
            qrCode: '',
            inputQr: '',
        })


    }
    receiveRepair = async (val, token) => {

        if (val != '') {
            let filter = { IMEI1: val, IsRepairedReceived: true };
            const res = await ProductionRepairingService.UpdateRepairedReceived(filter, token);
            console.log(res);
            if (!res.response.isSuccess) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: res.response.message });
                return;
            }

        }
        let filter = { IsRepairedReceived: true };
        const list = await ProductionRepairingService.GetListByFilter(filter, token);

        var viewItems = [];
        _.forEach(list.data, (item) => {
            var viewItem =
            {
                productRefNum: item.productionDaily.productRefNum,
                date: item.createdOn,
                isFailed: false,
            }

            viewItems.push(viewItem);
        })
        this.setState({
            viewItems: viewItems,
            passed: list.data.length,
            total: list.data.length,
            qrCode: '',
            inputQr: '',
        })

    }
    handleCheck = (e) => {
        this.setState({
            failedDivContainer: !this.state.failedDivContainer
        })

    }
    isShowPopup = async (status, code, lineNo) => {

        //const qrCode = this.state.qrCode;
        const qrCode = code;
        var lineNo = lineNo;
        const stationId = this.state.stationId;
        const sortOrder = this.state.sortOrder;
        const searchType = this.state.searchType;

        var IsFailed = true;
        var productionDailyId = 0;


        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


        let resToken = AuthenticationService.GetToken();
        if (!resToken.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Session Expired. Try to login first." });
            return;
        }
        const lineInfo = await LineService.GetLineByLineNo(lineNo, resToken.token);
        var lineId = lineInfo.data.id;

        if (qrCode == "") {
            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: "Warning! Please enter product Reference" });

            return;
        }
        var isExist = await this.checkCode(searchType, qrCode, resToken.token);
        // const isExist = await NewitemService.GetDetailsByCode(qrCode, resToken.token);

        if (!isExist.isSuccess) {
            Toaster.Notify({ type: ToasterTypeConstants.Warning, message: isExist.message });
            return;
        }

        if (isExist.data.productStationId != stationId && isExist.data.isFailed) {
            Toaster.Notify({ type: ToasterTypeConstants.Error, message: `Failed in ${isExist.data.station.name} Station` });
            return;
        }

        // if (isExist.data.production.presentLineId <= 0) {
        //     Toaster.Notify({ type: ToasterTypeConstants.Warning, message: 'Line not configured for this Production !!' });
        //     return;
        // }
        else if (this.state.stationAlias == 'OQC') {

            var updateCarton = await this.updateCartonByIMEI(qrCode, resToken.token, true);
            if (!updateCarton.isSuccess) {
                Toaster.Notify({ type: ToasterTypeConstants.Warning, message: updateCarton.message });
                this.setState({
                    qrCode: "",
                    imei: '',
                    inputQr: '',

                });
                return;
            };
        }

        let codeFilter = { StationId: stationId, qrCode: qrCode };

        const duplicate = await ProductionDailyService.GetDetailsByBarcode(codeFilter, resToken.token);

        if (duplicate.data != null && duplicate.data.id > 0) {
            productionDailyId = duplicate.data.id;
        }

        const sortOrderPrev = await StationService.GetDetailsById(isExist.data.productStationId, resToken.token);

        if (sortOrder == 1) {
            if (productionDailyId > 0) await this.updateProductionDaily(qrCode, productionDailyId, IsFailed, lineId)
            else { await this.addProductionDaily(qrCode, IsFailed, isExist.data.id, lineId); }

        }
        else if (isExist.data.productStationId > 0 && (sortOrderPrev.data.sortOrder == sortOrder - 1 || sortOrderPrev.data.sortOrder == sortOrder)) {
            if (productionDailyId > 0) {
                await this.updateProductionDaily(qrCode, productionDailyId, IsFailed, lineId);
                this.setState({ showModalPopup: status });
            }

            else {
                await this.addProductionDaily(qrCode, IsFailed, isExist.data.id, lineId);
                this.setState({ showModalPopup: status });
            }

        }
        else if (isExist.data.productStationId > 0 && sortOrderPrev.data.sortOrder > sortOrder) {
            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            Toaster.Notify({ type: ToasterTypeConstants.Error, message: `This Product Already Passed by ${sortOrderPrev.data.name} Station` });
            return;
        }

        else {
            // Toaster.Notify({ type: ToasterTypeConstants.Error, message: `${isExist.data.station.name} Station not completed yet` });
            this.setState({
                qrCode: "",
                imei: '',
                inputQr: '',

            });
            Toaster.Notify({ type: ToasterTypeConstants.Error, message: `${sortOrderPrev.data.name} Station just completed !! missed previous station` });
            return;
        }

    };
    isShowPopupFalse = async (status) => {
        this.setState({ showModalPopup: status });
    }
    barcodeAutoFocus = () => {
        if (this.state.stationAlias != "IMEIMerge") {
            document.getElementById("SearchbyCode").focus();
        }
    }
    barGncodeAutoFocus = () => {
        document.getElementById("SearchbyScanning").focus();
    }


    onChangeBarcode = (event) => {
        // updateBarcodeInputValue(event.target.value)
        this.setState({
            inputQr: event.target.value
        })
    }
    onChangeQRcode = (event) => {
        // updateBarcodeInputValue(event.target.value)
        this.setState({
            inputQr: event.target.value
        })

        // var test = document.getElementById("SearchbyIMEI");

    }
    onChangeIMEI = (event) => {
        // updateBarcodeInputValue(event.target.value)
        this.setState({
            imei: event.target.value
        })
    }

    onKeyPressBarcode = (event) => {

        if (event.keyCode === 13) {
            // updateBarcodeInputValue(event.target.value)
            var value = event.target.value;
            // var lastTwo = value.substr(value.length - 2); // => "Tabs1"

            var lineNo = value.substr(value.length - 1); // => "last one"

            var inputVal = value.slice(0, value.length - 1);

            var lastTwo = inputVal.substr(inputVal.length - 2); // => "Tabs1"

            if (lastTwo == "-Y") {
                var code = inputVal.slice(0, inputVal.length - 2);
                this.setState({
                    inputQr: code,
                    productionDailyId: 0,
                    lineNo: lineNo
                })
                // this.handleInputItem(code);
                this.handleInputItem(code, lineNo);
            }
            if (lastTwo == "-N") {
                var code = inputVal.slice(0, inputVal.length - 2);
                this.setState({
                    inputQr: code,
                    productionDailyId: 0,
                    lineNo: lineNo
                })
                // this.handleInputItem(code);
                this.isShowPopup(true, code, lineNo);
            }
        }
    }
    onKeyPressQRcode = (event) => {

        if (event.keyCode === 13) {
            // updateBarcodeInputValue(event.target.value)
            var value = event.target.value;
            // var lastTwo = value.substr(value.length - 2); // => "Tabs1"

            var lineNo = value.substr(value.length - 1); // => "last one"

            var inputVal = value.slice(0, value.length - 1);

            var lastTwo = inputVal.substr(inputVal.length - 2); // => "Tabs1"

            if (lastTwo == "-Y") {
                var code = inputVal.slice(0, inputVal.length - 2);
                this.setState({
                    inputQr: code,
                    productionDailyId: 0,
                    lineNo: lineNo
                })
                document.getElementById("SearchbyIMEI").focus();
                // this.handleInputItem(code);
                //this.handleInputItem(code,lineNo);
            }
            if (lastTwo == "-N") {
                var code = inputVal.slice(0, inputVal.length - 2);
                this.setState({
                    inputQr: code,
                    productionDailyId: 0,
                    lineNo: lineNo
                })
                // this.handleInputItem(code);
                this.isShowPopup(true, this.state.inputQr, lineNo);
            }
        }
    }


    onKeyPressIMEI = (event) => {

        if (event.keyCode === 13) {
            // updateBarcodeInputValue(event.target.value)
            var value = event.target.value;
            // var lastTwo = value.substr(value.length - 2); // => "Tabs1"

            var lineNo = value.substr(value.length - 1); // => "last one"

            var inputVal = value.slice(0, value.length - 1);

            var lastTwo = inputVal.substr(inputVal.length - 2); // => "Tabs1"

            if (lastTwo == "-Y") {
                var code = inputVal.slice(0, inputVal.length - 2);
                this.setState({
                    imei: code,
                    productionDailyId: 0,
                    lineNo: lineNo
                })
                // this.handleInputItem(code);
                this.handleInputItem(this.state.inputQr, lineNo, code);
            }
            if (lastTwo == "-N") {
                var code = inputVal.slice(0, inputVal.length - 2);
                this.setState({
                    inputQr: code,
                    productionDailyId: 0,
                    lineNo: lineNo
                })
                // this.handleInputItem(code);
                this.isShowPopup(true, this.state.inputQr, lineNo);
            }
        }
    }

    render() {
        const { viewItems, inputQr, imei, searchType, qrCode, stationAlias, failedMessages, failedDivContainer, aliasName, actionType, showModalPopup, passed, failed, faultPercent, total, productionDailyId, stationId } = this.state;

        return (
            <Fragment>
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
                                    <div className="col-md-4">

                                        <b><h3 style={{ textAlign: "center", color: "#0d6efd", marginBottom: "15px" }}>{aliasName} DashBoard</h3></b>

                                        <div className="card-style mb-1 card-height">
                                            {stationAlias == "IMEIMerge" &&
                                                <div>
                                                    <div className="row">
                                                        <div className="col-md-9">
                                                            {/* <div className="input-style-1">
                                                                <label> IMEI</label>
                                                                <div className="input-style-1">

                                                                    <input type="text" name="imei" id="imei" value={imei} onChange={this.handleInputChange} autoComplete='off' />
                                                                </div>
                                                            </div> */}
                                                            <div className="input-style-1">
                                                                <input
                                                                    autoFocus={true}
                                                                    placeholder='Code'
                                                                    value={inputQr}
                                                                    onChange={this.onChangeQRcode}
                                                                    id='SearchbyCode'
                                                                    className='SearchInput'
                                                                    onKeyDown={this.onKeyPressQRcode}
                                                                    onBlur={this.barcodeAutoFocus}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-9">
                                                            <div className="input-style-1">
                                                                <input
                                                                    //autoFocus={true}
                                                                    placeholder='IMEI'
                                                                    value={imei}
                                                                    onChange={this.onChangeIMEI}
                                                                    id='SearchbyIMEI'
                                                                    className='SearchInput'
                                                                    onKeyDown={this.onKeyPressIMEI}
                                                                    onBlur={this.barcodeAutoFocus}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {stationAlias !== "IMEIMerge" &&
                                                <div className="row">
                                                    <div className="col-md-9">
                                                        {/* <div className="input-style-1">
                                                            <div className="input-style-1">
                                                                <input type="text" name="qrCode" id="qrCode" value={qrCode} onChange={this.handleInputChange} autoComplete='off' placeholder={searchType} />
                                                            </div>
                                                        </div> */}
                                                        <div className="input-style-1">
                                                            <input
                                                                autoFocus={true}
                                                                placeholder='Start Scanning'
                                                                value={inputQr}
                                                                onChange={this.onChangeBarcode}
                                                                id='SearchbyScanning'
                                                                className='SearchInput'
                                                                onKeyDown={this.onKeyPressBarcode}
                                                                onBlur={this.barGncodeAutoFocus}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* <BarcodeScanner />  */}


                                                    <div className="col-md-3 ">
                                                        <div className=" button-group d-flex justify-content-right flex-wrap">
                                                            <button className="main-btn primary-btn btn-hover w-60 text-left" onClick={this.handleInputItem}> Pass </button>
                                                        </div>
                                                    </div>

                                                    {(actionType == "PassAndFail" || actionType == "OnlyFail") &&
                                                        // <button className="main-btn warning-btn btn-hover w-60 failed-mb text-center" onClick={this.handleCheck}> Failed </button>
                                                        <button className="main-btn warning-btn btn-hover w-60 failed-mb text-center" onClick={() => this.isShowPopup(true)}> Failed </button>

                                                    }
                                                    {/* {failedDivContainer &&
                                                    <div>
                                                        <div className="input-style-1">
                                                            <select className="form-control" name="failedStatus" id="failedStatus" onChange={this.handleInputChange}>
                                                                <option value=""> Select One</option>
                                                                {failedMessages.map((item, index) => {
                                                                    return (
                                                                        <option key={index} value={item.value}>{item.label}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </div>

                                                        <div className=" button-group d-flex justify-content-left flex-wrap">
                                                            <button className="main-btn primary-btn btn-hover w-60 text-center" onClick={this.handleSubmit}> Submit </button>
                                                        </div>
                                                    </div>} */}
                                                    {/* <div className=" button-group d-flex justify-content-right flex-wrap" onClick={() => this.isShowPopup(true)}>
                                                    <button className="main-btn primary-btn btn-hover w-60 text-center" > Modal </button>
                                                </div> */}
                                                    {typeof productionDailyId !== "undefined" && productionDailyId > 0 &&
                                                        <FailedMessagesModalPopup
                                                            showModalPopup={this.state.showModalPopup}
                                                            onPopupClose={this.isShowPopupFalse}
                                                            productionDailyId={productionDailyId}
                                                            stationId={stationId}
                                                        ></FailedMessagesModalPopup>
                                                    }
                                                </div>
                                            }
                                        </div>


                                    </div>
                                    <div className="col-md-8" style={{ borderLeft: "1px" }}>
                                        <div className="card-style mb-1 border-leftcolor">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="icon-card mb-2 stationPadding">
                                                        <div className="icon purple">
                                                            <i className="lni lni-cart-full"></i>
                                                        </div>
                                                        <div className="content">
                                                            <h6 className="mb-3">Total</h6>
                                                            <h3 className="text-bold mb-1">{total}</h3>
                                                            <p className="text-sm text-success">
                                                                {/* <i className="lni lni-arrow-up"></i> +2.00%
                  <span className="text-gray">(30 days)</span> */}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="icon-card mb-2 stationPadding">
                                                        <div className="icon purple">
                                                            <i className="lni lni-cart-full"></i>
                                                        </div>
                                                        <div className="content">
                                                            <h6 className="mb-3">Passed</h6>
                                                            <h3 className="text-bold mb-1">{passed}</h3>
                                                            <p className="text-sm text-success">
                                                                {/* <i className="lni lni-arrow-up"></i> +2.00%
                  <span className="text-gray">(30 days)</span> */}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* //   {(aliasName == "Functional QC" || aliasName == "Aesthetic QC" || aliasName == "OQC") && */}
                                                {(actionType == "PassAndFail" || actionType == "OnlyFail") &&
                                                    <div className="col-md-3">
                                                        <div className="icon-card mb-2 stationPadding">
                                                            <div className="icon purple">
                                                                <i className="lni lni-cart-full"></i>
                                                            </div>
                                                            <div className="content">
                                                                <h6 className="mb-3">Failed</h6>
                                                                <h3 className="text-bold mb-1">{failed}</h3>
                                                                <p className="text-sm text-success">
                                                                    {/* <i className="lni lni-arrow-up"></i> +2.00%
                  <span className="text-gray">(30 days)</span> */}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {/* {(aliasName == "Functional QC" || aliasName == "Aesthetic QC" || aliasName == "OQC") && */}
                                                {(actionType == "PassAndFail" || actionType == "OnlyFail") &&
                                                    <div className="col-md-3">
                                                        <div className="icon-card mb-2 stationPadding">
                                                            {/* <div className="icon purple">
                                                            <i className="lni lni-cart-full"></i>
                                                        </div> */}
                                                            <div className="content">
                                                                <h6 className="mb-3">Failed Percentage</h6>
                                                                <h3 className="text-bold mb-1">{faultPercent} %</h3>
                                                                <p className="text-sm text-success">
                                                                    {/* <i className="lni lni-arrow-up"></i> +2.00%
                  <span className="text-gray">(30 days)</span> */}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                }
                                            </div>
                                            {stationAlias != "IMEIMerge" &&
                                                <div className="table-wrapper table-responsive">
                                                    <table className="table table-striped table-hover">
                                                        <thead className="tbHead" style={{ background: '#cfd8dc', color: 'black', textAlign: 'Center', fontSize: 'small' }}>
                                                            <tr>
                                                                {/* <th>
                                                                Id
                                                            </th> */}
                                                                <th>
                                                                    Code
                                                                </th>
                                                                <th> Status</th>
                                                                <th>Time
                                                                </th>


                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: 'Center' }}>
                                                            {viewItems.map((item, i) => {
                                                                return (
                                                                    <tr key={`item-${i}`}>
                                                                        {/* <td className="p-1" >
                                                                        <input className="form-control" readOnly type="text" defaultValue={i + 1} />
                                                                        {i + 1}
                                                                    </td> */}
                                                                        <td className="p-1" >
                                                                            {/* <input className="form-control" readOnly type="text" defaultValue={item.label} /> */}
                                                                            {item.productRefNum}
                                                                        </td>

                                                                        <td className="p-1">
                                                                            <div>
                                                                                {item.isFailed ? "Failed " : "Passed"}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-1">
                                                                            {/* <input className="form-control" type="text" name="date" id="date" defaultValue={item.date} autoComplete="off" /> */}
                                                                            {item.date}
                                                                        </td>

                                                                    </tr>
                                                                );
                                                            })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            }
                                            {stationAlias == "IMEIMerge" &&
                                                <div className="table-wrapper table-responsive">
                                                    <table className="table table-striped table-hover">
                                                        <thead className="tbHead" style={{ background: '#cfd8dc', color: 'black', textAlign: 'Center', fontSize: 'small' }}>
                                                            <tr>
                                                                {/* <th>
                                                            Id
                                                        </th> */}
                                                                <th>
                                                                    Code
                                                                </th>
                                                                <th>IMEI1</th>
                                                                <th>IMEI2</th>
                                                                <th> Status</th>
                                                                <th>Time
                                                                </th>


                                                            </tr>
                                                        </thead>
                                                        <tbody style={{ textAlign: 'Center' }}>
                                                            {viewItems.map((item, i) => {
                                                                return (
                                                                    <tr key={`item-${i}`}>
                                                                        {/* <td className="p-1" >
                                                                    <input className="form-control" readOnly type="text" defaultValue={i + 1} />
                                                                    {i + 1}
                                                                </td> */}
                                                                        <td className="p-1" >
                                                                            {/* <input className="form-control" readOnly type="text" defaultValue={item.label} /> */}
                                                                            {item.productRefNum}
                                                                        </td>


                                                                        <td className="p-1">
                                                                            <div>
                                                                                {item.imei1 == null ? "" : item.imei1}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-1">
                                                                            <div>
                                                                                {item.imei2 == null ? "" : item.imei2}
                                                                            </div>
                                                                        </td>
                                                                        <td className="p-1">
                                                                            <div>
                                                                                {item.isFailed ? "Failed " : "Passed"}
                                                                            </div>
                                                                        </td>

                                                                        <td className="p-1">
                                                                            {/* <input className="form-control" type="text" name="date" id="date" defaultValue={item.date} autoComplete="off" /> */}
                                                                            {item.date}
                                                                        </td>

                                                                    </tr>
                                                                );
                                                            })
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            }
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
export default withAuth(withRouter((StationDashBoard)));