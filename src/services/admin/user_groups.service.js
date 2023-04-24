import { authHeader } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';
require('dotenv').config();

export const userGroupsService = {
    getUserGroupsList,
    createUsersGroups,
    getUserGroup,
    updateUserGroup,
    deleteUserGroup,
    deleteMultipleUserGroups,
    changeUserGroupStatus,
    changeBulkUserGroupsStatus
};


function getUserGroupsList(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('user_groups','view'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/index`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

function createUsersGroups(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('user_groups','create'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/add`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

function getUserGroup(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('user_groups','view')
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function updateUserGroup(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader('user_groups','update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/edit/${postData.id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteUserGroup(id) {
    setLoading(true);
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader('user_groups','delete')
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteMultipleUserGroups(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('user_groups','delete'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/delete_multiple_user_groups`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changeUserGroupStatus(user_group_id,postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader('user_groups','update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/${user_group_id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changeBulkUserGroupsStatus(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('users', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/change_bulk_user_groups_status`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}