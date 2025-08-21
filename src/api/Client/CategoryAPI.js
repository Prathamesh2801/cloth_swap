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
export async function getCategories(role, shopId = null) {
  try {
    const params = {};
    if (role === "Super_Admin" && shopId) {
      params.Shop_ID = shopId;
    }

    const response = await axios.get(`${BASE_URL}/Admin/category.php`, {
      headers: getAuthHeaders(),
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * CREATE Category
 * @param {Object} categoryData - { Category_Title, Gender, image(file) }
 */
export async function createCategory(categoryData) {
  try {
    const formData = new FormData();
    formData.append("Category_Title", categoryData.Category_Title);
    formData.append("Gender", categoryData.Gender);
    if (categoryData.image) {
      formData.append("image", categoryData.image);
    }

    const response = await axios.post(
      `${BASE_URL}/Admin/category.php`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

/**
 * UPDATE Category (Without Image)
 * @param {Object} updateData - Example: { Category_ID, Category_Title, Gender }
 */
export async function updateCategory(updateData) {
  try {
    const response = await axios.put(
      `${BASE_URL}/Admin/category.php`,
      updateData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

/**
 * UPDATE Category (With Image)
 * @param {Object} updateData - { Category_ID, image(file) }
 */
export async function updateCategoryWithImage(updateData) {
  try {
    const formData = new FormData();
    formData.append("Category_ID", updateData.Category_ID);
    if (updateData.image) {
      formData.append("image", updateData.image);
    }

    const response = await axios.put(
      `${BASE_URL}/Admin/category.php`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );

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
export async function deleteCategory(categoryId) {
  try {
    const response = await axios.delete(`${BASE_URL}/Admin/category.php`, {
      headers: getAuthHeaders(),
      params: { Category_ID: categoryId },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
