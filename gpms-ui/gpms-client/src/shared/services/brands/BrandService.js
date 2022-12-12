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
export class BrandService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/brand/getBrandbyfilter`,
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
    static GetDropdownList = async (token) => {
        var config = {
            method: 'GET',
            url: `/brand/getdropdownlist`,
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

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/brand/details/${id}`,
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
            url: '/brand/add',
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
                    message : "Error! There was an error while adding"    
                };
            });

        return response;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/brand/edit',
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
            url: `/brand/delete/${id}`,
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