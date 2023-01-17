import {GET_REPORTINGS, GET_REPORT, EDIT_REPORT, DELETE_REPORT, BEFORE_REPORT, ADD_REPORT_RESPONSE, GET_REPORT_MESSAGES,GET_ERRORS} from '../../redux/types'
import { toast } from 'react-toastify';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeReports = () => {
    return {
        type: BEFORE_REPORT
    }
}

export const getNftReports = (qs = '',body = {}) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}reports/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2
        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (qs !== '')
            toast.success(data.message)
            dispatch({
                type: GET_REPORTINGS,
                payload: data.data
            })
        } else {
            if (qs !== '')
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const updateNftReport = (body) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}reports/edit`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: EDIT_REPORT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const deleteNftReport = (contentId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}reports/delete/${contentId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_REPORT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};


export const getNftReport = (contentId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}reports/get/${contentId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2

        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: GET_REPORT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

// report responses

export const addReportResponse = (body, isAdmin = false) => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}reports/add-report-response`;
    body.isAdmin = isAdmin
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            dispatch({
                type: ADD_REPORT_RESPONSE,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getReportMessages = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}reports/get-report-messages`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2
        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // if (!qs)
            //     toast.success(data.message)
            dispatch({
                type: GET_REPORT_MESSAGES,
                payload: data
            })
        } else {
            // if (!qs)
            //     toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};
