
import { CMSConstants } from '../../constants/admin';
import { pageService } from '../../services/admin';
import { alertActions } from '../admin';
import { notify } from '../../_helpers';

export function getPageList(filterVal) {
    return dispatch => {
        dispatch(request());
        pageService.getPageList(filterVal)
            .then(
                cms_page => {
                    
                    if (cms_page) { 
                        dispatch(success(cms_page))
                    } else {
                        notify.error(cms_page.message);
                        dispatch(alertActions.error(cms_page.message));
                    }
                },
                error => {
                    notify.error(error);
                    dispatch(failure(error))
                }
            );
    };

    function request() { return { type: CMSConstants.GETALL_REQUEST } }
    function success(cms_page) { return { type: CMSConstants.GETALL_SUCCESS, cms_page } }
    function failure(error) { return { type: CMSConstants.GETALL_FAILURE, error } }
}
