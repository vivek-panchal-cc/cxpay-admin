import { authHeader,authHeaderMutlipart } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';

require('dotenv').config();


export const site_setting_Service = {

   
   
    updatemysite,
    getmysite

   

};

/******************* Add  Site   **************************/
/*
function create_site(postData) {
   
   setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers:authHeaderMutlipart('site_setting','create'),
         body: postData
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/site/add`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}




function getsite(postData) {
    console.log(postData);
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('site_setting', 'view'),
        body: JSON.stringify(postData),
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/site/index`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/*********** Site Setting Item Delete  ********************************

function delete_site(id) {
    setLoading(true);
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader('site_setting', 'delete'),
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/site/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}



/**************************** Edit Banner management  **************************/


function updatemysite(postData) {

    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers:authHeaderMutlipart('theme_setting', 'update'),
        body: postData
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/update_site`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function getmysite(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('theme_setting','view')
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/site`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/*********************** Get Menu category Rec ************************
function get_site_single(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers:authHeaderMutlipart('site_setting', 'view')
    };
   
    return fetch(`${process.env.REACT_APP_API_URL}api/site/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}
*/