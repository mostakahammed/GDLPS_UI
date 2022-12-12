import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ModelService {
    
    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/model/getmodelbyfilter`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static GetDropdownlistByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/model/getDropdownlistByFilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetListForDropdownModelWithColor = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/model/getListForDropdownModelWithColor`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);

        return filterdList.data;
    }
    static CopyModel = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/model/copyModel`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
    static GetDropdownList = async (token) => {
        var config = {
            method: 'GET',
            url: `/model/getdropdownlist`,
            headers: CommonService.getHeader(token)              
        };
        
        let filteredList = await axios(config);

        return filteredList.data;
    }
    static GetListForDropdownModelColor = async (token) => {
        var config = {
            method: 'GET',
            url: `/model/getListForDropdownModelColor`,
            headers: CommonService.getHeader(token)              
        };
        
        let filteredList = await axios(config);

        return filteredList.data;
    }
    
    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/model/details/${id}`,
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
            url: '/model/add',
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
            url: '/model/edit',
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
            url: `/model/delete/${id}`,
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