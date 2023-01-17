import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_NFT, GET_NFTS, GET_NFT, DELETE_NFT, UPDATE_NFT_SETTINGS } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';

export const beforeNfts = () => {
    return {
        type: BEFORE_NFT
    }
}

export const getNfts = (qs = null) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}nfts/list`;

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
            toast.success(data.message, {
                toastId: "nfts-stats-success"
            })
            dispatch({
                type: GET_NFTS,
                payload: data.data
            })
        } else {
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
                    toastId: "nfts-stats-error"
                })
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getNft = (nftId = '', qs = null) => dispatch => {
    toast.dismiss();
    dispatch(emptyError());
    let url = `${ENV.url}nfts/get/${nftId}`;

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
                type: GET_NFT,
                payload: data.data
            })
        } else {
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
    const url = `${ENV.url}nfts/edit`;

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
                type: UPDATE_NFT_SETTINGS,
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
