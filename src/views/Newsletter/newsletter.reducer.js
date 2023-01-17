import { VIEW_SUBSCRIPTIONS, BEFORE_SUBSCRIPTION } from '../../redux/types';

const initialState = {

    viewSubscriptions : {},
    viewSubscriptionsAuth : false
}

export default function newsletterRed(state = initialState, action) {
    switch (action.type) {
        case VIEW_SUBSCRIPTIONS:
            return {
                ...state,
                viewSubscriptions: action.payload,
                viewSubscriptionsAuth: true
            }
        case BEFORE_SUBSCRIPTION:
            return {
                ...state,
                viewSubscriptions : {},
                viewSubscriptionsAuth : false
            }
        default:
            return {
                ...state
            }
    }
}