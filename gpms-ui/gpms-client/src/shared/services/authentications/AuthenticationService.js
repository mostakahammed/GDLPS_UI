/*
 * TItle: Authentication Service
 * Description: manage authentication related services
 * Created By : Rejwanul Reja
 * Created By : 09-Feb-2022
 * Modidied: []
 */

import axios from "axios";
import { AuthConstants } from "../../utilities/GlobalConstrants";
import { CommonService } from "../common/CommonService";

//services
export class AuthenticationService {

    static Authenticate = async (username,password) => {

        const authObj={
            username,
            password
        };

        var config = {
            method: 'POST',
            url: '/Authorize/token',
            headers: CommonService.getHeader(),
            data: authObj
        };

        let res = await axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return {                   
                    isSuccess : false,
                    message : "Error! There was an error while authenticating user"                    
                };
            });
            
            localStorage.removeItem(AuthConstants.LOGGED_IN_USER_KEY);
            if(res.isSuccess){                
                localStorage.setItem(AuthConstants.LOGGED_IN_USER_KEY, JSON.stringify(res));
            }

            return res;
    }

    static RegisterNewUser = async (model,token) => {
        var config = {
            method: 'POST',
            url: '/user/add',
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
                    message : "Error! There was an error while register the user"    
                };
            });

        return response;
    }

    static GetToken = () => {

        let response = {
            isSuccess: false,            
            token: '',
            expiryInMinutes:''
        };
        
        const currentUser = localStorage.getItem(AuthConstants.LOGGED_IN_USER_KEY);
     
        if (currentUser === 'undefined' || currentUser === null || currentUser === '') {
            return response;
        }

        response = JSON.parse(currentUser);

        if(response.isSuccess){
            const expirationDate=response.expiration;
            const tokenExpirationDate = new Date(expirationDate);

            const minute=parseInt(response.expiryInMinutes);
            const comparedDate=new Date();
            let isSuccess=tokenExpirationDate>=comparedDate;
            if(!isSuccess){
                localStorage.removeItem(AuthConstants.LOGGED_IN_USER_KEY);
            }

            response.isSuccess=isSuccess;            
        }        

        return response;
    }  
    
    static ValidateToken = () => {
        const currentUser = localStorage.getItem(AuthConstants.LOGGED_IN_USER_KEY);
        if (currentUser === 'undefined' || currentUser === null || currentUser === '') {
            return false;
        }

        let response = JSON.parse(currentUser);

        if(response.isSuccess){
            const expirationDate=response.expiration;
            const tokenExpirationDate = new Date(expirationDate);

            const minute=parseInt(response.expiryInMinutes);
            const comparedDate=new Date();
            let isSuccess=tokenExpirationDate>=comparedDate;
            if(!isSuccess){
                localStorage.removeItem(AuthConstants.LOGGED_IN_USER_KEY);
            }

            response.isSuccess=isSuccess;            
        }        

        return response.isSuccess;
    }  

    static SetMunuteWithDate=(minutes)=>{
        const firstDate = new Date();
        let newDate = new Date();
        newDate.setTime(firstDate.getTime() + (minutes * 60 * 1000));

        return newDate;
    }
}