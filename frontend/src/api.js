import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // baca dari .env

export const uploadFile = async (file, userId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data; // error dari server
    } else {
      return { error: "Gagal terhubung ke server" };
    }
  }
};
