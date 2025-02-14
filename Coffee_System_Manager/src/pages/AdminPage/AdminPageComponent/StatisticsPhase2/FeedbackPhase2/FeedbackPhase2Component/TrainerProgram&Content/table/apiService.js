import axios from "axios";

const getAuthToken = () => {
  const token = sessionStorage.getItem("accessToken");
  return token;
};

export const fetchModuleData = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(
      "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/module-names",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    //console.log(error);
  }
};

export const fetchTrainingProgramContentData = async (modules) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(
      "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/statistic/by-module?",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          module: modules.map(encodeURIComponent),
        },
        paramsSerializer: (params) => {
          return params.module.map((mod) => `module=${mod}`).join("&");
        },
      }
    );
    return response.data.data;
  } catch (error) {
    //console.error("Error fetching evaluation by module:",error.response || error.message);
    return { success: false, message: error.message };
  }
};

export const fetchModuleFeedbackData = async (moduleName) => {
  try {
    const token = getAuthToken();
    const module = encodeURI(moduleName);
    const response = await axios.get(
      `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/statistic/by-module-name?module=${module}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    //console.error("Error fetching evaluation by module:", error.response || error.message);
    return { success: false, message: error.message };
  }
};
