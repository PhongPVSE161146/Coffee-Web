import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`;
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/statistic/module-statistic";


export const fetchData = async () => {
  const token = sessionStorage.getItem("accessToken");

  const TOKEN = `Bearer ${token}`;
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
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

