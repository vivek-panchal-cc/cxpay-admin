import { menuConstants, bannersConstants,siteConstants } from '../../constants/frontend';
import { layoutService } from '../../services/frontend';
import { history } from '../../_helpers';

export const layoutActions = {
    getMenus,
    getBanners,
    getsitedata
};

/**
 * Get All Menus.
 */
function getMenus() {
    return dispatch => {
        dispatch(request());
        layoutService.getMenus()
            .then(
                menus => {
                    if (menus.status) {
                        let menu_Array = {};
                        let menusData = menus.menus;
                        for (var key in menusData) {
                            menu_Array[menusData[key].menu_category_name.replace(' ', '_').toLowerCase()] = menusData[key].menu_items
                        }
                        dispatch(success(menu_Array));
                    } else {
                        dispatch(failure(menus.message));
                        history.push('/');
                    }
                },
                error => {
                    dispatch(failure('Something went wrong!'));
                }
            );
    };

    function request() { return { type: menuConstants.MENU_GET_REQUEST } }
    function success(menus) { return { type: menuConstants.MENU_GET_SUCCESS, menus } }
    function failure(error) { return { type: menuConstants.MENU_GET_FAILURE, error } }
}

/**
 * Get All Banners.
 */
function getBanners() {
    return dispatch => {
        dispatch(request());
        layoutService.getBanners()
            .then(
                banners => {
                    if (banners.status) {
                        dispatch(success(banners.data));
                    } else {
                        dispatch(failure(banners.message));
                        history.push('/');
                    }
                },
                error => {
                    dispatch(failure('Something went wrong!'));
                }
            );
    };

    function request() { return { type: bannersConstants.BANNERS_GET_REQUEST } }
    function success(banners) { return { type: bannersConstants.BANNERS_GET_SUCCESS, banners } }
    function failure(error) { return { type: bannersConstants.BANNERS_GET_FAILURE, error } }
}

/**
 * Get Site Data.
 */
function getsitedata() {
    return dispatch => {
        dispatch(request());
        layoutService.getsitedata()
            .then(
                sitedata => {
                    if (sitedata.status) {
                        dispatch(success(sitedata.data));
                    } else {
                        dispatch(failure(sitedata.message));
                        history.push('/');
                    }
                },
                error => {
                    dispatch(failure('Something went wrong!'));
                }
            );
    };

    function request() { return { type: siteConstants.SITE_GET_REQUEST } }
    function success(sitedata) { return { type: siteConstants.SITE_GET_SUCCESS, sitedata } }
    function failure(error) { return { type: siteConstants.SITE_GET_FAILURE, error } }
}