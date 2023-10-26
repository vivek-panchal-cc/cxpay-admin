import { authHeader, authHeaderFile } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
import moment from "moment";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const reportsService = {
  getCustomersList,
  customerDetails,
  downloadCustomerCSV,
  getTransactionList,
  downloadTransactionCSV,
};

async function getCustomersList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customer_reports", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/generate-customer-report`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function customerDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customer_reports", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    setLoading(true);
    response = await fetch(
      `${API_URL}api/get-customer`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function downloadCustomerCSV(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("customer_reports", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/export-customer-report`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function getTransactionList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("transaction_reports", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/generate-transaction-report`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }

  return handleResponse(response);
}

async function downloadTransactionCSV(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("transaction_reports", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/export-transaction-report`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}
