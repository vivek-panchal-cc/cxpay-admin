import { authHeader, authHeaderFile } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const paymentsService = {
  getSchedulePaymentsList,
  // customerDetails,
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

// async function customerDetails(postData) {
//   setLoading(true);
//   const requestOptions = {
//     method: "POST",
//     headers: authHeader("customer_reports", "view"),
//     body: JSON.stringify(postData),
//   };

//   let response;
//   try {
//     setLoading(true);
//     response = await fetch(
//       `${API_URL}api/get-customer`,
//       requestOptions
//     );
//   } catch (error) {
//     notify.error("Something went wrong");
//     setLoading(false);
//   }
//   return handleResponse(response);
// }
