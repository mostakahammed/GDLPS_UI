/*
 * TItle: Module Service
 * Description: manage Module related services
 * Created By : Rejwanul Reja
 * Created By : 09-Feb-2022
 * Modidied: []
 */

import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ModuleService {

    static GetListByFilter = async (filter=SearchFilter,token) => {

        var config = {
            method: 'POST',
            url: `/module/getbyfilter`,
            headers: CommonService.getHeader(token),  
            data: filter     
        };
        
        let filterdList = await axios(config);
            // .then(function (response) {
            //     return response.data;
            // })
            // .catch(function (error) {
            //     return [];
            // });

        return filterdList.data;
    }

    static GetRoleMenus = async (roleId,token) => {

        var config = {
            method: 'get',
            url: `/module/getrolemenus?roleId=${roleId}`,
            headers: CommonService.getHeader(token) 
        };
        
        let filterdList = await axios(config);
            // .then(function (response) {
            //     return response.data;
            // })
            // .catch(function (error) {
            //     return [];
            // });

        return filterdList.data;
    }

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/module/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config);
            
        return single.data;
    }


    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/module/add',
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
            url: '/module/edit',
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

    static delete = async (model,token) => {
        var config = {
            method: 'DELETE',
            url: '/module/delete',
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
                    message : "Error! There was an error while deleting"    
                };
            });

        return response;
    }

    static AssignRolesMenu = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/module/assignrolesmenu',
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
                    message : "Error! There was an error while assigning menu to role"    
                };
            });

        return response;
    }
}