import { AuthenticationService } from "../services/authentications/AuthenticationService";

//Dev
 export const API_BASE_URL = 'http://localhost:31031/api';
 //PROD 
//export const API_BASE_URL = 'http://103.26.136.204:8001/api';

export const AuthConstants = {
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    GET_LOGIN_SUCCESS: 'GET_LOGIN_SUCCESS',
    ERROR_LOGIN_REQUEST: 'ERROR_LOGIN_REQUEST',

    LOGGED_IN_USER_KEY: "AUTH::LOGGED_IN_USER",
    REGISTERED_USER_KEY: "AUTH::REGISTERED_USER",

    //for redux action
    SUCCESSFULL_LOGIN: "AUTH::SUCCESSFULL_LOGIN",
    FAILED_LOGIN: "AUTH::FAILED_LOGIN",
    CANCELLED_LOGIN: "AUTH::CANCELLED_LOGIN",

    LOG_OUT: "AUTH::LOG_OUT",
}

export const ToasterTypeConstants = {
    Success: 'success',
    Warning: 'warning',
    Error: 'error'
}
export const LineTypeConstants = {
    Assemble: 'Assembly',
    Packaging: 'Packaging'
}
export const TypeConstants = [
    {
        value: 'Assembly',
        label: 'Assembly'
    },
    {
        value: 'Packaging',
        label: 'Packaging'
    },
    {
        value: 'Aging',
        label: 'aging'
    },
    {
        value: 'Logistic',
        label: 'logistic'
    }
]


export const ScannerTypeConstants = {

    Yes: 'Yes',
    No: 'No',
}

export const MenuTypeConstants = {
    IsSelected: 'IsSelected',
    CanView: 'CanView',
    CanAdd: 'CanAdd',
    CanEdit: 'CanEdit',
    CanDelete: 'CanDelete',
}
export const Status = [
    {
        value: 'pending',
        label: 'Pending'
    },
    {
        value: 'assemblyOnProcess',
        label: 'Assembly On Process'
    },
    {
        value: 'assemblyEnd',
        label: 'Assembly End'
    },
    {
        value: 'packagingOnProcess',
        label: 'Packaging On Process'
    },
    {
        value: 'packagingEnd',
        label: 'Packaging End'
    }
];

const resToken = AuthenticationService.GetToken();

 export const UserInfo = {
    
     username: resToken.userName,
 }



