import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ProductionRepairingService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionRepairing/getProductionRepairingbyfilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static UpdateFaultyReceived = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionRepairing/updateFaultyReceived`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static UpdateRepairedReceived = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/productionRepairing/updateRepairedReceived`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
  
    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/productionRepairing/details/${id}`,
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
            url: '/productionRepairing/add',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config);
     
        return response.data;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/productionRepairing/edit',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config);

        return response.data;
    }

    static Delete = async (id,token) => {
        var config = {
            method: 'DELETE',
            url: `/productionRepairing/delete/${id}`,
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