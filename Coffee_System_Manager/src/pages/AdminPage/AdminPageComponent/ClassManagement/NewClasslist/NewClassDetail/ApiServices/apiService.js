import axios from "axios";

// Move token retrieval into the functions to ensure we always have the latest token
const getToken = () => {
  const token = sessionStorage.getItem("accessToken");
  return `Bearer ${token}`;
};

const API_BASE_URL1 = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/classes/class-detail`;
const API_BASE_URL2 = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/getAllModulesByClass`;
const EXPORT_API_URL = `http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/export-schedule-tracker-report`;

export const fetchData = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL1}/${id}`, {
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

export const fetchModulesByClassId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL2}?classId=${id}`, {
      headers: {
        Authorization: getToken()
      }
    });
    return response.data;
  } catch (error) {
    //console.error("Error fetching modules by class ID:", error);
    throw error;
  }
};

export const exportScheduleTrackerReport = async (moduleIds) => {
  try {
    const response = await axios.post(
      EXPORT_API_URL,
      { id: moduleIds },
      {
        headers: {
          Authorization: getToken(),
          "Content-Type": "application/json"
        },
        responseType: 'blob' // Important for file downloads
      }
    );

    // Handle the file download
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
      : 'schedule-tracker-report.xlsx';
    
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    return { success: true };
  } catch (error) {
    //console.error("Error exporting schedule tracker report:", error.response ? error.response.data : error);
    throw error;
  }
};