import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ProductionDailyService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionDaily/getproductionDailybyfilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static GetProductionDailybyProductRef = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionDaily/getproductionDailybyProductRef`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static GetPassFailDataByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionDaily/getPassFailDataByFilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static TotalCountPerDay = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionDaily/totalCountPerDay`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    // static GetSortOrderByStation = async (stationId, token) => {
    //     var config = {
    //         method: 'GET',
    //         url: `/productionDaily/getSortOrderByStation/${stationId}`,
    //         headers: CommonService.getHeader(token)
    //     };

    //     let single = await axios(config);

    //     return single.data;
    // }
    static GetDetailsByBarcode = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionDaily/getDetailsByBarCode`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/productionDaily/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return null;
            });

        return single;
    }


    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/productionDaily/add',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config);
     
        return response.data;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/productionDaily/edit',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config)
            .then(function (response) {                
                return response.data;
            })
            .catch(function (error) {              
                return {
                    isSuccess : false,
                    message : "Error! There was an error while updating"    
                };
            });

        return response;
    }

    static Delete = async (id,token) => {
        var config = {
            method: 'DELETE',
            url: `/productionDaily/delete/${id}`,
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