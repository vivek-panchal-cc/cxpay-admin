import { authHeader, history } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

const API_URL = process.env.REACT_APP_API_URL;

export const userService = {
  login,
  logout,
  getUsersList,
  createUsers,
  getUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  resetPasswordLink,
  getUserGroups,
  getPermission,
  changeUserStatus,
  getMyProfile,
  updateMyProfile,
  deleteMultipleUsers,
  changeBulkUsersStatus,
};

function login(email, password) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      mode: "no-cors",
    },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`${API_URL}api/auth/signin`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

async function logout() {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "view"),
  };

  let response;
  try {
    response = await fetch(`${API_URL}api/logout`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    const response = undefined;
  }
  return handleResponse(response);
}

function getUsersList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/users/index`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function createUsers(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "create"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/users/add`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse);
}

function getUser(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("users", "view"),
  };

  return fetch(`${API_URL}api/users/${id}`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function updateUser(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/users/edit`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function deleteUser(id) {
  setLoading(true);
  const requestOptions = {
    method: "DELETE",
    headers: authHeader("users", "delete"),
  };
  return fetch(`${API_URL}api/users/${id}`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

async function resetPasswordLink(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };
  let response;
  try {
    response = await fetch(`${API_URL}api/forgot_password`, requestOptions);
  } catch (error) {
    notify.error("Something went wrong");
    setLoading(false);
    response = await Promise.reject();
  }
  return handleResponse(response);
}

function forgotPassword(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/forgot_password`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function resetPassword(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/reset_password`, requestOptions)
    .catch((error) => {
      setLoading(false);
      notify.error("Something went wrong");
      return Promise.reject();
    })
    .then(handleResponse);
}

function getUserGroups() {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("common", "view"),
  };

  return fetch(`${API_URL}api/user_groups/data/list`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function getPermission() {
  let user = JSON.parse(localStorage.getItem("user"));
  // setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("common", "view"),
  };

  return fetch(`${API_URL}api/users/permission/${user.id}`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      // setLoading(false);
      return Promise.reject();
    })
    .then((data) => {
      return data.text().then((text) => {
        const data = text && JSON.parse(text);
        // setLoading(false);
        if (data.type === "unauthorized" || !data.status) {
          if (data.message) notify.error(data.message);
          localStorage.removeItem("user");
          history.push("/admin/login");
        } else {
          let update_user = {
            ...user,
            user_permission: data.user_permission,
          };
          localStorage.setItem("user", JSON.stringify(update_user));
        }
      });
    });
}

function changeUserStatus(id, postData) {
  setLoading(true);
  const requestOptions = {
    method: "PUT",
    headers: authHeader("users", "edit"),
    body: JSON.stringify(postData),
  };
  return fetch(`${API_URL}api/users/${id}`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function updateMyProfile(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/update_my_profile`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function getMyProfile(id) {
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader(),
  };

  return fetch(`${API_URL}api/get_my_profile`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function deleteMultipleUsers(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "delete"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/delete_multiple_users`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function changeBulkUsersStatus(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "update"),
    body: JSON.stringify(postData),
  };

  return fetch(`${API_URL}api/users/change_bulk_users_status`, requestOptions)
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
