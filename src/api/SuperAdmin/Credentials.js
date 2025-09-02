import axios from "axios";
import { BASE_URL } from "../../../config";

const USER_URL = BASE_URL + "/superAdmin/user.php";

// 🔹 Get Bearer token
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

// 🔹 Common headers
const getHeaders = (contentType = "application/json") => {
  const token = getAuthToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  console.log("Headers:", headers);
  return headers;
};

/**
 * 🔹 GET Users (with optional filters)
 * @param {Object} filters { Role, Shop_ID }
 */
export const getUsers = async (filters = {}) => {
  try {
    const response = await axios.get(USER_URL, {
      headers: getHeaders(),
      params: filters,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
};

/**
 * 🔹 CREATE User
 * @param {Object} userData { Username, Password, Role, Shop_ID? }
 */
export const createUser = async (userData) => {
  try {
    const formData = new FormData();

    Object.keys(userData).forEach((key) => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });

    console.log("User data", userData);
    console.log("User Form Data", formData);

    const response = await axios.post(USER_URL, formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        // ❌ No Content-Type → axios will set multipart/form-data automatically
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
};

/**
 * 🔹 UPDATE User
 * @param {Object} updateData { Username, Password?, Role?, Shop_ID? }
 */
export const updateUser = async (updateData) => {
  try {
    const response = await axios.put(USER_URL, updateData, {
      headers: getHeaders("application/json"),
    });

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
};

/**
 * 🔹 DELETE User
 * @param {string} username
 */
export const deleteUser = async (username) => {
  try {
    const response = await axios.delete(USER_URL, {
      headers: getHeaders(),
      params: { Username: username },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
};

// For Fuzzy Search
export const getShops = async () => {
  try {
    const response = await axios.get(USER_URL, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    if (error?.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
};
