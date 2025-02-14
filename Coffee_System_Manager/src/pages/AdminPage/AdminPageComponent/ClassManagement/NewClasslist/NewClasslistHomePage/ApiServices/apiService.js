import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`;
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/classes/class-list";


export const fetchData = async () => {
  const token = sessionStorage.getItem("accessToken");
  const TOKEN = `Bearer ${token}`;

  try {
    const response = await axios.get(API_BASE_URL, {
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


export const fetchStatusOptions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status-options`);
    return response.data;  // Assuming response contains an array of statuses
  } catch (error) {
    //console.error('Error fetching status options:', error);
    throw error;
  }
};