import { VIEW_SUBSCRIPTIONS, BEFORE_SUBSCRIPTION, GET_ERRORS } from '../../redux/types';
import { ENV } from '../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'
import { toast } from 'react-toastify';

export const beforeSubscription = () => {
    return {
        type: BEFORE_SUBSCRIPTION
    }
}

export const viewSubscriptions = (qs = null) => dispatch => {
    toast.dismiss()
    dispatch(emptyError());
    let url = `${ENV.url}subscriptions/subscribed-users`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
        },
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: VIEW_SUBSCRIPTIONS,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};
