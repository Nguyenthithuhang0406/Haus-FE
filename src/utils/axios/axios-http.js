import { getCookie } from "../cookies";

const request = (instance, config) => {
  return instance({ ...config });
};

// tao ra instance axios cho cac api can token
const requestWithToken = (instance, config) => {
  const accessToken = getCookie("accessToken");
  if (!accessToken) {
    window.location.href = "/login";
    throw new Error("Bạn cần đăng nhập để thực hiện yêu cầu này.");
  }
  return instance({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export { request, requestWithToken };
