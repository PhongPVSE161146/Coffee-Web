import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/get-info";
const API_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/unit-price/update";
const API_URL_1 = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/unit-price/delete-multi";

export const fetchData = async (path) => {
  const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
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

export const updateData = async (updatedData) => {
  const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
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

export const deleteData = async (deleteData) => {
  const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`; 
  try {
    const response = await axios.post(`${API_URL_1}`, deleteData, {
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
