import axios from "axios";

const getAuthToken = () => {
  const token = sessionStorage.getItem("accessToken");
  return token;
};

export const fetchTechnicalNameData = async () => {
  const token = getAuthToken();
  try {
    const response = await axios.get(
      "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/technical-names",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const fetchTechnicalGroupData = async (classCode) => {
  try {
    const token = await getAuthToken();
    const response = await axios.get(
      `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/statistic/by-technical-group`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          classCode: classCode,
        },
      }
    );
    return response.data;
  } catch (error) {
    //console.log(error);
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
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};

export const fetchModuleByTrainerData = async (trainerAccount, classCode) => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(
      "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/modules/feedbacks/statistic/module-by-trainer",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          trainerAccount: trainerAccount,
          classCode: classCode,
        },
      }
    );
    return response.data;
  } catch (error) {
    //console.log(error);
  }
};
