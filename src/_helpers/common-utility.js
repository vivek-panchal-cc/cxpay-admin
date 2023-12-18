import { notify, history } from "./index";
import { differenceInCalendarDays, differenceInMonths } from 'date-fns';

/* Handle all http resopnse from all API */
export const handleResponse = (response) => {
  setLoading(true);
  if (response !== undefined) {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);
      if (
        data.type !== undefined &&
        data.type === "unauthorized" &&
        data.status === false
      ) {
        const error = (data && data.message) || response.statusText;
        notify.error(error);
        localStorage.removeItem("user");
        history.push("/admin/login");
        return Promise.reject(error);
      } else if (
        data.type !== undefined &&
        data.type === "access_denied" &&
        data.status === false
      ) {
        const error = (data && data.message) || response.statusText;
        notify.error(error);
        // history.push('/admin/dashboard');
        history.push({
          pathname: "/admin/dashboard",
          state: { access_message: true },
        });
        return Promise.reject(error);
      }
      setLoading(false);
      return data;
    });
  } else {
    return Promise.reject("Something went wrong");
  }
};

/* Add/Remove loader */
export const setLoading = (flag) => {
  let loader = document.querySelector(".loader-container");
  if (flag) {
    loader.classList.add("loading");
  } else {
    loader.classList.remove("loading");
  }
};

/* Capitalized first character from string */
export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  var separateWord = s.toLowerCase().split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(" ");
};

/* Checkiang for menu permission */
export const menuPermission = (navigation) => {
  let user = JSON.parse(localStorage.getItem("user"));
  let permission_nav = [];
  if (user.user_group_id === "60227751e2e5152364d34551") {
    return navigation;
  } else if (user.user_group === "Super Users") {
    for (var key in navigation) {
      if (navigation[key].module_name !== "system_modules") {
        permission_nav.push(navigation[key]);
      }
    }
    return permission_nav;
  } else {
    for (var key in navigation) {
      if (navigation[key].module_name !== "system_modules") {
        if (
          user.user_permission[navigation[key].module_name] !== undefined ||
          navigation[key].module_name === "dashboard" ||
          navigation[key].module_name === undefined
        ) {
          permission_nav.push(navigation[key]);
        }
      }
    }
    return permission_nav;
  }
};

/* ACL page Access middleware */
export const _canAccess = (module, access = "", redirect = "") => {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user.user_group_id === "60227751e2e5152364d34551") {
    return true;
  } else if (user.user_group === "Super Users" && module !== "system_modules") {
    return true;
  } else {
    if (
      user.user_permission[module] !== undefined &&
      user.user_permission[module].includes(access)
    ) {
      return true;
    } else if (redirect !== "") {
      notify.error("Access Denied Contact to Super User");
      history.push(redirect);
    } else if (redirect === "") {
      return false;
    } else {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin");
    }
  }
};

/* Current user details send */
export const _loginUsersDetails = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const addObjToFormData = (obj, pkey, formData) => {
  switch (Object.prototype.toString.call(obj)) {
    case "[object Array]":
      for (let i = 0; i < obj.length; i++) {
        const nKey = `${pkey}[${i}]`;
        addObjToFormData(obj[i], nKey, formData);
      }
      return;
    case "[object Object]":
      for (const key in obj) {
        const nKey = `${pkey}[${key}]`;
        addObjToFormData(obj[key], nKey, formData);
      }
      return;
    case "[object String]":
      formData.append(`${pkey}`, obj);
      return;
    case "[object Number]":
      formData.append(`${pkey}`, obj);
      return "obj";
    default:
      return;
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because months are zero-indexed in JS
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatDateFull = (inputDate) => {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";

  const formattedDate = `${day}-${month}-${year} ${
    hours % 12
  }:${minutes} ${amPm}`;

  return formattedDate;
};

export const calculateDuration = (renewDate, expirationDate) => {
  const renew = new Date(renewDate);
  const expiration = new Date(expirationDate);

  const yearDiff = expiration.getFullYear() - renew.getFullYear();
  const monthDiff = expiration.getMonth() - renew.getMonth();

  let duration = "";

  if (yearDiff > 0) {
    duration += `${yearDiff} ${yearDiff === 1 ? "year" : "years"}`;
  }

  if (monthDiff > 0) {
    duration += ` ${monthDiff} ${monthDiff === 1 ? "month" : "months"}`;
  }

  return duration.trim();
};

export const calculateDurationLeft = (expirationDate) => {
  const expiration = new Date(expirationDate);
  const currentDate = new Date();

  const daysLeft = differenceInCalendarDays(expiration, currentDate);
  const monthsLeft = differenceInMonths(expiration, currentDate);

  let durationLeft = "";

  if (monthsLeft > 0) {
    durationLeft += `${monthsLeft} ${monthsLeft === 1 ? 'month' : 'months'}`;
  }

  if (daysLeft > 0) {
    const remainingDaysInMonth = daysLeft % 30;
    if (monthsLeft > 0) {
      durationLeft += ' ';
    }
    durationLeft += `${remainingDaysInMonth} ${remainingDaysInMonth === 1 ? 'day' : 'days'}`;
  }

  return durationLeft.trim();
};
