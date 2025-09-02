import axios from "axios";
import { BASE_URL } from "../../../config";

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

export async function fetchClothByCategory(gender) {
  try {
    const { shopId, role } = getShopIdAndUserRole();

    // base params
    const params = { Gender: gender };

    // add Shop_ID if role is Super_Admin
    if (role === "Super_Admin" && shopId) {
      params.Shop_ID = shopId;
    }

    const response = await axios.get(`${BASE_URL}/admin/category.php`, {
      headers: getAuthHeaders(),
      params,
    });

    console.log("Cloth Category : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes " + error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
}
export async function fetchClothByCategoryTypes(categoryID) {
  try {
    const { shopId, role } = getShopIdAndUserRole();

    const params = { Category_ID: categoryID };

    if (role === "Super_Admin" && shopId) {
      params.Shop_ID = shopId;
    }

    const response = await axios.get(`${BASE_URL}/admin/type.php`, {
      headers: getAuthHeaders(),
      params,
    });

    console.log("Cloth Types : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes Types " + error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
}

export async function fetchAllFinalClothes(typeID) {
  try {
    const { shopId, role } = getShopIdAndUserRole();

    const params = { Type_ID: typeID };

    if (role === "Super_Admin" && shopId) {
      params.Shop_ID = shopId;
    }

    const response = await axios.get(`${BASE_URL}/admin/cloths.php`, {
      headers: getAuthHeaders(),
      params,
    });

    console.log("Final Clothes : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching final clothes " + error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
}
