import { authHeader } from '../../_helpers';
import { notify, handleResponse, setLoading } from '../../_helpers/';
require('dotenv').config();

const API_URL = process.env.REACT_APP_API_URL;
/*************** Export Functions Defined For Services ******************************/

export const dashboardService = {
    getDetails
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

/**
 * The function sends a POST request to an API endpoint with authentication headers and a JSON payload,
 * and returns a promise that resolves with the response data or rejects with an error message.
 * @param postData - postData is an object that contains data to be sent in the request body. It is
 * being converted to a JSON string using `JSON.stringify()` before being sent in the request.
 * @returns The `getDetails` function is returning the result of the `fetch` method, which is a Promise
 * that resolves to the response from the server. The response is then passed to the `handleResponse`
 * function for further processing.
 */
function getDetails(postData) {
    setLoading(true);
    const requestOptions = {
        method: 'GET',
        headers: authHeader('dashboard', 'view'),
        body: JSON.stringify(postData)
    };

    return fetch(`${API_URL}api/dashboard`, requestOptions).catch((error) => {
        notify.error('Something went wrong');
        setLoading(true);
    }).then(handleResponse);
}
