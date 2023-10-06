import { authHeader } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;

export const MenuitemServices = {
   
    createitem,
    getMenuitems,
    deletemenuitem,
    getsinglemenucategory,
    updatemenu_category,
    changemenuitemStatus,
    deleteMultiplemenuitem,
    changeBulkMenuitemStatus,
    CmsListing

};
 
// Add menu item 
function createitem(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'menumanage'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/menu_items/add`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/************* Get List Of Menu items **************************/
function getMenuitems(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'menumanage'),
        body: JSON.stringify(postData),
    };
    return fetch(`${API_URL}api/menu_items/index`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/*********** Menu Item Delete  ********************************/

function deletemenuitem(id) {
    setLoading(true);
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader('menu_management', 'menumanage')
    };
    return fetch(`${API_URL}api/menu_items/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/************** Get Menu Items Service  ***********************/
//get page 
function getsinglemenucategory(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('menu_management', 'menumanage')
    };
   
    return fetch(`${API_URL}api/menu_items/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

/************Menu category update  **********************/

// Update Page 

function updatemenu_category(postData) {
    

    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'menumanage'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/menu_items/edit`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


function changemenuitemStatus(id,postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader('menu_management', 'edit'),
        body: JSON.stringify(postData)
    };
    return fetch(`${API_URL}api/menu_items/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteMultiplemenuitem(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management','delete'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/delete_multiplemenuitem`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);

    
}

function changeBulkMenuitemStatus(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/menu_items/change_bulk_menu_items_status`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function CmsListing(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('menu_management', 'view'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/cms_pages/listing`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}