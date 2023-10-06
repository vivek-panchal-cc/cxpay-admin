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

function getFeeStructures(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/fees/index`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/**************************  For creating Page Transfer Data to backend By -Vivek Bisht *********************/

function createFeeStructure(postData) {
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

  return fetch(`${API_URL}api/fees/add`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/****************** Retrieve Single Record From Server ************************/

function getFeeDetail(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "view"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/detail
  // id: 3

  return fetch(
    `${API_URL}api/fees/detail`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/***********************  Retrive Api For Update from server  *****************************/

function updateFeeStructure(postData) {
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

  return fetch(
    `${API_URL}api/fees/update`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/********************** Retrieve Api for Detail view of Post from server   *****************************/

function changeFeeStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "edit"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/change-status
  // id[0]:3
  // status:true

  return fetch(
    `${API_URL}api/fees/change-status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function deleteMultiplePages(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("fee_management", "delete"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fee_management/delete
  // id[0]: 5
  // status: true

  return fetch(
    `${API_URL}api/fee_management/delete`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changeBulkFeeStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/fees/change-status
  // id[0]:3
  // status:true

  return fetch(
    `${API_URL}api/fees/change-status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
