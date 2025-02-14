import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer-management/portal";

export const fetchData = async () => {
  try {
    const response = await axios.get("https://6704b0b2ab8a8f8927347b3d.mockapi.io/api/v1/statictis");
    return response.data;
  } catch (error) {
    //console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchChart = async (path) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.get(`${API_BASE_URL}/${path}`, {
      headers: {
        Authorization: TOKEN
      }
    });
    return response.data.data;
  } catch (error) {
    //console.error("Error fetching events:", error);
    throw error;
  }
};