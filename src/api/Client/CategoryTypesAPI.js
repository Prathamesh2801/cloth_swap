// src/api/CategoryAPI.js
import axios from "axios";
import { BASE_URL } from "../../../config";

// 🔑 Get Token from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * GET Categories
 * @param {string} role - User role (Super_Admin / other)
 * @param {string} [shopId] - Shop ID (required if role === "Super_Admin")
 */
export async function getCategoriesTypes(
  role,
  shopId = null,
  typeId = null,
  categoryId = null
) {
  try {
    const params = {};
    if (role === "Super_Admin" && shopId) {
      params.Shop_ID = shopId;
    }
    params.Type_ID = typeId;
    params.Category_ID = categoryId;

    const response = await axios.get(`${BASE_URL}/Admin/type.php`, {
      headers: getAuthHeaders(),
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories Types :", error);
    throw error;
  }
}

/**
 * CREATE Category
 * @param {Object} categoryData - { Category_Title, Gender, image(file) }
 */
export async function createCategoryTypes(typeData) {
  try {
    const formData = new FormData();
    formData.append("Category_ID", typeData.Category_ID);
    formData.append("Type_Title", typeData.Type_Title);
    formData.append("Type_Description", typeData.Type_Description || ""); // Optional field
    if (typeData.image) {
      formData.append("image", typeData.image);
    }

    const response = await axios.post(`${BASE_URL}/Admin/type.php`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Create Category Types Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating category Types :", error);
    throw error;
  }
}

/**
 * UPDATE Category (Without Image)
 * @param {Object} updateData - Example: { Category_ID, Category_Title, Gender }
 */
export async function updateCategoryTypes(updateData) {
  try {
    const response = await axios.put(`${BASE_URL}/Admin/type.php`, updateData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating category Types :", error);
    throw error;
  }
}

/**
 * UPDATE Category (With Image)
 * @param {Object} updateData - { Category_ID, image(file) }
 */
export async function updateCategoryTypesWithImage(updateData) {
  try {
    const formData = new FormData();
    formData.append("Type_ID", updateData.Type_ID);
    if (updateData.image) {
      formData.append("image", updateData.image);
    }

    const response = await axios.put(`${BASE_URL}/Admin/type.php`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating category with image:", error);
    throw error;
  }
}

/**
 * DELETE Category
 * @param {string} categoryId
 */
export async function deleteCategoryTypes(typeId) {
  try {
    const response = await axios.delete(`${BASE_URL}/Admin/type.php`, {
      headers: getAuthHeaders(),
      params: { Type_ID: typeId },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
