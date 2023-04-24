import { siteConstants } from '../../constants/frontend';

export function sitedata (state = {}, action) {
   
   
    switch (action.type) {
        case siteConstants.SITE_GET_REQUEST:
            return {
                loading: true,
                sitedata:[]
            };
        case siteConstants.SITE_GET_SUCCESS:
            return {
                loading: false,
                sitedata: action.sitedata
            };
        case siteConstants.SITE_GET_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}