import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";
import axios from "axios";

export const getProvinces = async () => {
  try {
    const response = await axios.get("https://provinces.open-api.vn/api/p/");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tỉnh thành:", error);
    throw new Error("Lấy danh sách tỉnh thành không thành công");
  }
};

export const getDistricts = async (provinceCode) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
    );
    return response.data.districts;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách quận huyện không thành công");
  }
};

export const getWards = async (districtCode) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
    );
    return response.data.wards;
  } catch (error) {
    console.log(error);
    throw new Error("Lấy danh sách phường xã không thành công");
  }
};

export const getAllAddress = async () => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: "/address/user",
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addAddress = async (data) => {
  const {
    phoneNumber,
    recipientName,
    country,
    city,
    district,
    commune,
    detailAddress,
  } = data;
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/address",
      data: {
        recipientName,
        phoneNumber,
        country,
        city,
        district,
        commune,
        detailAddress,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAddressById = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/address/${id}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateAddressById = async (data) => {
  try {
    const {
      id,
      recipientName,
      phoneNumber,
      country,
      city,
      district,
      commune,
      detailAddress,
    } = data;
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/address/${id}`,
      data: {
        recipientName,
        phoneNumber,
        ...(country && { country: country }),
        ...(city && { city: city }),
        ...(district && { district: district }),
        ...(commune && { commune: commune }),
        ...(detailAddress && { detailAddress: detailAddress }),
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteAddress = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/address/${id}`,
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
