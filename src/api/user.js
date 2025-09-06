import { request, requestWithToken } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getUserProfile = async () => {
  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "GET",
      url: "/user/profile",
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updatePassword = async (data) => {
  const { email, newPassword } = data;
  try {
    const response = await request(axiosPublic, {
      method: "POST",
      url: "/auth/reset-password",
      data: {
        email,
        newPassword,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const uploadAvatar = async (data) => {
  const { avatar } = data;
  const formData = new FormData();
  formData.append("file", avatar);

  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "POST",
      url: "/user/upload-avatar",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  const {
    firstName,
    lastName,
    email,
    gender,
    dateOfBirth,
    passwordConfirm,
    phone
  } = data;

  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "PUT",
      url: "/user/update-profile",
      data: {
        passwordConfirm,
        profileData: {
          firstName,
          lastName,
          dateOfBirth,
          gender,
          email,
          phone
        },
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const resetPassword = async (data) => {
  const { currentPassword, newPassword } = data;
  try {
    const response = await requestWithToken(axiosPrivate, {
      method: "PATCH",
      url: "/user/update-password",
      data: {
        currentPassword,
        newPassword,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}