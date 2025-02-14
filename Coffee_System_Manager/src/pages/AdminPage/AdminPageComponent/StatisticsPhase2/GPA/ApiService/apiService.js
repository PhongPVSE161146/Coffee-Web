import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer-management/portal";
const API_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer-management/portal"

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

export const fetchData = async () => {
  const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
  try {
    const response = await axios.get(`${API_URL}`, {
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