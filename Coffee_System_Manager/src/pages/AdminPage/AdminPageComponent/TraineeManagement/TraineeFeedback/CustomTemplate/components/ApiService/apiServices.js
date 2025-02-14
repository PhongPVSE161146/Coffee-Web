import axios from "axios";

// Move token retrieval into the functions to ensure we always have the latest token
const getToken = () => {
  const token = sessionStorage.getItem("accessToken");
  return `Bearer ${token}`;
};

const API_BASE_URL1 = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-templates/cloned`;

export const fetchData = async () => {
    const user = sessionStorage.getItem("username");
  try {
    const response = await axios.get(`${API_BASE_URL1}?account=${user}`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error fetching module details:", error);
    throw error;
  }
};