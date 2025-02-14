import axios from "axios";

const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1";

export const sendOTP = async (email) => {
    const token = "eyJraWQiOiI1MWE4NWQyNi00NGY4LTQ4NTMtOTg4Mi1mY2NiZmQwOGJjZDgiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJQaHVvbmdEUF90ZXN0IiwiZXhwIjoxNzMyMjYwOTQzLCJkZXBhcnRtZW50IjoiRlNBLkhOIiwiaWF0IjoxNzMyMDg4MTQzLCJhdXRob3JpdGllcyI6IlJPTEVfVFJBSU5FUixST0xFX0ZBTVNfQURNSU4iLCJlbWFpbCI6IlBodW9uZ0RQX3Rlc3RAZnB0LmNvbSJ9.oTiSi6iBJM6Va7zf2hJ19knmp3Oy1TDW8JDWFDx6YCrM428AlNOubEEPtQDXqHoBxY37oHFW21AZiWZHD5XIegHx9yE7f4Wd_UNH6UJFh5LenTqpAj6EK8dwpt0SNVONRs24ynhBLb6nQlqtLb9DWbwvpi3VpHEnmu6KoMYyA8KAbkWpkyywPrmdG6oklE_UmoiFzWGC-m20aczO5D1F0_5KZeEO2qWTXZO3ZQxUewJumLsswsC3hoU3a3-ba2G4f97hASfwOcYZ-bIQeTEL9jTPAtqSjNZkqAoSC8r5225yjygOd1Qq0Vu6AiqG8UPda0F5910BKzGz4ZvlRkCW8g";
    
    if (!token) {
        throw new Error("Authentication token missing");
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/otp/send`, null, {
            params: { email },
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "*/*"
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error sending OTP:", error);
        throw error;
    }
};

export const verifyOTP = async (email, otp) => {
    const token = sessionStorage.getItem("accessToken");
    
    if (!token) {
        throw new Error("Authentication token missing");
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/otp/verify`, null, {
            params: { email, otp },
            headers: {
                Authorization: `Bearer ${token}`,
                accept: "*/*"
            }
        });
        return response.data;
    } catch (error) {
        //console.error("Error verifying OTP:", error);
        throw error;
    }
};