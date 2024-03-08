import { notify, history } from "./index";
import { differenceInCalendarDays, differenceInMonths } from "date-fns";

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

export const capitalizeWordByWord = (type) => {
  // Split the string by underscores and capitalize each word
  const words = type
    ?.split("_")
    ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1));

  // Join the words back together
  const formattedWord = words?.join(" ");

  return formattedWord;
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

export const formatDateByConditional = (dateStr, onlyDate = false) => {
  // Convert to ISO string format
  const isoDateStr = dateStr?.replace(" ", "T");

  const dateObj = new Date(isoDateStr);
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const dd = String(dateObj.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[dateObj.getMonth()];
  const yyyy = dateObj.getFullYear();

  let hh = dateObj.getHours();
  let period = "AM";
  if (hh >= 12) {
    if (hh > 12) hh -= 12; // Convert to 12-hour format
    period = "PM";
  }
  hh = String(hh).padStart(2, "0");
  const min = String(dateObj.getMinutes()).padStart(2, "0");

  if (onlyDate) {
    return `${dd}-${month}-${yyyy}`;
  } else {
    return `${dd}-${month}-${yyyy} at ${hh}:${min} ${period}`;
  }
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

export const formatDateFullWithTimeStamp = (dateString) => {
  // Convert "YYYY-MM-DD HH:MM:SS" to "YYYY/MM/DDTHH:MM:SS" format
  const reformattedDate = dateString.replace(" ", "T");

  const dateObj = new Date(reformattedDate);

  // Extract the day, month, and year
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Add 1 to get the month number and pad to 2 digits
  const year = dateObj.getFullYear();

  // Extract the hours and minutes
  let hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  if (hours > 12) hours -= 12; // Convert 24-hour format to 12-hour format
  if (hours === 0) hours = 12; // If it's 00 hours, change to 12 (for 12 AM)

  // Add leading zero if necessary
  hours = String(hours).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes} ${period}`;
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
    durationLeft += `${monthsLeft} ${monthsLeft === 1 ? "month" : "months"}`;
  }

  if (daysLeft > 0) {
    const remainingDaysInMonth = daysLeft % 30;
    if (monthsLeft > 0) {
      durationLeft += " ";
    }
    durationLeft += `${remainingDaysInMonth} ${
      remainingDaysInMonth === 1 ? "day" : "days"
    }`;
  }

  return durationLeft.trim();
};

export const formatMobileNumber = (mobileNumber) => {
  // Check if the mobileNumber contains '#'
  const index = mobileNumber?.indexOf("#");
  if (index !== -1) {
    // Extract the part before '#'
    const formattedNumber = mobileNumber?.substring(0, index);
    return formattedNumber?.trim(); // Trim any whitespace
  }
  return mobileNumber; // Return as it is if no '#' found
};
