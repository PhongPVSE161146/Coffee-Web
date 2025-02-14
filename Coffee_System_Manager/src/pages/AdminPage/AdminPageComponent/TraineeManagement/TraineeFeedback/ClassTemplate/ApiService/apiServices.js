import axios from "axios";

// Move token retrieval into the functions to ensure we always have the latest token
const getToken = () => {
  const token = sessionStorage.getItem("accessToken");
  return `Bearer ${token}`;
};



const API_BASE_URL1 = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-templates`;
const API_BASE_URL2 = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-templates/feedback/sendBy/allCA`;
const API_BASE_URL_CLONE = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/clone-feedback-template`;
const API_BASE_URL_DELETE = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-templates`;
const API_BASE_URL_CLASS = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-templates/className`;
const API_BASE_URL_SEND = 'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-template/send-feedback-template';
const API_BASE_URL_INFO = 'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/feedback-template';

export const fetchData = async (id) => {
  try {
    const response = await axios.get(API_BASE_URL1, {
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

export const fetchData2 = async () => {
  try {
    const response = await axios.get(API_BASE_URL2, {
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

export const cloneFeedback = async (templateId) => {

  try {
    const response = await axios.post(`${API_BASE_URL_CLONE}/${templateId}`, null, {
      headers: {
        Authorization: getToken(),
        accept: "*/*"
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error clone feedback:", error);
    throw error;
  }
};

export const deleteFeedback = async (templateId) => {
  const token = getToken();
  try {
    const response = await axios.delete(`${API_BASE_URL_DELETE}/${templateId}`, {
      headers: {
        Authorization: token,
        accept: '*/*'
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error delete feedback:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchAllFeedbackClassname = async () => {
  const token = getToken();
  try {
    const response = await axios.get(API_BASE_URL_CLASS, {
      headers: {
        Authorization: token,
        accept: "*/*"
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error clone feedback:", error);
    throw error;
  }
};

export const sendFeedback = async (payload) => {
  const token = getToken();
  try {
    const response = await axios.post(API_BASE_URL_SEND, payload, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json', 
        accept: "*/*"
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error sending feedback:", error);
    throw error;
  }
};

export const fetchFeedbackInfo = async (templateId) => {
  try {
    const response = await axios.get(`${API_BASE_URL_INFO}/${templateId}`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error fetching details:", error);
    throw error;
  }
};