import { authHeader,authHeaderMutlipart } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';

require('dotenv').config();


export const bannerManagementser = {

    createbanner,
    getbannerlist,
    deletebanner,
    get_banner_single,
    update_banner_menu,
    deleteMultiplebanner,
    changebannerStatus,
    changeBulkBannerStatus

};

/******************* Add  Banner menu   **************************/

function createbanner(postData) {
   
   setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers:authHeaderMutlipart('bannner_management','create'),
         body: postData
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/banner/add`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/****************** Get Listing Banner   **********************/

function getbannerlist(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('banner_management', 'view'),
        body: JSON.stringify(postData),
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/banner/index`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

/*********** Banner Item Delete  ********************************/

function deletebanner(id) {
    setLoading(true);
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader('banner_management', 'delete'),
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/banner/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/**************************** Edit Banner management  **************************/
function update_banner_menu(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers:authHeaderMutlipart('banner_management', 'update'),
        body: postData
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/banner/edit`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}


/*********************** Get Menu category Rec ************************/
function get_banner_single(id) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers:authHeaderMutlipart('banner_management', 'view')
    };
   
    return fetch(`${process.env.REACT_APP_API_URL}api/banner/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changebannerStatus(id,postData) {
    setLoading(true);
    const requestOptions = {
        method: 'PUT',
        headers: authHeader('banner_management', 'edit'),
        body: JSON.stringify(postData)
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/banner/${id}`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteMultiplebanner(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('banner_management','delete'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/delete_multiple_banner`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changeBulkBannerStatus(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('banner_management', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/banner/change_bulk_banner_status`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}