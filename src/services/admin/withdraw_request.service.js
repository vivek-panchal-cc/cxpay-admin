import {
  authHeader,
  authHeaderMutlipart,
  authHeaderMutlipartFormData,
} from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

export const withdrawRequestService = {
  getWithdrawRequestData,
  withdrawDetails,
  withdrawRequestAction,
  chnageWithdrawStatus,
  downloadReciept,
};

function getWithdrawRequestData(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("withdraw_requests", "view"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${process.env.REACT_APP_API_URL}api/withdraw-list`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function withdrawDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("withdraw_requests", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/withdraw-details`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function withdrawRequestAction(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipartFormData("withdraw_requests", "update"),
    body: postData,
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/withdraw-request-action`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function chnageWithdrawStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("withdraw_requests", "update"),
    body: JSON.stringify(postData),
  };
  return fetch(
    `${process.env.REACT_APP_API_URL}api/request-status-change`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function downloadReciept(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipartFormData("withdraw_requests", "view"),
    body: postData,
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/view-bank-withdraw-receipt`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
