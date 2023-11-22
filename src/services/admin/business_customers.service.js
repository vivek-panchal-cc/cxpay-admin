import { authHeader, authHeaderMutlipart } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const businessCustomersService = {
  getCustomersManagementList,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  deleteMultipleCustomer,
  changeCustomerStatus,
  changeBulkCustomerStatus,
  getCountry,
  getDeleteRequests,
  deleteBusinessCustomer,
  rejectDeleteRequest,
};

function getCustomersManagementList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/customers/business-customers`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function getCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/customers/get-detail`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function updateCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipart("business_customers", "update"),
    body: postData,
  };

  return fetch(
    `${API_URL}api/customers/business-customer-update`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function deleteCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "delete"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/customers/delete-customers`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function deleteMultipleCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "delete"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/customers/delete-customers`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changeCustomerStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/customers/change-status`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changeBulkCustomerStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/customers/change-status`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function getCountry() {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("business_customers", "update"),
  };

  return fetch(`${API_URL}api/customers/get-country`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function getDeleteRequests(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/delete-request-business-list`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

async function deleteBusinessCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "delete"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/business-customers/delete-customers`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function rejectDeleteRequest(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/business-delete-request-status-change`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
