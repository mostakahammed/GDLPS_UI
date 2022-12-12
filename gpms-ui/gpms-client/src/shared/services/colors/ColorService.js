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
export class ColorService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/color/getColorbyfilter`,
            headers: CommonService.getHeader(token),  
            data: filter      
        };
        
        let filterdList = await axios(config);
          
        return filterdList.data;
    }
  

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/color/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config)
      
        return single.data;
    }

    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/color/add',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config)
          
        return response.data;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/color/edit',
            headers: CommonService.getHeader(token),  
            data: model          
        };

        let response = await axios(config);
       
        return response.data;
    }

    static Delete = async (id,token) => {
        var config = {
            method: 'DELETE',
            url: `/color/delete/${id}`,
            headers: CommonService.getHeader(token),
            //data:JSON.stringify({id})                
        };

        let response = await axios(config)
        
        return response.data;
    }
    static GetDropdownList = async (token) => {
        var config = {
            method: 'GET',
            url: `/color/getdropdownlist`,
            headers: CommonService.getHeader(token)              
        };
        
        let filteredList = await axios(config);
       
        return filteredList.data;
    }
  
}