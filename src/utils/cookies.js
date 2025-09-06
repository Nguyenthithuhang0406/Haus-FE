import cookies from "js-cookie";

export const getCookie = (name) => cookies.get(name);

export const setCookie = (name, value, expires = 1, options = {}) => {
  cookies.set(name, value, { expires, ...options });
};

export const removeCookie = (name) => cookies.remove(name);

export const removeAllCookies = () => {
  Object.keys(cookies.get()).forEach((key) => {
    cookies.remove(key);
  });
};
