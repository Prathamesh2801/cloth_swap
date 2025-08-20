import axios from "axios";
import { BASE_URL } from "../../../config";

// ✅ Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem("token"); // make sure you store token in localStorage after login
  return {
    Authorization: `Bearer ${token}`,
  };
};

/**
 * 🔹 GET Users (with optional filters)
 * @param {Object} filters { Role, Shop_ID }
 */
export const getUsers = async (filters = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/superAdmin/user.php`, {
      headers: getHeaders(),
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * 🔹 CREATE User
 * @param {Object} userData { Username, Password, Role, Shop_ID (if Admin/Device) }
 */
export const createUser = async (userData) => {
  try {
    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axios.post(
      `${BASE_URL}/superAdmin/user.php`,
      formData,
      { headers: getHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * 🔹 UPDATE User
 * @param {Object} updateData { Username, Password?, Role?, Shop_ID? }
 */
export const updateUser = async (updateData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/superAdmin/user.php`,
      updateData,
      { headers: { ...getHeaders(), "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/**
 * 🔹 DELETE User
 * @param {string} username
 */
export const deleteUser = async (username) => {
  try {
    const response = await axios.delete(`${BASE_URL}/superAdmin/user.php`, {
      headers: getHeaders(),
      params: { Username: username },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// For Fuzzy Search
export const getShops = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/superAdmin/user.php`, {
      headers: getHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};
