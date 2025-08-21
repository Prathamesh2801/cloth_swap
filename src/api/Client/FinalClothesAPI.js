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
export async function getFinalClothes(
  role,
  shopId = null,
  typeId = null,
  clothId = null
) {
  try {
    const params = {};
    if (role === "Super_Admin" && shopId) {
      params.Shop_ID = shopId;
    }
    params.Type_ID = typeId;
    params.Cloth_ID = clothId;

    const response = await axios.get(`${BASE_URL}/Admin/cloths.php`, {
      headers: getAuthHeaders(),
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching final Clothes :", error);
    throw error;
  }
}

/**
 * CREATE Category
 * @param {Object} categoryData - { Category_Title, Gender, image(file) }
 */
export async function createFinalClothes(clothData) {
  try {
    const formData = new FormData();
    formData.append("Type_ID", clothData.Type_ID);
    formData.append("Cloth_Title", clothData.Cloth_Title);
    formData.append("Cloth_Description", clothData.Cloth_Description || ""); // Optional field
    if (clothData.image) {
      formData.append("image", clothData.image);
    }

    const response = await axios.post(
      `${BASE_URL}/Admin/cloths.php`,
      formData,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Create Category Types Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating Final Clothes :", error);
    throw error;
  }
}

/**
 * DELETE Category
 * @param {string} categoryId
 */
export async function deleteFinalClothes(clothId) {
  try {
    const response = await axios.delete(`${BASE_URL}/Admin/cloths.php`, {
      headers: getAuthHeaders(),
      params: { Cloth_ID: clothId },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting Final Clothes :", error);
    throw error;
  }
}
