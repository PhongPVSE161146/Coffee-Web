import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`;
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/";


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

export const fetchData2 = async () => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.get(`${API_BASE_URL}jobs
`, {
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

export const postData = async (updatedData) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.post(`${API_BASE_URL}skills`, updatedData, {
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

export const postData2 = async (updatedData) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.post(`${API_BASE_URL}jobs`, updatedData, {
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

export const putData = async (updatedData,id) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.put(`${API_BASE_URL}skills/${id}`, updatedData, {
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

export const putData2 = async (updatedData,id) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.put(`${API_BASE_URL}jobs/${id}`, updatedData, {
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
export const delData = async (id) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.delete(`${API_BASE_URL}skills/${id}`, {
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

export const delData2 = async (id) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.delete(`${API_BASE_URL}jobs/${id}`, {
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

export const actData = async (id) => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.put(`${API_BASE_URL}skills/active-skill/${id}`,id, {
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

