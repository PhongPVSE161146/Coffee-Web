import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TrainerTable from "./components/TableTrainerList/TrainerTableList";
import { useLocation } from "react-router-dom";
import './TrainerList.css';
import { showInfoNotification } from "../../../../components/Notifications/Notifications";
import axios from 'axios';
import { Spin } from "antd";

// Set up axios instance with base URL and headers
export const axiosInstance = axios.create({
  baseURL: 'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v2',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to request headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const TrainerList = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Detect URL changes
  const [showComponents, setShowComponents] = useState(true);
  const [trainers, setTrainers] = useState([]); // Store trainers list
  const [loading, setLoading] = useState(true); // State to hold the loading state
  const role = sessionStorage.getItem("selectedRole");

  // Fetch trainers data and update trainers state
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await axiosInstance.get("/trainer/get-all");
        //console.log("API Response:", response.data); // Log the response for debugging
        setTrainers(response.data.data || []); // Store the trainers data or fallback to an empty array
      } catch (error) {
        //console.error("Error fetching trainers:", error); // Log the error for debugging
        setTrainers([]); // Fallback to empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, []);

  // Calculate trainer count based on the fetched data
  const trainerCount = trainers.length > 0 ? trainers.length : 0; // Default to 0 if no trainers

  // Handle navigation to the trainer detail page
  const handleTrainerSelect = (account) => {
    setShowComponents(false); // Close components when navigating
    sessionStorage.setItem("activeTag", " - Trainer Information");
    if (role === "admin")
      navigate(`/adminPage/trainerManagement/${account}/Profile`);
    else if (role === "deliverymanager")
      navigate(`/DeliveryManagerPage/trainerManagement/${account}/Profile`);
    showInfoNotification(`View info ${account}`);
  };

  const handledowloadTemplate = () => {
    // Add functionality for downloading template here
  };

  // Reset state when returning to trainerManagement page
  useEffect(() => {
    if (location.pathname === `/trainerManagement`) {
      setShowComponents(true); // Reset state when navigating back to TrainerList
    }
  }, [location.pathname]);

  // Handle adding a new trainer
  const handleAddTrainer = () => {
    setShowComponents(false);
    if (role === 'admin')
      navigate(`/adminPage/addTrainer`);
    if (role === 'deliverymanager')
      navigate(`/DeliveryManagerPage/addTrainer`);
  };

  return (
    <div>
      {showComponents && (
        <div className='diviner'>
          <h1 className="statitics-text">
            {loading ? (
              <div className="spinner">
                <Spin size="large" />
              </div>
            ) : (
              `Trainer List (${trainerCount})` // Display the total count of trainers
            )}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <h4 className="titkle_test_templates" onClick={handledowloadTemplate}>
              Download Template
            </h4>
            <h4 className="titkle_test_templates" onClick={handledowloadTemplate}>
              Export Data
            </h4>
            <button className="import-btn-dobodi" onClick={handleAddTrainer}>Import Trainer</button>
          </div>
        </div>
      )}

      {showComponents && <TrainerTable onTrainerSelect={handleTrainerSelect} />}
    </div>
  );
};

export default TrainerList;
