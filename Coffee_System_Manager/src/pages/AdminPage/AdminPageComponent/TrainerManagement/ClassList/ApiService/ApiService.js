import axios from "axios";
const token = sessionStorage.getItem("accessToken");
const getToken = () => {
    const token = sessionStorage.getItem("accessToken");
    return `Bearer ${token}`;
  };

const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1";
const API_BASE_URL2 = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3";

export const fetchClassLists = async (path) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/trainer/get-info/${path}`, {
            headers: {
                Authorization: getToken()
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching classlist:", error);
        throw error;
    }
};

export const fetchModuleDetails = async (module) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/trainer/module/get-info/${module}`, {
            headers: {
                Authorization: getToken()
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching module details:", error);
        throw error;
    }
};

export const fetchFeedbackStatistic = async (templateId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${templateId}/feedback/statistics`, {
            headers: {
                Authorization: getToken(),
                accept: '*/*'
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error fetching module details:", error);
        throw error;
    }
};

export const fetchFeedbackDetail = async (templateId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${templateId}/feedback/details`, {
            headers: {
                Authorization: getToken(),
                accept: '*/*'
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching module details:", error);
        throw error;
    }
};

export const fetchFeedbackInfo = async (templateId, classId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/feedback-templates/feedback/feedback-information?feedbackTemplateId=${templateId}&classId=${classId}`, {
            headers: {
                Authorization: getToken(),
                accept: '*/*'
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error fetching module details:", error);
        throw error;
    }
};

export const exportFeedbackData = async (templateId, classId) => {
    try {
        const response = await axios.get(`${API_BASE_URL2}/feedback-template/export-data?classId=${classId}&feedbackTemplateId=${templateId}`, {
            headers: {
                Authorization: getToken(),
                accept: '*/*'
            },
            responseType: 'blob'
        });
        const blob = new Blob([response.data], {
            type: response.headers['content-type']
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Get filename from response headers or use default
        const contentDisposition = response.headers['content-disposition'];
        const fileName = contentDisposition
            ? contentDisposition.split('filename=')[1].replace(/"/g, '')
            : 'feedback-report.xlsx';

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);

        return { success: true };
    } catch (error) {
        //console.error("Error fetching module details:", error);
        throw error;
    }
};



