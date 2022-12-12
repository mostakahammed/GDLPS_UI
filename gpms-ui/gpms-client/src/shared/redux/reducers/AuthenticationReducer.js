import { AuthConstants } from "../../utilities/GlobalConstrants";

const initialState = {
    loading: true,
    isSuccess: false,
    message:'',
    token: '',
    expiration:'',
    expiryInMinutes:'',    
    responseCode:''
}


const authAction = {
    type: "",
    payload: {        
        token :'',
        expiration :'',
        expiryInMinutes:'',
        isSuccess:false,
        message :'',
        responseCode : "404"
    }
}

const AuthenticationReducer = (state = initialState, action = authAction) => {

    switch (action.type) {
        case AuthConstants.LOGIN_REQUEST:
            return {
                ...state,
                loading: true
            }
        case AuthConstants.GET_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                isSuccess: true,
                message:action.payload.message,
                token: action.payload.token,
                expiration: action.payload.expiration,
                expiryInMinutes:action.payload.expiryInMinutes,
                responseCode: action.payload.responseCode,
            }
        case AuthConstants.ERROR_LOGIN_REQUEST:
            return {
                ...state,
                loading: false,
                isSuccess: false,               
                token: ''
            }
        case AuthConstants.LOG_OUT:
            return {
                ...state,
                loading: false,
                isSuccess: false,                
                token: ''
            }
        default:
            return state
    }
}

export default AuthenticationReducer