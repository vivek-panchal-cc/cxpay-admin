export function authHeader(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user?.accessToken) {
    return {
      "x-access-token": user.accessToken,
      "Content-Type": "application/json",
      module_name: module_name,
      action: action,
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}

export function authHeaderMutlipart(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user?.accessToken) {
    return { "x-access-token": user.accessToken };
  } else {
    return { "Content-Type": "application/json" };
  }
}

export function authHeaderMutlipartFormData(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user?.accessToken) {
    return { "x-access-token": user.accessToken };
  } else {
    return { "Content-Type": "multipart/form-data" };
  }
}

export function authHeaderTimezoneDevice(module_name = "", action = "", isMultipart=false) {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user?.accessToken) {
    let multipart = '';
    if (isMultipart) {
      multipart = "multipart/form-data"
    } else {
      multipart = "application/json"
    }
    return {
      "x-access-token": user.accessToken,
      "Content-Type": multipart,
      "User-Timezone": "asia/kolkata",
      "Device-Type": "web",
      module_name: module_name,
      action: action,
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}

export function authHeaderMutlipartAgent(module_name = "", action = "") {
  let user = JSON.parse(localStorage.getItem("user"));
  if (user?.accessToken) {
    return { 
      "x-access-token": user.accessToken,
      "User-Timezone": "asia/kolkata",
      "Device-Type": "web",
      // "Content-Type": "multipart/form-data"
    };
  } else {
    return { "Content-Type": "application/json" };
  }
}