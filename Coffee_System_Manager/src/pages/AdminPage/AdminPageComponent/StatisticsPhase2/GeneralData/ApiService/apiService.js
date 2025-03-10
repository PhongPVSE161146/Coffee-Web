// import axios from "axios";
// const token = sessionStorage.getItem("accessToken");

// const TOKEN = `Bearer ${token}`;
// const API_BASE_URL = "http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v1";


// export const fetchData = async () => {
//   const token = sessionStorage.getItem("accessToken");

//   const TOKEN = `Bearer ${token}`;
//   try {
//     const response = await axios.get(`${API_BASE_URL}/statistics/trainees`, {
//       headers: {
//         Authorization: TOKEN
//       }
//     });
//     return response.data;
//   } catch (error) {
//     //console.error("Error fetching events:", error);
//     throw error;
//   }
// };

// export const fetchData2 = async (oneYear, yearToDate, allTime) => {
//   const token = sessionStorage.getItem("accessToken");

//   const TOKEN = `Bearer ${token}`;
//   try {
//     const response = await axios.get(`${API_BASE_URL}/statistics/technical-manager?allTime=${allTime}&yearToDate=${yearToDate}&oneYear=${oneYear}`, {
//       headers: {
//         Authorization: TOKEN
//       }
//     });
//     return response.data;
//   } catch (error) {
//     //console.error("Error fetching events:", error);
//     throw error;
//   }
// };
// export const fetchData3 = async (start, end, name) => {
//   const token = sessionStorage.getItem("accessToken");

//   const TOKEN = `Bearer ${token}`;
//   try {
//     const response = await axios.get(`${API_BASE_URL}/statistics/class-distribution?account=${name}&startDate=${start}&endDate=${end}`, {
//       headers: {
//         Authorization: TOKEN
//       }
//     });
//     return response.data;
//   } catch (error) {
//     //console.error("Error fetching events:", error);
//     throw error;
//   }
// };
// export const fetchData4 = async (start, end, name) => {
//   const token = sessionStorage.getItem("accessToken");

//   const TOKEN = `Bearer ${token}`;
//   try {
//     const response = await axios.get(`${API_BASE_URL}/statistics/class-status-ratio?account=${name}&startDate=${start}&endDate=${end}`, {
//       headers: {
//         Authorization: TOKEN
//       }
//     });
//     return response.data;
//   } catch (error) {
//     //console.error("Error fetching events:", error);
//     throw error;
//   }
// };


