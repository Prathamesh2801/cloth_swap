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
export async function getCategoriesTypes(typeId = null, categoryId = null) {
  try {
    const params = {};
    if (getShopIdAndUserRole().role === "Super_Admin") {
      params.Shop_ID = getShopIdAndUserRole().shopId;
    }
    if (typeId) {
      params.Type_ID = typeId;
    }
    if (categoryId) {
      params.Category_ID = categoryId;
    }

    const response = await axios.get(`${BASE_URL}/Admin/type.php`, {
      headers: getAuthHeaders(),
      params,
    });

    console.log("Fetched Category Types : ", response.data);
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

    if (getShopIdAndUserRole().role === "Super_Admin") {
      formData.append("Shop_ID", getShopIdAndUserRole().shopId);
    }
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

export async function updateCategoryTypes(updateData) {
  try {
    console.log("Update data received in API :", updateData);
    const formData = new FormData();

    // Always include Category_ID
    formData.append("Type_ID", updateData.Type_ID);

    // Conditionally append fields (only if provided)
    if (updateData.Type_Title) {
      formData.append("Type_Title", updateData.Type_Title);
    }
    if (updateData.Type_Description) {
      formData.append("Type_Description", updateData.Type_Description);
    }

    if (updateData.image) {
      formData.append("image", updateData.image);
    }

    // Add Shop_ID if Super_Admin
    if (getShopIdAndUserRole().role === "Super_Admin") {
      formData.append("Shop_ID", getShopIdAndUserRole().shopId);
    }

    const response = await axios.put(`${BASE_URL}/Admin/type.php`, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Update response FROM API :", response);
    return response.data;
  } catch (error) {
    console.error("Error updating category Types :", error);
    throw error;
  }
}

/**
 * DELETE Category
 * @param {string} categoryId
 */
export async function deleteCategoryTypes(typeId) {
  try {
    const { shopId, role } = getShopIdAndUserRole();

    // build params dynamically
    const params = { Type_ID: typeId };

    if (role === "Super_Admin") {
      if (!shopId) {
        throw new Error(
          "Shop ID is required for Super_Admin to delete category Types"
        );
      }
      params.Shop_ID = shopId;
    }

    const response = await axios.delete(`${BASE_URL}/Admin/type.php`, {
      headers: getAuthHeaders(),
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
