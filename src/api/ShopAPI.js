import axios from "axios";
import { BASE_URL } from "../../config";

const SHOP_URL = BASE_URL + "/superAdmin/manageShop.php";

// Get Bearer token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

// Common headers
const getHeaders = (contentType = "application/json") => {
  const token = getAuthToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  return headers;
};

// GET - Fetch all shops with optional filters
export const fetchShops = async (filters = {}) => {
  try {
    const response = await axios.get(SHOP_URL, {
      headers: getHeaders(),
      params: {
        Shop_ID: filters.Shop_ID,
        City: filters.City,
        State: filters.State,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};

// POST - Add new shop
export const addShop = async (shopData) => {
  try {
    const formData = new FormData();

    Object.keys(shopData).forEach((key) => {
      if (shopData[key] !== null && shopData[key] !== undefined) {
        formData.append(key, shopData[key]);
      }
    });

    const response = await axios.post(SHOP_URL, formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // No Content-Type header; axios sets it correctly for FormData
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error adding shop:", error);
    throw error;
  }
};

// PUT - Update shop
export const updateShop = async (shopData) => {
  try {
    const response = await axios.put(SHOP_URL, shopData, {
      headers: getHeaders("application/json"),
    });

    return response.data;
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
};

// DELETE - Delete shop
export const deleteShop = async (shopId) => {
  try {
    const response = await axios.delete(SHOP_URL, {
      headers: getHeaders(),
      params: { Shop_ID: shopId },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting shop:", error);
    throw error;
  }
};

// Utility function to get form fields from API response
export const getFormFields = (apiResponse) => {
  if (apiResponse?.Data?.shops && apiResponse.Data.shops.length > 0) {
    const sampleShop = apiResponse.Data.shops[0];
    return Object.keys(sampleShop).filter(
      (key) => !["Shop_ID", "Created_AT", "Updated_AT"].includes(key)
    );
  }

  return [
    "Shop_Name",
    "Address_1",
    "Address_2",
    "City",
    "State",
    "Pincode",
    "Status",
  ];
};
