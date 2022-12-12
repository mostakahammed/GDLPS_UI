import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ModelItemService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/ModelItem/getModelItembyfilter`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
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
    static GetModelListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/ModelItem/getModelItembyModelfilter`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
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
            url: `/ModelItem/details/${id}`,
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
            url: '/modelItem/add',
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(model)          
        };

        let response = await axios(config);

        return response.data;
    }

    static Edit = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/modelItem/edit',
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(model)                 
        };

        let response = await axios(config);
       
        return response.data;
    }

    static Delete = async (id,token) => {
        var config = {
            method: 'DELETE',
            url: `/modelItem/delete/${id}`,
            headers: CommonService.getHeader(token),
            //data:JSON.stringify({id})                
        };

        let response = await axios(config);
       
        return response.data;
    }
}