import { BEFORE_ADMIN, LOGIN_ADMIN, GET_ADMIN, ADD_ADMIN, GET_ADMINS,GET_USER_VERIFY, BEFORE_USER_VERIFY, UPDATE_ADMIN, DELETE_ADMIN, UPDATE_PASSWORD, FORGOT_PASSWORD, RESET_PASSWORD } from '../../redux/types';

const initialState = {
    admin: null,
    addAdminAuth: false,
    addAdminRes: {},
    loginAdminAuth: false,
    updateAdminAuth: false,
    updateAdminRes: {},
    updatePasswordAuth: false,
    getAuth: false,
    getAdminsRes: {},
    forgotPassword: null,
    forgotPasswordAuth: false,
    resetPasswordAuth: false,
    forgotMsg: null,
    userVerifyRes: {},
    userVerifyAuth: false,
    deleteAdminRes: {},
    deleteAdminAuth: false

}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_ADMIN:
            return {
                ...state,
                addAdminRes: action.payload,
                addAdminAuth: true
            }
        case UPDATE_ADMIN:
            return {
                ...state,
                updateAdminRes: action.payload,
                updateAdminAuth: true
            }
        case UPDATE_PASSWORD:
            return {
                ...state,
                admin: action.payload,
                updatePasswordAuth: true
            }
        case LOGIN_ADMIN:
            return {
                ...state,
                admin: action.payload,
                loginAdminAuth: true
            }
        case GET_ADMIN:
            return {
                ...state,
                admin: action.payload,
                getAuth: true
            }
        case GET_ADMINS:
            return {
                ...state,
                getAdminsRes: action.payload,
                getAuth: true
            }
        case DELETE_ADMIN:
            return {
                ...state,
                deleteAdminRes: action.payload,
                deleteAdminAuth: true
            }
        case BEFORE_ADMIN:
            return {
                ...state,
                admin: null,
                loginAdminAuth: false,
                getAuth: false,
                forgotPasswordAuth: false,
                resetPasswordAuth: false,
                addAdminAuth: false,
                addAdminRes:{},
                updateAdminRes: {}
            }
        case FORGOT_PASSWORD:
            return {
                ...state,
                forgotPasswordAuth: true,
                forgotMsg: action.msg
            }
        case RESET_PASSWORD:
            return {
                ...state,
                resetPasswordAuth: true
            }

        case GET_USER_VERIFY:
            return {
                ...state,
                userVerifyRes: action.admin,
                userVerifyAuth: true
            }
        case BEFORE_USER_VERIFY:
            return {
                ...state,
                userVerifyAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}