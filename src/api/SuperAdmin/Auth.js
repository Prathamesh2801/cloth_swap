import axios from "axios";
import { BASE_URL } from "../../../config";

export async function login(username, password) {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    const response = await axios.post(`${BASE_URL}/log.php`, formData);
    console.log("Login response:", response.data);
    if (response.data.Status === true) {
      localStorage.setItem("token", response.data.Token);
      localStorage.setItem("role", response.data.Role);
      return response.data;
    } else {
      throw new Error(
        response.data.Message || "Login failed  . Please try again."
      );
    }
  } catch (error) {
    console.error("Login failed:", error);
    throw new Error(error?.message || "Login failed  . Please try again.");
  }
}
