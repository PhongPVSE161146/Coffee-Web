import axios from "axios";

const getAuthToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const fetchModuleData = async () => {
  const token = getAuthToken();
  try {
    if (!token) {
      //console.error("No access token found");
      return { success: false, message: "No access token available." };
    }

    const response = await axios.get(
      "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/module-data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data?.data || [];
  } catch (error) {
    //console.error("Error fetching module data:", error);
    return { success: false, message: error.message };
  }
};

export const fetchEvaluateData = async (module, trainerAccount) => {
  const token = getAuthToken();
  try {
    const trainerAccountString = Array.isArray(trainerAccount)
      ? trainerAccount.join(",")
      : trainerAccount;
    const encodedModule = encodeURIComponent(module);
    const encodedTrainerAccount = encodeURIComponent(trainerAccountString);

    const url = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/statistic/evaluate-by-module?module=${encodedModule}&trainerAccount=${encodedTrainerAccount}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    //console.log("Response data in fetchEvaluateData:", response.data);

    return response.data && response.data.data ? response.data.data : [];
  } catch (error) {
    //console.log(error);
    return [];
  }
};

export const fetchTrainerData = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(
      "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/trainer-data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response?.data || { success: false, message: "No data received" };
  } catch (error) {
    //console.error("Error fetching trainer data:", error);
    return { success: false, message: error.message };
  }
};

export const fetchStatisticsTrainer = async (trainerAccount, classCode) => {
  const token = getAuthToken();
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: "No access token available." };
    }

    const classCodeString = Array.isArray(classCode)
      ? classCode.join(",")
      : classCode;
    const encodedtrainerAccount = encodeURIComponent(trainerAccount);
    const encodedclassCode = encodeURIComponent(classCodeString);

    const url = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/statistic/module-by-trainer?trainerAccount=${encodedtrainerAccount}&classCode=${encodedclassCode}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    //console.log("Response data in fetchEvaluateData:", response.data);

    return response?.data?.data || [];
  } catch (error) {
    //console.error("Error fetching statistics:", error);
    return { success: false, message: error.message };
  }
};
