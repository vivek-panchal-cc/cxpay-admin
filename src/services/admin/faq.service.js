import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const faqService = {
  getFaqList,
  createFaq,
  deleteFaq,
  getFaq,
  updateFaq,
  detailFaqView,
  changeFaqStatus,
  changeSequenceData,
  changeBulkFaqsStatus,
};

async function getFaqList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("faqs", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/faq/get-list`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

async function createFaq(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "create"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/faq/add`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

async function deleteFaq(id) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "delete"),
    body: JSON.stringify(id),
  };
  let response;
  try {
    response = await fetch(`${API_URL}api/faq/delete`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function getFaq(id) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "view"),
    body: JSON.stringify(id),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/faq/get-detail`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateFaq(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/faq/update`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function detailFaqView(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("faqs", "view"),
    body: JSON.stringify(id),
  };
  let response;
  try {
    response = await fetch(`${API_URL}api/faq/${id}`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeFaqStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "edit"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(`${API_URL}api/faq/change-status`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeSequenceData(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("faqs", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/faq/change-sequence`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBulkFaqsStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/faq/change_bulk_page_status`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
