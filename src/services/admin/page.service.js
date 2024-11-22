import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

/*************** Export Functions Defined For Services ******************************/

export const pageService = {
  getPageList,
  createPages,
  deletepage,
  getpage,
  updatepage,
  detailview,
  changePageStatus,
  deleteMultiplePages,
  changeBulkPageStatus,
  getCMSList,
  changeSequenceData,
};

/*********************  Get List of All Pages from Database By - vivek bisht  *****************************/

function getPageList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/cms_pages/index`, requestOptions)
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
    headers: authHeader("cms_pages", "create"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/cms_pages/add`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(true);
    })
    .then(handleResponse);
}

/******************** Retrieve Delete Api From Server *************************/
function deletepage(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("cms_pages", "view"),
  };
  return fetch(`${API_URL}api/cms_pages/${id}`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/****************** Retrieve Single Record From Server ************************/

function getpage(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("cms_pages", "view"),
  };

  return fetch(`${API_URL}api/cms_pages/${id}`, requestOptions)
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
    headers: authHeader("cms_pages", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/cms_pages/edit`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

/********************** Retrieve Api for Detail view of Post from server   *****************************/
function detailview(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("cms_pages", "view"),
  };
  return fetch(`${API_URL}api/cms_pages/${id}`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changePageStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("cms_pages", "edit"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/cms_pages/${id}`, requestOptions)
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
    headers: authHeader("cms_pages", "delete"),
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

function changeBulkPageStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${API_URL}api/cms_pages/change_bulk_page_status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

async function getCMSList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/cms_pages/get-active-page-list`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

async function changeSequenceData(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("cms_pages", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/cms_pages/change-cms-sequence`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
