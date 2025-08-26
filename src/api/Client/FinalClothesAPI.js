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

function getShopIdAndUserRole() {
  const shopId = localStorage.getItem("shopId");
  const role = localStorage.getItem("role");


  if (!role) {
    throw new Error("User role not found in localStorage");
  }
  return { shopId, role };
}

/**
 * GET Categories
 * @param {string} role - User role (Super_Admin / other)
 * @param {string} [shopId] - Shop ID (required if role === "Super_Admin")
 */
export async function getFinalClothes(typeId = null, clothId = null) {
  try {
    const params = {};
    if (getShopIdAndUserRole().role === "Super_Admin") {
      params.Shop_ID = getShopIdAndUserRole().shopId;
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
    if (getShopIdAndUserRole().role === "Super_Admin") {
      formData.append("Shop_ID", getShopIdAndUserRole().shopId);
    }
    formData.append("Type_ID", clothData.Type_ID);
    formData.append("Cloth_Title", clothData.Cloth_Title);
    formData.append("Cloth_Size", clothData.Cloth_Size || "XS");
    formData.append("Cloth_Description", clothData.Cloth_Description || ""); // Optional field
    formData.append("Swap_Type", clothData.Cloth_Swap_Type || "FULL");
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
    const { shopId, role } = getShopIdAndUserRole();

    // build params dynamically
    const params = { Cloth_ID: clothId };

    if (role === "Super_Admin") {
      if (!shopId) {
        throw new Error(
          "Shop ID is required for Super_Admin to delete final clothes"
        );
      }
      params.Shop_ID = shopId;
    }

    const response = await axios.delete(`${BASE_URL}/Admin/cloths.php`, {
      headers: getAuthHeaders(),
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting Final Clothes :", error);
    throw error;
  }
}
