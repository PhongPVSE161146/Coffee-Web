import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`;
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/confirm-module/get-list-class";
const API_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/confirm-modules";


export const fetchData = async (path) => {
  const token = sessionStorage.getItem("accessToken");
  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.get(`${API_BASE_URL}/${path}`, {
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

export const postData = async (data) => {
  const token = sessionStorage.getItem("accessToken");
  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.put(`${API_URL}`, data, {
      headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error updating data:", error);
    throw error;
  }
};
