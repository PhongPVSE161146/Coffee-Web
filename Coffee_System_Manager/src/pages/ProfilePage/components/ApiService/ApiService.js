import axios from "axios";

const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v2/trainer/get-info-v2";
const API_BASE_URL_UPDATE = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v2/trainer/update-trainer";
const API_BASE_MASTER_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v2/trainer/master-data";
const API_BASE_UPLOAD_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/file/upload-avatar";
const API_CERT_UPLOAD_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/file/upload-avatar";
const API_SAVE_HISTORY_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/CV-history/save-history";
const API_DOWNLOAD_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/file/download";
const API_SAVELINKCV_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/CV-history/save-link-cv"

export const fetchData = async (path) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const response = await axios.get(`${API_BASE_URL}/${path}`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error fetching trainer information:", error);
        throw error;
    }
};

export const masterData = async () => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const response = await axios.get(`${API_BASE_MASTER_URL}`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error fetching trainer information:", error);
        throw error;
    }
};

export const updateData = async (data, path) => {
    const token = sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("selectedRole");
    const TOKEN = `Bearer ${token}`;
    if (role === "admin" || role === "deliverymanager") {
        path = window.location.pathname.includes('/trainerManagement/')
            ? sessionStorage.getItem("accounttrainer")
            : sessionStorage.getItem("username");
    } else {
        path = sessionStorage.getItem("username");
    }

    // Use provided path if available, otherwise use determined path
    try {
        const response = await axios.put(`${API_BASE_URL_UPDATE}/${path}`, data, {
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error updating records:", error);
        if (error.response) {
            //console.log('Error response:', error.response.data);
        }
        throw error;
    }
};

export const uploadAvatar = async (file) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(API_BASE_UPLOAD_URL, formData, {
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Trả về toàn bộ response data để component có thể kiểm tra success và lấy URL
        return response.data;
    } catch (error) {
        //console.error("Error uploading avatar:", error);
        if (error.response) {
            //console.log('Error response:', error.response.data);
        }
        throw error;
    }
};

export const uploadCertificate = async (file) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(API_CERT_UPLOAD_URL, formData, {
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'multipart/form-data'
            }
        });

        // Trả về toàn bộ response data để component có thể kiểm tra success và lấy URL
        return response.data;
    } catch (error) {
        //console.error("Error uploading certificate:", error);
        if (error.response) {
            //console.log('Error response:', error.response.data);
        }
        throw error;
    }
};

export const saveHistory = async (data) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const response = await axios.post(API_SAVE_HISTORY_URL, data, {
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        //console.error("Error saving history:", error);
        if (error.response) {
            //console.log('Error response:', error.response.data);
        }
        throw error;
    }
};

export const downloadData = async (fileUrl) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        // Thêm s3Url làm query parameter
        const response = await axios.get(`${API_DOWNLOAD_URL}?s3Url=${encodeURIComponent(fileUrl)}`, {
            headers: {
                Authorization: TOKEN
            },
            responseType: 'blob' // Quan trọng: set responseType là 'blob' để nhận file
        });

        // Tạo URL từ blob và tải file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        // Lấy tên file từ URL gốc
        const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        link.setAttribute('download', fileName);

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        return response.data;
    } catch (error) {
        //console.error("Error downloading file:", error);
        throw error;
    }
};

export const SaveLinkCV = async (dataToUpdate) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;


    try {
        const response = await axios.post(API_SAVELINKCV_URL, dataToUpdate, {
            headers: {
                Authorization: TOKEN,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error saving CV link:", error);
        if (error.response) {
            //console.log('Error response:', error.response.data);
        }
        throw error;
    }
};