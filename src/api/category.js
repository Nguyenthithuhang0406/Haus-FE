import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getAllCategory = async (data) => {
  try {
    const { keyword, sortByName, pageNum, pageSize } = data;
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/category/search",
      params: {
        keyword,
        sortByName,
        pageNum,
        pageSize,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllCategoryChildren = async () => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/category/sub",
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCategory = async (data) => {
  const { parentId, categoryName, description } = data;

  try {
    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/category",
      data: {
        parentId,
        categoryName,
        description,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateCategory = async (data) => {
  const { categoryId, parentId, categoryName, description } = data;
  try {
    const response = await request(axiosPrivate, {
      method: "PUT",

      url: `/category/${categoryId}`,
      data: {
        parentId,
        categoryName,
        description,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/category/${categoryId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/category/${categoryId}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const searchCategoryByName = async (categoryName) => {
  try {
    const response = await request(axiosPrivate, {
      method: "GET",
      url: `/category/name/${categoryName}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
