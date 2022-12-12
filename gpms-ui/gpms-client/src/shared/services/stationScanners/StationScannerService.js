import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class StationScannerService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/stationScanner/getstationScannerbyfilter`,
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

    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/stationScanner/details/${id}`,
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
            url: '/stationScanner/add',
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
            url: '/stationScanner/edit',
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
            url: `/stationScanner/delete/${id}`,
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