import axios from "axios";
const token = sessionStorage.getItem("accessToken");

const TOKEN = `Bearer ${token}`;
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/config-effort/get-all";
const API_BASE_URL_UPDATE = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v3/config-effort/edit";


export const fetchData = async () => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const response = await axios.get(API_BASE_URL, {
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

export const updateData = async (updatedRecords) => {
    const token = sessionStorage.getItem("accessToken");
    const TOKEN = `Bearer ${token}`;

    try {
        const response = await axios.put(API_BASE_URL_UPDATE, updatedRecords, {
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