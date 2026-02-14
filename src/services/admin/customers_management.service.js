// import axios from "axios";
import { authHeader, authHeaderMutlipart, setLoading } from "../../_helpers";
import { notify, handleResponse } from "../../_helpers/";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const customersManagementService = {
  getCustomersManagementList,
  // createUsersGroups,
  getCustomer,
  getCustomerWiseDetails,
  updateCustomer,
  deleteCustomer,
  deleteMultipleCustomer,
  changeCustomerStatus,
  changeBulkCustomerStatus,
  getCountry,
  getPersonalKycDocument,
  downloadReportData,
  getMerchantFeesReport,
  downloadMerchantFeesReportData,
};

async function getCustomersManagementList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/personal-customers`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");

    const response = undefined;
  }
  return handleResponse(response);
}

// function createUsersGroups(postData) {
//
//     const requestOptions = {
//         method: 'POST',
//         headers: authHeader('user_groups','create'),
//         body: JSON.stringify(postData)
//     };

//     return fetch(`${API_URL}api/user_groups/add`, requestOptions).catch((error) => {
//         notify.error('Something went wrong');
//
//     }).then(handleResponse);
// }

async function getCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/get-detail`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function getCustomerWiseDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "view"),
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

async function updateCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    // headers: authHeader('customers','update'),
    headers: authHeaderMutlipart("personal_customers", "update"),
    body: postData,
  };
  // let user = JSON.parse(localStorage.getItem('user'));
  // axios.post(`${API_URL}api/customers/update`,postData,{
  //     headers:{
  //         'x-access-token':user.accessToken
  //     }
  // });

  let response;
  try {
    response = await fetch(`${API_URL}api/customers/update`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "delete"),
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

async function deleteMultipleCustomer(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "delete"),
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

async function changeCustomerStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBulkCustomerStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/customers/change-status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function getCountry() {
  const requestOptions = {
    method: "GET",
    headers: authHeader("personal_customers", "view"),
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

async function getPersonalKycDocument(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "view"),
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
    headers: authHeader("personal_customers", "view"),
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

async function getMerchantFeesReport(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("personal_customers", "view"),
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
    headers: authHeader("personal_customers", "view"),
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
