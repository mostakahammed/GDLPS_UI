import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class CartonDoneService {

    static GetListByFilter = async (filter=SearchFilter,token) => {
        var config = {
            method: 'POST',
            url: `/cartonDone/getcartonDonebyfilter`,
            headers: CommonService.getHeader(token),  
            data: JSON.stringify(filter)      
        };
        
        let filterdList = await axios(config);
         
        return filterdList.data;
    }
   
    static GetDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/cartonDone/details/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let single = await axios(config);
       
        return single.data;
    }
    static GetCartonIMEIDetailsById = async (id,token) => {
        var config = {
            method: 'GET',
            url: `/cartonDone/getCartonIMEIDetails/${id}`,
            headers: CommonService.getHeader(token)              
        };
        
        let list = await axios(config);
       
        return list.data;
    }

}