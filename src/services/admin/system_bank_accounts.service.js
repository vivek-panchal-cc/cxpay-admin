import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const systemBankAccountsServices = {
  systemBankAccountsBulkAction,
};

async function systemBankAccountsBulkAction(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("system_bank_accounts", "view"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(
      `${API_URL}api/system-bank-account-operations`,
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
