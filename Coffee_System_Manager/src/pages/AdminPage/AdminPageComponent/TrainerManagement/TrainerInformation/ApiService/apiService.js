import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/get-info";
const API_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/update-trainer";

export const fetchData = async (path) => {
  try {
      const response = await axios.get(`${API_BASE_URL}/${path}`, {
          headers: {
              Authorization: TOKEN,
          }
      });
      return response.data;
  } catch (error) {
      //console.error("Error fetching events:", error);
      throw error;
  }
};

export const updateData = async (path, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${path}`, updatedData, {
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

export const fetchData1 = async () => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.get(`http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/skills`, {
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
