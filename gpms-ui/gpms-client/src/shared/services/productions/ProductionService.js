import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ProductionService {

    static GetListByFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/production/getProductionbyfilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    
    static GetlineDashBoardInformation = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/production/getlineDashBoardInformation`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetlineDashBoardInformationPackaging = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/production/getlineDashBoardInformationPackaging`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetProductionLineStatus = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/production/getProductionLineStatus`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
   
    static GetDetailsById = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/production/details/${id}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }
  
    static GetDetailsByRequisitionId = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/production/GetDetailsByRequisition/${id}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }


    static Add = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/production/add',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while adding"
                };
            });

        return response;
    }

    static Edit = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/production/edit',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while updating"
                };
            });

        return response;
    }

    static Delete = async (id, token) => {
        var config = {
            method: 'DELETE',
            url: `/production/delete/${id}`,
            headers: CommonService.getHeader(token),
            //data:JSON.stringify({id})                
        };

        let response = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {
                    isSuccess: false,
                    message: "Error! There was an error while deleting"
                };
            });

        return response;
    }
  

}