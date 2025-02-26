import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

/*************** Export Functions Defined For Services ******************************/

export const feeManagementService = {
  getFeeStructures,
  createFeeStructure,
  getFeeDetail,
  updateFeeStructure,
  changeFeeStatus,
  deleteMultiplePages,
  changeBulkFeeStatus,
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

async function getFeeStructures(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "view"),
    body: JSON.stringify(postData),
  };

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(`${API_URL}api/fees/index`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    const /*************** Export Functions Defined For Services ******************************/
      response = undefined;
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}

/**************************  For creating Page Transfer Data to backend By -Vivek Bisht *********************/

async function createFeeStructure(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "create"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/add
  // payment_type:PL
  // fee_type:percentage
  // amount:250
  // fee_label:Personal fee
  // status:0

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(`${API_URL}api/fees/add`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    const /*************** Export Functions Defined For Services ******************************/
      response = undefined;
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}

/****************** Retrieve Single Record From Server ************************/

async function getFeeDetail(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "view"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/detail
  // id: 3

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(`${API_URL}api/fees/detail`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    /*************** Export Functions Defined For Services ******************************/
    response = await Promise.reject();
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}

/***********************  Retrive Api For Update from server  *****************************/

async function updateFeeStructure(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "update"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/update
  // payment_type:PL
  // fee_type:percentage
  // amount:250
  // fee_label:Personal fee
  // status:0
  // id: 6

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(`${API_URL}api/fees/update`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    /*************** Export Functions Defined For Services ******************************/
    response = await Promise.reject();
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}

/********************** Retrieve Api for Detail view of Post from server   *****************************/

async function changeFeeStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "edit"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/change-status
  // id[0]:3
  // status:true

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(`${API_URL}api/fees/change-status`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    /*************** Export Functions Defined For Services ******************************/
    response = await Promise.reject();
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}

async function deleteMultiplePages(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "delete"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fee_management/delete
  // id[0]: 5
  // status: true

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(
      `${API_URL}api/fee_management/delete`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    /*************** Export Functions Defined For Services ******************************/
    response = await Promise.reject();
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}

async function changeBulkFeeStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/change-status
  // id[0]:3
  // status:true

  let /*************** Export Functions Defined For Services ******************************/
    response;
  try {
    /*************** Export Functions Defined For Services ******************************/
    response = await fetch(`${API_URL}api/fees/change-status`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    /*************** Export Functions Defined For Services ******************************/
    response = await Promise.reject();
  }
  return handleResponse(
    /*************** Export Functions Defined For Services ******************************/
    response
  );
}
