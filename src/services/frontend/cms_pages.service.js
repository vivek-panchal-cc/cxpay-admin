import { authHeader, notify,handleResponse } from '../../_helpers/';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;

export const cmsPagesService = {
    getCmsPage
};

 function getCmsPage(slug) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };   
    return fetch(`${API_URL}api/frontend/cms_pages/${slug}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        return Promise.reject();
    }).then(handleResponse);
 }