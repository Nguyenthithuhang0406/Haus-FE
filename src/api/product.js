import { request } from "@/utils/axios/axios-http";
import { axiosPrivate, axiosPublic } from "@/utils/axios/axiosInstance";

export const getAllProducts = async (data) => {
  try {
    const {
      pageNum,
      pageSize,
      sortBy = "asc",
      keyword,
      priceRange,
      color,
      material,
      categoryId,
    } = data;
    const response = await request(axiosPublic, {
      method: "GET",
      url: "/product/filter",
      params: {
        pageNum,
        pageSize,
        sortBy,
        search: [
          keyword && `keyword:${keyword}`,
          categoryId && `categoryId:${categoryId}`,
          priceRange && `priceRange:${priceRange}`,
          color && `color:${color}`,
          material && `material:${material}`,
        ]
          .filter(Boolean)
          .join(","),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createProduct = async (data) => {
  try {
    const {
      productName,
      price,
      material,
      description,
      detailDescription,
      categories,
      images,
    } = data;
    const requestData = {
      productName,
      price,
      material,
      description,
      detailDescription,
      categories,
    };
    const formData = new FormData();
    formData.append("request", JSON.stringify(requestData));
    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await request(axiosPrivate, {
      method: "POST",
      url: "/product",
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateProduct = async (data) => {
  try {
    const {
      id,
      productName,
      price,
      material,
      description,
      detailDescription,
      categories,
      imageIdsToDelete,
      images,
      inventoryQuantity,
    } = data;

    const requestData = {
      productName,
      price,
      material,
      description,
      detailDescription,
      categories,
      imageIdsToDelete,
      inventoryQuantity,
    };
    const formData = new FormData();
    formData.append("request", JSON.stringify(requestData));
    images.forEach((image) => {
      formData.append("images", image);
    });
    const response = await request(axiosPrivate, {
      method: "PUT",
      url: `/product/${id}`,
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/product/${id}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await request(axiosPrivate, {
      method: "DELETE",
      url: `/product/${id}`,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductByCategoryId = async (data) => {
  try {
    const {
      categoryId,
      pageNum,
      pageSize,
      sortBy = "asc",
      keyword,
      priceRange,
      color,
    } = data;
    const response = await request(axiosPublic, {
      method: "GET",
      url: `/product/category-id/${categoryId}`,
      params: {
        categoryId,
        pageNum,
        pageSize,
        sortBy,
        search: [
          keyword && `keyword:${keyword}`,
          priceRange && `priceRange:${priceRange}`,
          color && `color:${color}`,
        ]
          .filter(Boolean)
          .join(","),
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
