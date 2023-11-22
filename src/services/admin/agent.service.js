import {
  authHeader,
  authHeaderTimezoneDevice,
  authHeaderMutlipart,
  authHeaderMutlipartAgent,
} from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

/*************** Export Functions Defined For Services ******************************/

export const agentService = {
  getAgentList,
  createAgent,
  deleteAgent,
  getAgentDetails,
  updateAgent,
  detailview,
  changeAgentStatus,
  deleteMultipleAgent,
  changeBulkCustomerStatus,
  getCountry,
  getCollectionType,
  getDeleteRequests,
  rejectDeleteRequest,
  getBlockedRequests,
  releaseCustomer,
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

function getAgentList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/agent-list`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/**************************  For creating Page Transfer Data to backend By -Vivek Bisht *********************/

// function createPages(postData) {

//     setLoading(true);
//     const requestOptions = {
//         method: 'POST',
//         headers: authHeader('cms_pages', 'create'),
//         body: JSON.stringify(postData)
//     };

//     return fetch(`${API_URL}api/cms_pages/add`, requestOptions).catch((error) => {
//         notify.error('Something went wrong');
//         setLoading(true);
//     }).then(handleResponse);
// }
function createAgent(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipartAgent("agent_customers", "create"),
    body: postData,
  };

  return fetch(`${API_URL}api/register-agent`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/******************** Retrieve Delete Api From Server *************************/
function deleteAgent(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "delete"),
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

/****************** Retrieve Single Record From Server ************************/

// function getpage(id) {
//     setLoading(true);
//     const requestOptions = {
//         method: 'GET',
//         headers: authHeader('cms_pages', 'view')
//     };

//     return fetch(`${API_URL}api/cms_pages/${id}`, requestOptions).catch((error) => {
//         notify.error('Something went wrong');
//         setLoading(false);
//         return Promise.reject();
//     }).then(handleResponse);
// }

function getAgentDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/agent-details`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/***********************  Retrive Api For Update from server  *****************************/

function updateAgent(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipartAgent("agent_customers", "update"),
    body: postData,
  };

  return fetch(`${API_URL}api/agent-update`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/********************** Retrieve Api for Detail view of Post from server   *****************************/
function detailview(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/agent-wise-recharge`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changeAgentStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "update"),
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

function deleteMultipleAgent(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "delete"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/delete_multiple_pages`, requestOptions)
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
    headers: authHeader("agent_customers", "update"),
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
    headers: authHeader("agent_customers", "update"),
  };

  return fetch(`${API_URL}api/customers/get-country`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function getCollectionType() {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("agent_customers", "update"),
  };

  return fetch(`${API_URL}api/agent-collection-type-list`, requestOptions)
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
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/delete-request-agent-list`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

async function getBlockedRequests(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/blocked-customers-list`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function releaseCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(`${API_URL}api/customers/release-customer`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

function rejectDeleteRequest(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("agent_customers", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/delete-request-status-change`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
