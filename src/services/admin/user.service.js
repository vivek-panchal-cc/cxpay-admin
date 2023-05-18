import { authHeader } from "../../_helpers";
import { notify, handleResponse, setLoading } from "../../_helpers/";
require("dotenv").config();

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
      "mode":"no-cors",
    },
    body: JSON.stringify({ email, password }),
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/auth/signin`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
    })
    .then(handleResponse)
    .then((user) => {
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function getUsersList(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader("users", "view"),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/users/index`,
    requestOptions
  )
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

  return fetch(`${process.env.REACT_APP_API_URL}api/users/add`, requestOptions)
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/users/${id}`,
    requestOptions
  )
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

  return fetch(`${process.env.REACT_APP_API_URL}api/users/edit`, requestOptions)
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
  return fetch(
    `${process.env.REACT_APP_API_URL}api/users/${id}`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function forgotPassword(postData) {
  setLoading(true);
  const requestOptions = {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(postData),
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/forgot_password`,
    requestOptions
  )
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/reset_password`,
    requestOptions
  )
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/user_groups/data/list`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}

function getPermission() {
  let user = JSON.parse(localStorage.getItem("user"));
  setLoading(true);
  const requestOptions = {
    method: "GET",
    headers: authHeader("common", "view"),
  };

  return fetch(
    `${process.env.REACT_APP_API_URL}api/users/permission/${user.id}`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then((data) => {
      return data.text().then((text) => {
        const data = text && JSON.parse(text);
        setLoading(false);
        if (
          data.type !== undefined &&
          data.type === "unauthorized" &&
          data.status === false
        ) {
          const error = (data && data.message) || data.statusText;
          notify.error(error);
          localStorage.removeItem("user");
          window.location.reload();
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
  return fetch(
    `${process.env.REACT_APP_API_URL}api/users/${id}`,
    requestOptions
  )
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/update_my_profile`,
    requestOptions
  )
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/get_my_profile`,
    requestOptions
  )
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/delete_multiple_users`,
    requestOptions
  )
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

  return fetch(
    `${process.env.REACT_APP_API_URL}api/users/change_bulk_users_status`,
    requestOptions
  )
    .catch((error) => {
      notify.error("Something went wrong");
      setLoading(false);
      return Promise.reject();
    })
    .then(handleResponse);
}
