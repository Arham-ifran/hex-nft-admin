import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_COLLECTION, GET_COLLECTIONS, UPSERT_COLLECTION, DELETE_COLLECTION, GET_COLLECTION } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeCollection = () => {
    return {
        type: BEFORE_COLLECTION
    }
}

export const getCollections = (qs = '', body={}, toastCheck = true) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}collection/list`;
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
                        toastId: "collection-stats-success"
                      })
                }
            }
            dispatch({
                type: GET_COLLECTIONS,
                payload: data.data
            })
        } else {
            if (qs !== '')
                toast.error(data.message, {
                    toastId: "collection-stats-error"
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
                toast.error(data.message, {
                    toastId: "collection-stats-error"
                  })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getCollection = (collectionId, qs = null) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    const url = `${ENV.url}collection/get/${collectionId}`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: GET_COLLECTION,
                payload: data.data
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

export const updateSettings = (body) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    const url = `${ENV.url}collection/edit`;

    fetch(url, {
        method : 'PUT',
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
                type: UPSERT_COLLECTION,
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

export const deleteCollection = (collectionId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}collection/delete/${collectionId}`;

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
                type: DELETE_COLLECTION,
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