import { authHeader, authHeaderFile } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
import moment from "moment";
require("dotenv").config();

export const pushNotificationService = {
  getPushNotificationList,
  deleteNotification,
  updateNotification,
  createNotification,
  getNotifications,
  getUserList,
};

async function getPushNotificationList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("notifications", "view"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/notifications`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function getUserList(){
  const requestOptions = {
    method: "POST",
    headers: authHeader("notifications", "create"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/notifications/active-customers`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function deleteNotification(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("notifications", "delete"),
  };
  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/notifications/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function updateNotification(postData, id) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("notifications", "update"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/notifications/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

async function createNotification(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("notifications", "create"),
    body: JSON.stringify(postData),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/notifications/add`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
  }
  return handleResponse(response);
}

async function getNotifications(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("notifications", "view"),
  };

  let response;
  try {
    response = await fetch(
      `${process.env.REACT_APP_API_URL}api/notifications/${id}`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}
