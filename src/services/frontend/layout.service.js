import { authHeader, notify,handleResponse } from '../../_helpers/';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;

export const layoutService = {
    getMenus,
    getBanners,
    getsitedata
};

 function getMenus() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };   
    return fetch(`${API_URL}api/frontend/menu/get_menu_list`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        return Promise.reject();
    }).then(handleResponse);
 }

 function getBanners() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
   
    return fetch(`${API_URL}api/frontend/banners/get_banners`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        return Promise.reject();
    }).then(handleResponse);
 }


 function getsitedata() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
   
    return fetch(`${API_URL}api/frontend/site/get_site`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        return Promise.reject();
    }).then(handleResponse);
 }