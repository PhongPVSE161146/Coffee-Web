import axios from "axios";

const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1/trainer/confirm-class/class-info";


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
        //console.error("Error fetching events:", error);
        throw error;
    }
};

