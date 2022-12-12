
import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class FailedMessageService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/FailedMessage/getFailedMessagebyfilter`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }

    static GetDropdownList = async (token) => {
        var config = {
            method: 'GET',
            url: `/FailedMessage/getdropdownlist`,
            headers: CommonService.getHeader(token)              
        };
        
        let filteredList = await axios(config)
          
        return filteredList.data;
    }

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/FailedMessage/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config)
          
        return single.data;
    }


    static Add = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/FailedMessage/add',
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(model)          
        };

        let response = await axios(config)
          
        return response.data;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/FailedMessage/edit',
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(model)                 
        };

        let response = await axios(config)
        
        return response.data;
    }

    static Delete = async (id,token) => {
        var config = {
            method: 'DELETE',
            url: `/FailedMessage/delete/${id}`,
            headers: CommonService.getHeader(token),
            //data:JSON.stringify({id})                
        };

        let response = await axios(config)
     
        return response.data;
    }
}