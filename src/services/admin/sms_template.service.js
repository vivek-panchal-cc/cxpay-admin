import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

/*************** Export Functions Defined For Services ******************************/

export const smsTemplateService = {
  getPageList,
  createPages,
  deletepage,
  getpage,
  updatepage,
  changePageStatus,
  deleteMultiplePages,
  changeBulkPageStatus,
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

function getPageList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "view"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/index
  // page
  // search
  // sort_dir
  // sort_field

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/index`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/**************************  For creating Page Transfer Data to backend By -Vivek Bisht *********************/

function createPages(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "create"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/add
  // name: fund
  // slug: add_fund
  // template:Your register mobile OTP For ##APP_NAME## is ##FUND##
  // status: 1

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/add`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/******************** Retrieve Delete Api From Server *************************/
function deletepage(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "view"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/delete
  // id[0]:5
  // status:true

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/delete`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/****************** Retrieve Single Record From Server ************************/

function getpage(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "view"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/detail
  // id: 3

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/detail`,
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

function updatepage(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "update"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/update
  // name:add fund
  // slug: add_fund
  // template:Your register mobile OTP For ##APP_NAME## is ##FUND##
  // status: 1
  // id: 6

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/update`,
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

function changePageStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("sms_templates", "edit"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/change-status
  // id[0]:3
  // status:true

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/change-status`,
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
    headers: authHeader("sms_templates", "delete"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/delete
  // id[0]: 5
  // status: true

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/delete`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changeBulkPageStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/sms_templates/change-status
  // id[0]:3
  // status:true

  return fetch(
    `${process.env.REACT_APP_API_URL}api/sms_templates/change-status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
