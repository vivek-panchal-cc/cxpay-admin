import axios from 'axios';
import { authHeader, authHeaderMutlipart } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';
require('dotenv').config();

export const customersManagementService = {
    getCustomersManagementList,
    // createUsersGroups,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    deleteMultipleCustomer,
    changeCustomerStatus,
    changeBulkCustomerStatus,
    getCountry
};


function getCustomersManagementList(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('customers', 'view'),
        body: JSON.stringify(postData)
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/customers/personal-customers`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
    }).then(handleResponse);
}

// function createUsersGroups(postData) {
//     setLoading(true);
//     const requestOptions = {
//         method: 'POST',
//         headers: authHeader('user_groups','create'),
//         body: JSON.stringify(postData)
//     };

//     return fetch(`${process.env.REACT_APP_API_URL}api/user_groups/add`, requestOptions).catch((error) => {
//         notify.error('Something went wrong');
//         setLoading(false);
//     }).then(handleResponse);
// }

function getCustomer(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('customers', 'view'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/customers/get-detail`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function updateCustomer(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        // headers: authHeader('customers','update'),
        headers: authHeaderMutlipart('customers', 'update'),
        body: postData
    };
    // let user = JSON.parse(localStorage.getItem('user'));
    // axios.post(`${process.env.REACT_APP_API_URL}api/customers/update`,postData,{
    //     headers:{
    //         'x-access-token':user.accessToken
    //     }
    // });

    return fetch(`${process.env.REACT_APP_API_URL}api/customers/update`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteCustomer(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('customers', 'delete'),
        body: JSON.stringify(postData)
    };
    return fetch(`${process.env.REACT_APP_API_URL}api/customers/delete-customers`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function deleteMultipleCustomer(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('customers', 'delete'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/customers/delete-customers`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changeCustomerStatus(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('customers', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/customers/change-status`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function changeBulkCustomerStatus(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'POST',
        headers: authHeader('customers', 'update'),
        body: JSON.stringify(postData)
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/customers/change-status`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}

function getCountry() {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('customers', 'update'),
    };

    return fetch(`${process.env.REACT_APP_API_URL}api/customers/get-country`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(false);
        return Promise.reject();
    }).then(handleResponse);
}