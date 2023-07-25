import {
  authHeader,
  authHeaderMutlipart,
  authHeaderMutlipartFormData,
} from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

const getManualFundAddList = async (postData) => {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("manual_requests", "view"),
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
};

export const fundRequestService = {
  getManualFundAddList,
};
