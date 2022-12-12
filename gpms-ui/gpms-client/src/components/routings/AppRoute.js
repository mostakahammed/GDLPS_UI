import React, { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../dashboards/Dashboard";
import Login from "../authentications/Login";
import Profile from "../profiles/Profile";
import PageNotFound from "../mics/PageNotFound";
import Playground from "../mics/Playground";
import Category from "../pages/categories/Category";
import Item from "../pages/items/Item";
import CategoryAdd from "../pages/categories/CategoryAdd";
import CategoryEdit from "../pages/categories/CategoryEdit";
import Model from "../pages/models/Model";
import ModelAdd from "../pages/models/ModelAdd";
import Line from "../pages/lines/Line";
import LineAdd from "../pages/lines/LineAdd";
import Station from "../pages/stations/Station";
import Scanner from "../pages/scanners/Scanner";
import StationAdd from "../pages/stations/StationAdd";
import ScannerAdd from "../pages/scanners/ScannerAdd";
import LineStation from "../pages/lineStations/LineStation";
import LineStationAdd from "../pages/lineStations/LineStationAdd";
import ModuleAssign from "../security/modules/ModuleAssign";
import StationScanner from "../pages/stationScanners/StationScanner";
import StationScannerAdd from "../pages/stationScanners/StationScannerAdd";
import ProductionDaily from "../pages/productionDailys/ProductionDaily.";
import ProductionDailyAdd from "../pages/productionDailys/ProductionDailyAdd";
import ItemsImport from "../pages/excelUpload/ItemsImport";
import Brand from "../pages/brands/Brand";
import BrandAdd from "../pages/brands/BrandAdd";
import StoreInItem from "../pages/storeInItems/StoreInItem";
import RequisitionAdd from "../pages/requisitions/RequisitionAdd";
import ModelItem from "../pages/modelItems/ModelItem";
import ModelRequisitionAdd from "../pages/requisitions/ModelRequisitionAdd";
import Requisition from "../pages/requisitions/Requisition";
import RequisitionEdit from "../pages/requisitions/RequisitionEdit";
import StationDashBoard from "../pages/stationDashBoard/StationDashBoard";
import FailedMessage from "../pages/failedMessages/FailedMessage";
import FailedMessageAdd from "../pages/failedMessages/FailedMessageAdd";
import User from "../pages/users/User";
import UserAdd from "../pages/users/UserAdd";
import UserEdit from "../pages/users/UserEdit";
import ModelWiseRequisition from "../pages/requisitions/ModelWiseRequisition";
import StartProduction from "../pages/requisitions/StartProduction";
import StationEdit from "../pages/stations/StationEdit";
import LineEdit from "../pages/lines/LineEdit";
import ModelEdit from "../pages/models/ModelEdit";
import BrandEdit from "../pages/brands/BrandEdit";
import ProductionDailyEdit from "../pages/productionDailys/ProductionDailyEdit";
import ModelItemEdit from "../pages/modelItems/ModelItemEdit";
import FailedMessageEdit from "../pages/failedMessages/FailedMessageEdit";
import AssemblyDashBoard from "../pages/stationDashBoard/AssemblyDashBoard";
import RequisitionModelEdit from "../pages/requisitions/RequisitionModelEdit";
import ProductionAdd from "../pages/productions/ProductionAdd";
import Production from "../pages/productions/Production";
import ProductionEdit from "../pages/productions/ProductionEdit";
import RepairingDashBoard from "../pages/stationDashBoard/RepairingDashBoard";
import ProductionLine from "../pages/productionLines/ProductionLine";
import ProductionLineAdd from "../pages/productionLines/ProductionLineAdd";
import ProductionLineEdit from "../pages/productionLines/ProductionLineEdit";
import ProductionLineUpdate from "../pages/productions/ProductionLineUpdate";
import GenerateQRCode from "../pages/requisitions/GenerateQRCode";
import PackagingDashBoard from "../pages/stationDashBoard/PackagingDashBoard";
import Role from "../pages/roles/Role";
import RoleAdd from "../pages/roles/RoleAdd";
import RoleEdit from "../pages/roles/RoleEdit";
import ProductionLineQR from "../pages/productionLines/ProductionLineQR";
import ProductionLineQRCode from "../pages/requisitions/ProductionLineQRCode";
import GenerateQRHistoryQRCode from "../pages/requisitions/GenerateQRHistoryQRCode";
import CartonDone from "../pages/cartonDones/CartonDone";
import LogisticApproved from "../pages/logisticApproved/LogisticApproved";
import CartonIMEI from "../pages/cartonDones/CartonIMEI";
import ColorAdd from "../pages/colors/ColorAdd";
import ColorEdit from "../pages/colors/ColorEdit";
import Color from "../pages/colors/Color";
import ManualModelRequisitionAdd from "../pages/requisitions/ManualModelRequisitionAdd";
import FaultyReceived from "../pages/productionRepairings/FaultyReceived";
import RepairReceived from "../pages/productionRepairings/RepairReceived";
import RequisitonStatus from "../pages/requisitions/RequisitonStatus";
import OQCApprovedCarton from "../pages/cartonDones/OQCApprovedCarton";
import withAuth from "../../shared/hoc/AuthComponent";
import { AuthenticationService } from "../../shared/services/authentications/AuthenticationService";
import FinishGoodsOut from "../pages/finishGoods/FinishGoodsOut";
import PreRequisitionCheck from "../pages/requisitions/PreRequisitionCheck";
import StoreStockReport from "../pages/reports/StoreStockReport";
import ScannerConfigure from "../pages/scannerConfigure/ScannerConfigure";
import PackagingRequisitionAdd from "../pages/requisitions/PackagingRequisitionAdd";
import PackagingRequisition from "../pages/requisitions/PackagingRequisition";
import MobileHistory from "../pages/reports/MobileHistory";
import TransferAdd from "../pages/transfer/TransferAdd";
import TransferEdit from "../pages/transfer/TransferEdit";
import Transfer from "../pages/transfer/Transfer";

class AppRoute extends Component {
  render() {
    return (
      <Routes>
        {/* dashboard  */}
        <Route path="/" element={<Dashboard />
        }></Route>

        {/* Authentications */}
        <Route path="/login" element={<Login />}></Route>

        {/* Profile */}
        <Route path="/profile" element={<Profile />
              
        }></Route>

        {/* playground */}
        <Route path="/playground" element={<Playground />}></Route>

        {/* pages */}
        <Route path="/item" element={<Item />}></Route>
        <Route path="/category" element={<Category />}></Route>
        <Route path="/category/add" element={<CategoryAdd />}></Route>
        <Route path="/category/edit/:Id" element={<CategoryEdit />}></Route>

        <Route path="/model" element={<Model />}></Route>
        <Route path="/model/add" element={<ModelAdd />}></Route>
        <Route path="/model/edit/:Id" element={<ModelEdit/>}></Route>

        <Route path="/line" element={<Line />}></Route>
        <Route path="/line/add" element={<LineAdd />}></Route>
        <Route path="/line/edit/:Id" element={<LineEdit />}></Route>

        <Route path="/station" element={<Station />}></Route>
        <Route path="/station/add" element={<StationAdd />}></Route>
        <Route path="/station/edit/:Id" element={<StationEdit/>}></Route>

        <Route path="/scanner" element={<Scanner />}></Route>
        <Route path="/scanner/add" element={<ScannerAdd />}></Route>
        <Route path="/scanner/edit/:Id" element={<CategoryEdit />}></Route>

        <Route path="/lineStation" element={<LineStation />}></Route>
        <Route path="/lineStation/add" element={<LineStationAdd />}></Route>
        <Route path="/lineStation/edit/:Id" element={<CategoryEdit />}></Route>

        <Route path="/stationScanner" element={<StationScanner />}></Route>
         <Route path="/stationScanner/add" element={<StationScannerAdd />}></Route>
         <Route path="/stationScanner/edit/:Id" element={<CategoryEdit />}></Route>

         <Route path="/productionDaily" element={<ProductionDaily />}></Route>
         <Route path="/productionDaily/add" element={<ProductionDailyAdd />}></Route>
         <Route path="/productionDaily/edit/:Id" element={<ProductionDailyEdit />}></Route>

         <Route path="/item/import" element={<ItemsImport />}></Route>
         <Route path="/brand" element={<Brand />}></Route>
         <Route path="/brand/add" element={<BrandAdd />}></Route>
         <Route path="/brand/edit/:Id" element={<BrandEdit />}></Route>


         <Route path="/storeInItem" element={<StoreInItem />}></Route>
         <Route path="/requisition/add" element={<RequisitionAdd />}></Route>
         <Route path="/requisition" element={<Requisition/>}></Route>

         <Route path="/modelItem" element={<ModelItem />}></Route>
         <Route path="/modelItemEdit/:Id" element={<ModelItemEdit />}></Route>

         <Route path="/modelRequisition" element={<ModelRequisitionAdd />}></Route>
         <Route path="/requisitionModel/edit/:requisitionId" element={<RequisitionModelEdit />}></Route>       
         <Route path="/modelWiseRequisition" element={<ModelWiseRequisition/>}></Route>
         <Route path="/requisition/edit/:requisitionId" element={<RequisitionEdit />}></Route>
         <Route path="/manualModelRequisition" element={<ManualModelRequisitionAdd />}></Route>
         <Route path="/requisitonStatus/:Id/:name" element={< RequisitonStatus/>}></Route>
         <Route path="/packagingRequisitionAdd" element={< PackagingRequisitionAdd/>}></Route>
         <Route path="/packagingRequisition" element={< PackagingRequisition/>}></Route>
         

         <Route path="/stationDashBoard" element={<StationDashBoard />}></Route>
         <Route path="/assemblyDashBoard" element={<AssemblyDashBoard />}></Route>
         <Route path="/repairingDashBoard" element={<RepairingDashBoard />}></Route>
         <Route path="/packagingDashBoard" element={<PackagingDashBoard />}></Route>
         
         <Route path="/stationDashBoard/:alias" element={<StationDashBoard />}></Route>
         <Route path="/failedMessage" element={<FailedMessage/>}></Route>
         <Route path="/failedMessage/add" element={<FailedMessageAdd/>}></Route>
         <Route path="/failedMessage/edit/:Id" element={<FailedMessageEdit/>}></Route>

         <Route path="/user" element={<User/>}></Route>
         <Route path="/user/add" element={<UserAdd/>}></Route>
         <Route path="/user/edit/:userId" element={<UserEdit/>}></Route>

         <Route path="/role" element={<Role/>}></Route>
         <Route path="/role/add" element={<RoleAdd/>}></Route>
         <Route path="/role/edit/:Id" element={<RoleEdit/>}></Route>
                
         <Route path="/production" element={<Production/>}></Route>
         <Route path="/productionLine/update/:Id" element={<ProductionLineUpdate/>}></Route>
         <Route path="/production/add/:Id/:type/:status" element={<ProductionAdd/>}></Route>
         <Route path="/production/edit/:Id" element={<ProductionEdit/>}></Route>

         <Route path="/productionLine" element={<ProductionLine/>}></Route>      
         <Route path="/productionLine/add" element={<ProductionLineAdd/>}></Route>
         <Route path="/productionLine/edit/:Id" element={<ProductionLineEdit/>}></Route>
         <Route path="/productionLineQR/:Id" element={< ProductionLineQR/>}></Route>
         <Route path="/generateQRHistoryQRCode/:Id/:productionlineId" element={< GenerateQRHistoryQRCode/>}></Route>
         <Route path="/productionLineQRCode/:modelId/:colorId/:howManyQR/:productionLineId/:requisitionId" element={< ProductionLineQRCode/>}></Route>
         {/* <Route path="/productionLineQRCode/:modelId/:colorId/:howManyQR/:productionLineId" element={< ProductionLineQRCode/>}></Route> */}
         
         <Route path="/startProduction/:Id" element={<StartProduction/>}></Route>
         <Route path="/generateQRCode/:Id" element={<GenerateQRCode/>}></Route> 
         
         <Route path="/cartonDone" element={<CartonDone/>}></Route>
         <Route path="/cartonDoneIMEI/:Id" element={<CartonIMEI/>}></Route> 
         <Route path="/logisticApproved" element={<LogisticApproved/>}></Route> 
         <Route path="/oqcApprovedCarton" element={<OQCApprovedCarton/>}></Route> 

         <Route path="/color" element={<Color/>}></Route>
         <Route path="/color/add" element={<ColorAdd/>}></Route>
         <Route path="/color/edit/:Id" element={<ColorEdit/>}></Route>     
         
         <Route path="/faultyReceived" element={<FaultyReceived/>}></Route>
         <Route path="/repairReceived" element={<RepairReceived/>}></Route>
         
         <Route path="/finishGoodsOut" element={<FinishGoodsOut/>}></Route>
         <Route path="/preRequisitionCheck" element={<PreRequisitionCheck/>}></Route>

         <Route path="/transfer/add" element={<TransferAdd/>}></Route>
         <Route path="/transfer" element={<Transfer/>}></Route>
         <Route path="/transfer/edit/:Id" element={<TransferEdit/>}></Route>
          
         {/* Reports */}
         <Route path="/stockReport" element={<StoreStockReport/>}></Route>
         <Route path="/scannerConfigure" element={<ScannerConfigure/>}></Route>
         <Route path="/mobileHistory" element={<MobileHistory/>}></Route>
         
        {/* security */}
        <Route path="/module/assign" element={<ModuleAssign />}></Route>   
        
        <Route path="*" element={<PageNotFound />}></Route>
      </Routes>
    );
  }
}

export default React.memo(AppRoute);
