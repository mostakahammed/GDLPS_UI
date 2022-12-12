import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class NewitemService {

    static GetListByFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/getNewItembyfilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetListByFilterByProductionId = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/getByFilterByProductionIdfilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetListByFilterByQRHistoryId = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/getByFilterByQRHistoryIdfilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
   
    static GetDetailsById = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/newitem/details/${id}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }
    static IMEIGetByBoxIdAddCarton = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/newitem/imeiGetByBoxId/${id}`,
            headers: CommonService.getHeader(token)
        };

        let res = await axios(config);
  
        return res.data;
    }
    static ConsumeBoxItemDetails = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/newitem/consumeBoxItemDetails/${id}`,
            headers: CommonService.getHeader(token)
        };

        let IMEIList = await axios(config);
  
        return IMEIList.data;
    }
    static CheckIMEI = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/checkIMEIUpdateImei`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static CheckImeiWeight = async (imei, token) => {
   
        var config = {
            method: 'GET',
            url: `/newitem/checkImeiWeight/${imei}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }
    static UpdateCartonByIMEI = async (imei, isFailed,token,) => { 
       var filter ={ IMEI1:imei,IsFailed:isFailed }
       console.log(filter);
        var config = {
            method: 'POST',
            url: `/newitem/updateCartonByIMEI`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let single = await axios(config);

        return single.data;
    }
    static GetDetailsByCode = async (code, token) => {
        var config = {
            method: 'GET',
            url: `/newitem/getDetailsByCode/${code}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }
    static GetDetailsByIMEI = async (code, token) => {
        var config = {
            method: 'GET',
            url: `/newitem/getDetailsByIMEI/${code}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }
    static GetByModelColorFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/getByModelColorFilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static RequisitionStatusByRequisitionId = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/requisitionStatusByRequisitionId`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static RequisitionStatusQRSumByRequisitionId = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/newitem/requisitionStatusQRSumByRequisitionId`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }


    static Add = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/newitem/add',
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
            url: '/newitem/edit',
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
            url: `/newitem/delete/${id}`,
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
  

}