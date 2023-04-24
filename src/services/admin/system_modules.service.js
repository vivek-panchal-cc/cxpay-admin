import { authHeader } from '../../_helpers';
import { notify,handleResponse,setLoading } from '../../_helpers/';
require('dotenv').config();

export const systemModulesService = {
    getSystemModulesList,
    getSystemModulesListData,
    createSystemModules,
    getSystemModule,
    updateSystemModule,
    deleteSystemModules,
    deleteMultipleSystemModules
};

 function getSystemModulesList() {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('common','view')
    };
   
    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/module/list`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function getSystemModulesListData(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/index`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

function createSystemModules(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/add`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

function getSystemModule(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function updateSystemModule(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/edit/${postData._id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteSystemModules(id) {
    setLoading(true);
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteMultipleSystemModules(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/system_modules/delete_multi_delete_system_modules`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}