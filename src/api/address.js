import { request } from "@/utils/axios/axios-http";
import { axiosPrivate } from "@/utils/axios/axiosInstance";

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
  const { country, city, district, commune, detailAddress } = data;
  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/address",
      data: {
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
    const { id, country, city, district, commune, detailAddress } = data;
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/address/${id}`,
      data: {
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
