import { authHeader, notify,handleResponse } from '../../_helpers/';
require('dotenv').config();

export const cmsPagesService = {
    getCmsPage
};

 function getCmsPage(slug) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };   
    return fetch(`${process.env.REACT_APP_API_URL}api/frontend/cms_pages/${slug}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        return Promise.reject();
    }).then(handleResponse);
 }