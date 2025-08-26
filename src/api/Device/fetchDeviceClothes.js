import axios from "axios";
import { BASE_URL } from "../../../config";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchClothByCategory(gender) {
  try {
    const response = await axios.get(`${BASE_URL}/Admin/category.php`, {
      headers: getAuthHeaders(),
      params: {
        Gender: gender,
      },
    });

    console.log("Cloth Category : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes " + error);
    if (error.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
}

export async function fetchClothByCategoryTypes(categoryID) {
  try {
    const response = await axios.get(`${BASE_URL}/Admin/type.php`, {
      headers: getAuthHeaders(),
      params: {
        Category_ID: categoryID,
      },
    });

    console.log("Cloth Types : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes Types " + error);
    if (error.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
}
export async function fetchAllFinalClothes(typeID) {
  try {
    const response = await axios.get(`${BASE_URL}/Admin/cloths.php`, {
      headers: getAuthHeaders(),
      params: {
        Type_ID: typeID,
      },
    });

    console.log("Cloth Types : ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching clothes Types " + error);
    if (error.status === 401) {
      localStorage.clear();
      window.location.href = "/#/login";
    }
    throw error;
  }
}
