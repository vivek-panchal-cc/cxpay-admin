import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const businessCategoryManagementService = {
  getFeeStructures,
  createFeeStructure,
  getFeeDetail,
  updateFeeStructure,
  changeFeeStatus,
  deleteMultiplePages,
  changeBulkFeeStatus,
};

async function getFeeStructures(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_category", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/fees/index`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

async function createFeeStructure(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_category", "create"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/fees/add`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(true);
    const response = undefined;
  }
  return handleResponse(response);
}

async function getFeeDetail(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_category", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/fees/detail`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateFeeStructure(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_category", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/fees/update`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeFeeStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_category", "edit"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/fees/change-status`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteMultiplePages(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("business_category", "delete"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/business_category/delete`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);

    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function changeBulkFeeStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/fees/change-status`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);

    response = await Promise.reject();
  }
  return handleResponse(response);
}
