import { userConstants } from '../../constants/admin';
import { userService } from '../../services/admin';
import { alertActions } from './';
import { history,notify } from '../../_helpers';

export const userActions = {
    login,
    logout,
    getUsersList
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => {
                    if (user.status) {
                        localStorage.setItem('user', JSON.stringify(user.user));
                        dispatch(success(user.user));
                        history.push('/admin');
                    } else {
                        dispatch(alertActions.error(user.message));
                    }
                },
                error => {
                    dispatch(failure(error));
                    dispatch(alertActions.error('Someting Went Wrong'));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

export function getUsersList(filterVal) {
    return dispatch => {
        dispatch(request());
        userService.getUsersList(filterVal)
            .then(
                users => {
                    if (users.status) { 
                        dispatch(success(users))
                    } else {
                        notify.error(users.message);
                        dispatch(alertActions.error(users.message));
                    }
                },
                error => {
                    //notify.error(error+'teste');
                    dispatch(failure(error))
                }
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}