import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

/*************** Export Functions Defined For Services ******************************/

export const emailTemplateService = {
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
    headers: authHeader("email_templates", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${API_URL}api/email_templates/index`,
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
    headers: authHeader("email_templates", "create"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${API_URL}api/email_templates/add`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/******************** Retrieve Delete Api From Server *************************/
function deletepage(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("email_templates", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${API_URL}api/email_templates/${id}`,
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
    headers: authHeader("email_templates", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${API_URL}api/email_templates/detail`,
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

function updatepage(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("email_templates", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${API_URL}api/email_templates/${id}`,
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
    headers: authHeader("email_templates", "edit"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${API_URL}api/email_templates/change-status`,
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
    headers: authHeader("email_templates", "delete"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${API_URL}api/email_templates/delete_bulk`,
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

  return fetch(
    `${API_URL}api/email_templates/change_bulk_status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
