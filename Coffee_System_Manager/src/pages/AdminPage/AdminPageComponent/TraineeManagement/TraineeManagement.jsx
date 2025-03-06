import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { exportFeedbackData } from "../TrainerManagement/ClassList/ApiService/ApiService";

const TraineeManagement = () => {
  const role = sessionStorage.getItem("selectedRole");
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const classId = query.get('classId');

  // Set initial state based on current path
  const [selectedTab, setSelectedTab] = useState(() => {
    if (location.pathname.includes('customTemplate')) return 'custom';
    if (location.pathname.includes('traineeFeedback')) return 'feedback';
    if (location.pathname.includes('schedule')) return 'schedule';
    if (location.pathname.includes('classTemplate')) return 'class';
    return '';
  });

  // Update selected tab when location changes
  useEffect(() => {
    if (location.pathname.includes('customTemplate')) {
      setSelectedTab('custom');
    } else if (location.pathname.includes('traineeFeedback')) {
      setSelectedTab('feedback');
    } else if (location.pathname.includes('schedule')) {
      setSelectedTab('schedule');
    } else if (location.pathname.includes('classTemplate')) {
      setSelectedTab('class');
    }
  }, [location.pathname]);

  const handleNavigation = (selection) => {
    setSelectedTab(selection);
    switch (selection) {
      case 'class':
        navigate('classTemplate');
        break;
      case 'custom':
        navigate('customTemplate');
        break;
      case 'feedback':
        navigate('traineeFeedback');
        break;
      case 'schedule':
        navigate('schedule');
        break;
      default:
        navigate('classTemplate');
    }
  };

  const handleCustomTemplate = () => {
    if (role === 'admin') {
      navigate('customTemplate');
    } else if (role === 'deliverymanager') {
      navigate('/DeliveryManagerPage/add-template');
    }
  };

  const handleExportFeedbackData = () => {
    exportFeedbackData(templateId, classId);

  }

  return (
    <div className='new-class-detail'>
      <div className='diviner'>
        <h1 className="statitics-text">Trainee Feedback</h1>
        {role === 'deliverymanager' && selectedTab === 'class' && (
          <div
            type="primary"
            className="import-btn"
            onClick={handleCustomTemplate}
          >
            Add New Template
          </div>
        )}

        {(selectedTab === 'feedback' && location.pathname.includes("/feedback")) && (
          <div
            type="primary"
            className="import-btn"
            onClick={handleExportFeedbackData}
          >
            Export Data
          </div>
        )}
      </div>

      <div className="categories-items">
        <a
          className={selectedTab === 'class' ? 'selected' : ''}
          onClick={() => handleNavigation('class')}
        >
          Class Template
        </a>
        <a
          className={selectedTab === 'custom' ? 'selected' : ''}
          onClick={() => handleNavigation('custom')}
        >
          Custom Template
        </a>
        <a
          className={selectedTab === 'feedback' ? 'selected' : ''}
          onClick={() => handleNavigation('feedback')}
        >
          Feedback
        </a>
        {role === 'deliverymanager' && (
          <a
            className={selectedTab === 'schedule' ? 'selected' : ''}
            onClick={() => handleNavigation('schedule')}
          >
            Schedule
          </a>
        )}
      </div>

      {/* Use Outlet instead of conditional rendering */}
      <Outlet />
    </div>
  )
};

export default TraineeManagement;