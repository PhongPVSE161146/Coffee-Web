import axios from "axios";
const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1";

export const fetchEvents = async (path) => {
    const token = sessionStorage.getItem("accessToken");

    const TOKEN = `Bearer ${token}`; 
    try {
        const response = await axios.get(`${API_BASE_URL}/trainer/schedule/${path}`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching events:", error);
        throw error;
    }
};

export const fetchEventDetails = async (section) => {
    const token = sessionStorage.getItem("accessToken");

    const TOKEN = `Bearer ${token}`; 
    try {
        const response = await axios.get(`${API_BASE_URL}/trainer-management/schedule-detail/${section}`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching event details:", error);
        throw error;
    }
};

export const EventService = {
    createEvent: async (eventData) => {
        const token = sessionStorage.getItem("accessToken");

        const TOKEN = `Bearer ${token}`; 
        try {
            const response = await axios.post(`${API_BASE_URL}/trainer-management/schedule/freetime`, eventData, {
                headers: {
                    Authorization: TOKEN
                }
            });
            return response.data; 
        } catch (error) {
            //console.error("Error creating event:", error);
        }
    }
};

export const fetchFreeEvents = async (path) => {
    const token = sessionStorage.getItem("accessToken");

    const TOKEN = `Bearer ${token}`; 
    try {
        const response = await axios.get(`${API_BASE_URL}/trainer/free-time?trainerAccount=${path}`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching events:", error);
        throw error;
    }
};

export const fetchDMEvents = async () => {
    const token = sessionStorage.getItem("accessToken");

    const TOKEN = `Bearer ${token}`; 
    try {
        const response = await axios.get(`${API_BASE_URL}/feedback-template/schedule-list?startTime=1900-01-01T00%3A00%3A00&endTime=3000-01-01T23%3A59%3A59`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching events:", error);
        throw error;
    }
};

export const fetchDMEventDetails = async (section) => {
    const token = sessionStorage.getItem("accessToken");

    const TOKEN = `Bearer ${token}`; 
    try {
        const response = await axios.get(`${API_BASE_URL}/feedback-template/schedule-detail?sendTime=${section}`, {
            headers: {
                Authorization: TOKEN
            }
        });
        return response.data.data;
    } catch (error) {
        //console.error("Error fetching event details:", error);
        throw error;
    }
};