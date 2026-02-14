import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

/*************** Export Functions Defined For Services ******************************/

export const settingsService = {
  getSettings,
  updateSettings,
};

/****************** Retrieve Single Record From Server ************************/

function getSettings() {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("settings", "view"),
    //body: JSON.stringify(),
  };

  // http://localhost/cxpay-admin-api/public/api/system_modules/index

  return fetch(
    `${API_URL}api/system_modules/index`,
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

function updateSettings(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("settings", "update"),
    body: JSON.stringify(postData),
  };

  // http://localhost/cxpay-admin-api/public/api/system_modules/update
  //system_option_name
  return fetch(
    `${API_URL}api/system_modules/update`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
