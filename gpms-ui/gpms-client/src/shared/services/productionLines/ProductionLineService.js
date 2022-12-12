import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class ProductionLineService {

    static GetListByFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/productionLine/getProductionLinebyfilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
    static GetByModelColorFilter = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/productionLine/getByModelColorFilter`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }

    static GetDetailsById = async (id, token) => {
        var config = {
            method: 'GET',
            url: `/productionLine/details/${id}`,
            headers: CommonService.getHeader(token)
        };

        let single = await axios(config);

        return single.data;
    }
    static getDetailsByProductionId = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/productionLine/getDetailsByProductionId`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }

    static Add = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/productionLine/add',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config);
            // .then(function (response) {
            //     return response.data;
            // })
            // .catch(function (error) {
            //     return {
            //         isSuccess: false,
            //         message: "Error! There was an error while adding"
            //     };
            // });

        return response.data;
    }
    static AddLine = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/productionLine/addLine',
            headers: CommonService.getHeader(token),
            data: model
        };

        let response = await axios(config);
            // .then(function (response) {
            //     return response.data;
            // })
            // .catch(function (error) {
            //     return {
            //         isSuccess: false,
            //         message: "Error! There was an error while adding"
            //     };
            // });

        return response.data;
    }
    static Edit = async (model, token) => {
        var config = {
            method: 'POST',
            url: '/productionLine/edit',
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
            url: `/productionLine/delete/${id}`,
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
    static getQRHistoryByProductionLineId = async (filter = SearchFilter, token) => {
        var config = {
            method: 'POST',
            url: `/productionLine/getQRHistoryByProductionLineId`,
            headers: CommonService.getHeader(token),
            data: filter
        };

        let filterdList = await axios(config);

        return filterdList.data;
    }
  

}