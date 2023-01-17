import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_USER, GET_USERS, DELETE_USER } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeUser = () => {
    return {
        type: BEFORE_USER
    }
}

export const getUsers = (qs = '', body = {}, toastCheck = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}user/list`;

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
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (qs !== '') {
                if (toastCheck) {
                    toast.success(data.message, {
                        toastId: "users-stats-success"
                      })
                }
            }

            dispatch({
                type: GET_USERS,
                payload: data.data
            })
        } else {
            if (qs !== '')
                toast.error(data.message, {
                    toastId: "users-stats-error"
                  })
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message,{
                    toastId: "users-stats-error"
                  })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const deleteUser = (Id) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}user/delete/${Id}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_USER,
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