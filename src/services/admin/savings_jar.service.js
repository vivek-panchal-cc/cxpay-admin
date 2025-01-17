import { authHeader, authHeaderMutlipart } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const savingJarService = {
  savingJarBulkAction,
  savingJarAddOrUpdate,
};

async function savingJarBulkAction(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("saving_jar", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/saving-jar-category-operations`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    // const response = undefined;
  } finally {
    setLoading(false);
  }
  return handleResponse(response);
}

async function savingJarAddOrUpdate(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeaderMutlipart("saving_jar", "view"),
    body: postData,
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/saving-jar-category-operations`,
      requestOptions
    );
  } catch (error) {
    notify.error("Something went wrong");
    // const response = undefined;
  } finally {
    setLoading(false);
  }
  return handleResponse(response);
}
