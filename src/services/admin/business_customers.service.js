import { authHeader, authHeaderMutlipart, setLoading } from "../../_helpers";
import { notify, handleResponse } from "../../_helpers/";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;
const API_CUSTOMER_ONBOARD = process.env.REACT_APP_API_CUSTOMER_ONBOARD;

export const businessCustomersService = {
  getCustomerWiseDetails,
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
  getPendingKycCustomerList,
  getAdminApprovalCustomerList,
  getBusinessKycDocument,
  downloadReportData,
  businessCategory,
  createBusinessUser,
  refreshMerchantToken,
  getMerchantFeesReport,
  downloadMerchantFeesReportData,
  webHookOperations,
};

async function getCustomerWiseDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/get-customer-wise-details`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}

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
    })
    .then(handleResponse);
}

async function getPendingKycCustomerList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/pending-kyc-customer-list`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    // const response = undefined;
  }
  return handleResponse(response);
}

async function getAdminApprovalCustomerList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/pending-approved-customer-list`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    // const response = undefined;
  }
  return handleResponse(response);
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
      return Promise.reject();
    })
    .then(handleResponse);
}

async function getCountry() {
  const requestOptions = {
    method: "GET",
    headers: authHeader("business_customers", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/get-country`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
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
      `${API_URL}api/customers/delete-customers`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
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
      `${API_URL}api/delete-request-status-change-business`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function getBusinessKycDocument(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/download-user-kyc-document`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function downloadReportData(postData) {
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/export-customer-wise-details`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
  }
  return handleResponse(response);
}

async function businessCategory(postData) {
  const requestOptions = {
    method: "POST",
    // headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_CUSTOMER_ONBOARD}list-active-business-category`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    // const response = undefined;
  } finally {
  }
  return handleResponse(response);
}

async function createBusinessUser(postData, timeZone) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: { "User-Timezone": timeZone, "Device-Type": "web" },
    body: postData,
  };
  let response;
  try {
    response = await fetch(
      `${API_CUSTOMER_ONBOARD}register-user`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    // const response = undefined;
  } finally {
  }
  return handleResponse(response);
}

async function refreshMerchantToken(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/refresh-merchant-token`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function getMerchantFeesReport(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/get-merchant-fees-report`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function downloadMerchantFeesReportData(postData) {
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/export-merchant-fees-report`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
  }
  return handleResponse(response);
}

async function webHookOperations(postData) {
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_customers", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/merchant-callback-url-operations`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}
