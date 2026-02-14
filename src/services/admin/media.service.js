import { notify, handleResponse, setLoading, authHeader,authHeaderMutlipart } from '../../_helpers';
// import {  } from '../../_helpers/';

require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;

export const mediaService = {
    createMedia,
    getMedia,
    deleteMedia
};

/******************* Add  Media **************************/

function createMedia(postData) {
   
   setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers:authHeaderMutlipart(),
         body: postData
    };

    return fetch(`${API_URL}api/media/upload`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/****************** Get Listing Media   **********************/

function getMedia(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
        body: JSON.stringify(postData),
    };
    return fetch(`${API_URL}api/media/get`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}


function deleteMedia(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(postData),
    };
    return fetch(`${API_URL}api/media/delete`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}