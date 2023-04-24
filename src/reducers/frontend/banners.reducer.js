import { bannersConstants } from '../../constants/frontend';

export function banners(state = {}, action) {
    switch (action.type) {
        case bannersConstants.BANNERS_GET_REQUEST:
            return {
                loading: true,
                banners:[]
            };
        case bannersConstants.BANNERS_GET_SUCCESS:
            return {
                loading: false,
                banners: action.banners
            };
        case bannersConstants.BANNERS_GET_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}