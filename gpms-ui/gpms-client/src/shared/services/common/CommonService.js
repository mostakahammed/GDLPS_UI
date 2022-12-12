/*
 * TItle: Common Service
 * Description: manage common related services
 * Created By : Rejwanul Reja
 * Created By : 09-Feb-2022
 * Modidied: []
 */

import axios from "axios";
import { SearchFilter } from "../../filters/SearchFilter";
import { AuthConstants } from "../../utilities/GlobalConstrants";

//services
export class CommonService {
    static getHeader = (token='') => {
        let headers = { 'Content-Type': 'application/json' };
        if (token !== '' && token !== 'undefined' && token !== null)
            headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

        return headers;
    }
}