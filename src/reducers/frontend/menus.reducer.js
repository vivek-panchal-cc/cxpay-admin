import { menuConstants } from '../../constants/frontend';

export function menus(state = {}, action) {
    switch (action.type) {
        case menuConstants.MENU_GET_REQUEST:
            return {
                loading: true,
                menus:[]
            };
        case menuConstants.MENU_GET_SUCCESS:
            return {
                loading: false,
                menus: action.menus
            };
        case menuConstants.MENU_GET_FAILURE:
            return {
                error: action.error
            };
        default:
            return state
    }
}