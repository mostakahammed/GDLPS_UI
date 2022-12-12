import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class RequisitionService {

    static GetListByFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/requisition/getRequisitionbyfilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetByFilterModelWise = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/requisition/GetByFilterModelWise`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetByFilterPackagingRequisition = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/requisition/getByFilterPackagingRequisition`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetByFilterTransferRequisition = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/requisition/getByFilterTransferRequisition`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    
    static EndProduction = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/requisition/endProduction`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);
       console.log(filterdList);
        return filterdList.data;
    }
    static GetDetailsByRequisitionId = async (requisitionId, token) => {
        var config = {
            method: 'GET',
            url: `/requisitionDetail/GetRequisitionDetailByRequisitioinId/${requisitionId}`,
            headers: CommonService.getHeader(token)
        };

        let detailsList = await axios(config);

        return detailsList.data;
    }
    static GetDetailsByRequisitionIdWithCurrentQty = async (requisitionId, token) => {
        var config = {
            method: 'GET',
            url: `/requisitionDetail/GetRequisitionDetailByRequisitioinIdWithCurrentQty/${requisitionId}`,
            headers: CommonService.getHeader(token)
        };

        let detailsList = await axios(config);

        return detailsList.data;
    }
    static ModelItem_GetModelItemWithCurrenQtyByModelId = async (modelId, token) => {
        var config = {
            method: 'GET',
            url: `/requisitionDetail/ModelItem_GetModelItemWithCurrenQtyByModelId/${modelId}`,
            headers: CommonService.getHeader(token)
        };

        let detailsList = await axios(config);

        return detailsList.data;
    }


    static GetDetailsById = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/requisition/details/${id}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }


    static Add = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/requisition/add',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while adding"
                };
            });

        return response;
    }

    static Edit = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/requisition/edit',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while updating"
                };
            });

        return response;
    }

    static Delete = async (id, token) => {
        var config = {
            method: 'DELETE',
            url: `/requisition/delete/${id}`,
            headers: CommonService.getHeader(token),
            //data:JSON.stringify({id})                
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while deleting"
                };
            });

        return response;
    }
    static StartProduction = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/requisition/startProduction',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while adding"
                };
            });

        return response;
    }
    static GetDropdownList = async (token) => {
        var config = {
            method: 'GET',
            url: `/requisition/getdropdownlist`,
            headers: CommonService.getHeader(token)              
        };
        
        let filteredList = await axios(config);
          
        return filteredList.data;
    }
    static GetRequistionByFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/requisition/getRequistionByFilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
   

}