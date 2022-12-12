/*
 * TItle: Authentication Service
 * Description: manage authentication related services
 * Created By : Rejwanul Reja
 * Created By : 09-Feb-2022
 * Modidied: []
 */

import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class CategoryService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/failedMessageCategory/getFailedMessageCategorybyfilter`,
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

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/failedMessageCategory/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config);
        
        return single.data;
    }


    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/failedMessageCategory/add',
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
            url: '/failedMessageCategory/edit',
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
            url: `/failedMessageCategory/delete/${id}`,
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