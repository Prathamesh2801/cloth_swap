import axios from "axios";
import { BASE_URL } from "../../config";

export async function fetchAllClothes() {
  try {
    const response = await axios.get(`${BASE_URL}/cloth.php`);
    // console.log("Fetched clothes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes:", error);
    throw error;
  }
}

export async function fetchCategoryClothes(category) {
  try {
    const response = await axios.get(`${BASE_URL}/cloth.php`, {
      params: {
        category: category,
      },
    });
    // console.log("Fetched clothes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes:", error);
    throw error;
  }
}

export async function fetchTypeClothes(category, type) {
  try {
    const response = await axios.get(`${BASE_URL}/cloth.php`, {
      params: {
        type: type,
        category: category,
      },
    });
    // console.log("Fetched clothes:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes:", error);
    throw error;
  }
}
