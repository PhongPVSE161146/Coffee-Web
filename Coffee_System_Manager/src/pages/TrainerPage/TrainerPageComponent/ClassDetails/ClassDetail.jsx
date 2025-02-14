import React, { useState, useEffect } from 'react'
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import ClassInfo from './ClassInfo/ClassInfo';
import TraineeList from './TraineeList/TraineeList';

const ClassDetail = () => {
  const location = useLocation();
  const [trainerData, setTrainerData] = useState(() => {
    const storedData = sessionStorage.getItem("classcode");
    return storedData ? storedData : location.state?.value || [];
  });

  const trainerName = trainerData;
  const [tag, setTag] = useState(() => {
    return sessionStorage.getItem("activeTag") || null;
  });


  const [activeTag, setActiveTag] = useState(() => {
    if (tag == null){
      sessionStorage.setItem("activeTag", " - " + "Class Info");
      return "Class Info";
    } 
    else return tag.replace(" - ", "");
  });

  const navigate = useNavigate();

  const handleNavigateTotrainerManagement = () => {
    sessionStorage.removeItem("activeTag");
    sessionStorage.removeItem("classcode");
    navigate("/trainerPage/trainerconfirmation");
  };

  const handleClick = (tag) => {
    setActiveTag((prevActiveTag) => (prevActiveTag === tag ? null : tag));
    setTag(" - " + tag);

    sessionStorage.setItem("activeTag", " - " + tag);
    sessionStorage.setItem("classcode", trainerData);
  };

  return (
    <div className="trainer-management-content">
      <div className="trainer-management-title">
        <h1 className="h1">{trainerName}</h1>
      </div>
      <div className="trainer-management-category">
        {[
          "Class Info",
          "Trainee List"
        ].map((tag) => (
          <div
            key={tag}
            className={`trainer-management-category-tag ${activeTag === tag ? "active" : ""
              }`}
            onClick={() => handleClick(tag)}
          >
            <p>{tag}</p>
          </div>
        ))}
      </div>
      {activeTag === "Class Info" && (<ClassInfo />)}
      {activeTag === "Trainee List" && (<TraineeList />)}
      <div className="trainer-management-footer">
        <div className="back-btn" onClick={handleNavigateTotrainerManagement}>
          Back to Trainer Confirmation
        </div>
      </div>
    </div>
  );
};


export default ClassDetail