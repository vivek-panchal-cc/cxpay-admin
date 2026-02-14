import { authHeader } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;

export const menuManagementservice = {

    createmenu,
    getMenucategory,
    deletemenucategory,
    get_category_signle,
    update_category_menu,
    deleteMultiplemenucategory,
    changemenucategoryStatus,
    changeBulkMenucategoryStatus


};

/******************* Add menu category  **************************/

function createmenu(postData) {

    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'create'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/menu_managenent/add`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/****************** Get Listing Menu Category  **********************/

function getMenucategory(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'view'),
        body: JSON.stringify(postData),
    };
    return fetch(`${API_URL}api/menu_managenent/index`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/*********** Menu Item Delete  ********************************/

function deletemenucategory(id) {
    setLoading(true);
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader('menu_management', 'delete'),
    };
    return fetch(`${API_URL}api/menu_managenent/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/**************************** Edit MEnu management  **************************/
function update_category_menu(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/menu_managenent/edit`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/*********************** Get Menu category Rec ************************/
function get_category_signle(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('menu_management', 'view')
    };
   
    return fetch(`${API_URL}api/menu_managenent/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


function changemenucategoryStatus(id,postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader('menu_managenent', 'edit'),
        body: JSON.stringify(postData)
    };
    return fetch(`${API_URL}api/menu_managenent/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteMultiplemenucategory(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_managenent','delete'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/delete_multiple_menucategory`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changeBulkMenucategoryStatus(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('banner_management', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/menu_managenent/change_bulk_menucategory_status`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}