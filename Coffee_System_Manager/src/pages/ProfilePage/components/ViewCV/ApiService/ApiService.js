import axios from "axios";

const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/CV-history";

export const fetchHistoryData = async () => {
    const token = sessionStorage.getItem("accessToken");
    const name = sessionStorage.getItem("username");
    
    if (!token || !name) {
        throw new Error("Authentication information missing");
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/${name}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "*/*"
            }
        });
        return response;
    } catch (error) {
        //console.error("Error fetching CV history:", error);
        throw error;
    }
};