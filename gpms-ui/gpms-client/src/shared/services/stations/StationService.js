
import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class StationService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/station/getstationbyfilter`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
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
    static GetDropdownList = async (token) => {
        var config = {
            method: 'GET',
            url: `/station/getdropdownlist`,
            headers: CommonService.getHeader(token)              
        };
        
        let filteredList = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return null;
            });

        return filteredList;
    }
    static GetDetailsByAlias = async (alias,token) => {
        var config = {
            method: 'GET',
            url: `/station/detailsByAlias/${alias}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config)
        
        return single.data;
    }

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/station/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config)
        
        return single.data;
    }


    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/station/add',
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(model)          
        };

        let response = await axios(config)
            .then(function (response) {                
                return response.data;
            })
            .catch(function (error) {              
                return {
                    isSuccess : false,
                    message : "Error! There was an error while adding"    
                };
            });

        return response;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/station/edit',
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(model)                 
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
            url: `/station/delete/${id}`,
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