
import { AuthenticationService } from "../../services/authentications/AuthenticationService";
import { AuthConstants, ToasterTypeConstants } from "../../utilities/GlobalConstrants";
import { Toaster } from "../../utilities/Toaster";


export const Authenticate = (pl) => {
    
    return async (dispatch) => {

        dispatch({
            type: AuthConstants.LOGIN_REQUEST
        })
        
         AuthenticationService.Authenticate(pl.username,pl.password)
        .then((res)=>{
             if(!res.isSuccess){
                Toaster.Notify({ type: ToasterTypeConstants.Error, message: res.message });
             }
            dispatch({
                type: res.isSuccess? AuthConstants.GET_LOGIN_SUCCESS:AuthConstants.ERROR_LOGIN_REQUEST,
                payload: res
            })
        
        }).catch(error=>{
            dispatch({
                type: AuthConstants.ERROR_LOGIN_REQUEST,
                payload: error
            })
        });       
    }
}

export const Logout = (pl) => {
    localStorage.removeItem(AuthConstants.LOGGED_IN_USER_KEY);
    return {
        type: AuthConstants.LOG_OUT,
        payload: pl
    }
}