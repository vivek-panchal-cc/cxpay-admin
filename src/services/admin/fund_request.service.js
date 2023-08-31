import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

/** For getting the list of manual fund requests */
const getManualFundAddList = async (postData) => {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("manual_requests", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${process.env.REACT_APP_API_URL}api/manual-fund-add-list`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
    })
    .then(handleResponse);
};

/** For getting the manual fund details from transaction_id */
const getManualFundDetails = async (postData) => {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("manual_requests", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${process.env.REACT_APP_API_URL}api/manual-fund-details`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
    })
    .then(handleResponse);
};

/** For getting the manual fund details from transaction_id */
const updateManualFundStatus = async (postData) => {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("manual_requests", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${process.env.REACT_APP_API_URL}api/manual-fund-update-status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
    })
    .then(handleResponse);
};

/** For getting the manual fund request receipt from receipt_id */
const getManualFundReceipt = async (postData) => {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("manual_requests", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${process.env.REACT_APP_API_URL}api/view-manual-fund-receipt`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
    })
    .then(handleResponse);
};

export const fundRequestService = {
  getManualFundAddList,
  getManualFundDetails,
  updateManualFundStatus,
  getManualFundReceipt,
};
