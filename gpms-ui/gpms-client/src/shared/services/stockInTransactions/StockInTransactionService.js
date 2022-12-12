import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class StockInTransactioinService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stockInTransaction/getstockInTransactionbyfilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return [];
            });

        return filterdList;
    }
    static GetStockSumByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stockInTransaction/getStockSumByFilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return [];
            });

        return filterdList;
    }
    static GetSumListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stockInTransaction/getstockInTransactionSumbyfilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
        
        return filterdList.data;
    }
    static ConsumeFinishGoods = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stockInTransaction/consumeFinishGoods`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
        
        return filterdList.data;
    }
    
    static GetListByFilterAndStore = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stockInTransaction/getdropdownlistbystore`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetDropdownlistforRepair = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stockInTransaction/getDropdownlistforRepair`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);

        return filterdList.data;
    }

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/stockInTransaction/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config);

        return single.data;
    }
    static GetRepairStoreSumByItemId = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/stockInTransaction/getRepairStoreSumByItemId/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config);

        return single.data;
    }


    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/stockInTransaction/add',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config);;

        return response.data;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/stockInTransaction/edit',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config);

        return response.data;
    }

    static Delete = async (id,token) => {
        var config = {
            method: 'DELETE',
            url: `/stockInTransaction/delete/${id}`,
            headers: CommonService.getHeader(token),
            //data:JSON.stringify({id})                
        };

        let response = await axios(config)
            .then(function (response) {                
                return response.data;
            })
            .catch(function (error) {              
                return {
                    isSuccess : false,
                    message : "Error! There was an error while deleting"    
                };
            });

        return response;
    }

}