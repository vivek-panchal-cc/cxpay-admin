import { authHeader, notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const paymentsService = {
  getSchedulePaymentsList,
  getRecurringPaymentsList,
  recurringDetails,
};

async function getSchedulePaymentsList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("schedule_payments", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/list-schedule-payment`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function getRecurringPaymentsList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("recurring_payments", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${API_URL}api/list-recurring-payment`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function recurringDetails(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("recurring_payments", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    setLoading(true);
    response = await fetch(
      `${API_URL}api/recurring-payment-details`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}
