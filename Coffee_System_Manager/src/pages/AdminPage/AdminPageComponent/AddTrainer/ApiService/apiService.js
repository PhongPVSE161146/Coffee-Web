import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`;
const API_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/add-trainer";
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/";

export const postData = async (updatedData) => {
  try {
    const response = await axios.post(`${API_URL}`, updatedData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: TOKEN
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error updating data:", error);
    throw error;
  }
};

export const fetchData = async () => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.get(`${API_BASE_URL}skills`, {
      headers: {
        Authorization: TOKEN
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error fetching events:", error);
    throw error;
  }
};