import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Tooltip } from "antd";
import { SmallDashOutlined } from "@ant-design/icons";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import "./TrainerManagement.css";
import { axiosInstance } from "../../../../axios/Axios";
import TrainerTrainerInformation from "./TrainerInformation/TrainerInformation";

const TrainerManagement = (isEditMode) => {
  const { account } = useParams();
  sessionStorage.setItem('accounttrainer', account);
  const [trainerData, setTrainerData] = useState('');
  const [trainerName, setTrainerName] = useState('');
  const [visibleTags, setVisibleTags] = useState([]);
  const [hiddenTags, setHiddenTags] = useState([]);
  const [category, setCategory] = useState(() => sessionStorage.getItem("activeTag") || null);
  const [activeTag, setActiveTag] = useState("Trainer Information");

  const navigate = useNavigate();

  const roleConfigs = {
    trainer: {
      path: sessionStorage.getItem("username"),
    },
    admin: {
      path: sessionStorage.getItem("accounttrainer"),
    },
    // Add more roles here in the future
  };
  const role = sessionStorage.getItem("selectedRole");
  const { path } = roleConfigs[role] || {};

  const roleCategories = {
    trainer: ["Trainer Information", "Trainer Unit Price", "Class List", "Schedule", "Statistics"],
  };

  const accessibleCategories = roleCategories[role] || [];

  const fetchTrainerInfo = async () => {
    try {
      if (role === "trainer" || role === "admin") {
        const response = await axiosInstance.get(`/trainer/get-info/${path}`);
        if (response.data?.data?.trainerInfo?.generalInfo?.name) {
          if (role === 'admin') setTrainerName(response.data.data.trainerInfo.generalInfo.name);
          if (role === 'trainer') setTrainerName(response.data.data.trainerInfo.generalInfo.account);
        } else {

        }
      }


    } catch (error) {
    }
  };

  useEffect(() => {
    fetchTrainerInfo();
  }, []);

  const updateVisibleTags = () => {
    const containerWidth = document.querySelector(".trainer-management-category")?.offsetWidth || 0;
    let totalWidth = 0;
    const visible = [];
    const hidden = [];

    accessibleCategories.forEach((category) => {
      const tagWidth = 120; // Estimated width for each tag, adjust as needed
      if (totalWidth + tagWidth < containerWidth - 60) { // Adjust the extra space for the ellipsis dropdown
        visible.push(category);
        totalWidth += tagWidth;
      } else {
        hidden.push(category);
      }
    });

    setVisibleTags(visible);
    setHiddenTags(hidden);
  };

  useEffect(() => {
    updateVisibleTags();
    window.addEventListener("resize", updateVisibleTags);
    return () => {
      window.removeEventListener("resize", updateVisibleTags);
    };
  }, []);

  const handleClick = (category) => {
    setActiveTag(category);
    setCategory(category);
    sessionStorage.setItem("activeTag", category);
    sessionStorage.setItem("trainerData", JSON.stringify(trainerData));
    navigate(category.toLowerCase().replace(/\s+/g, ""), { state: { trainerData } });
  };

  const handleBackToTrainerList = () => {
    if (role === "deliverymanager")
      navigate("/DeliveryManagerPage/trainerList")
    else if (role === "admin")
      navigate("/AdminPage/trainerList")
  }

  const menu = (
    <Menu>
      {hiddenTags.map((category) => (
        <Menu.Item key={category} onClick={() => handleClick(category)}>
          {category}
        </Menu.Item>
      ))}
    </Menu>
  );

  useEffect(() => {
    // Lấy active tag từ session storage hoặc dùng tag đầu tiên
    const savedTag = sessionStorage.getItem("activeTag");
    const defaultTag = savedTag || (accessibleCategories.length > 0 ? accessibleCategories[0] : "Trainer Information");

    setActiveTag(defaultTag);
    setCategory(defaultTag);
    sessionStorage.setItem("activeTag", defaultTag);

    // Navigate to default route if needed
    if (!savedTag) {
      navigate(defaultTag.toLowerCase().replace(/\s+/g, ""), { state: { trainerData } });
    }
  }, []); // Run once when component mounts

  return (

    <div className="trainer-management-content">
      {role === "trainer" && (<div className="trainer-management-header" style={{height: '44px'}}>
        <div className="trainer-management-category">
          {visibleTags.map((category) => (
            <div
              key={category}
              className={`category-tag ${activeTag === category ? "active" : ""}`}
              onClick={() => handleClick(category)}
            >
              {category}
            </div>
          ))}
          {hiddenTags.length > 0 && (
            <Dropdown overlay={menu} placement="bottomRight">
              <div className="more-categories">
                <SmallDashOutlined />
              </div>
            </Dropdown>
          )}
        </div>
      </div>)}


      <div className="trainer-management-body">
        <Outlet />
      </div>


      {/* <div className="fixed-footer">
        <div className="footer-content">
          {((role === "admin" || role === "deliverymanager") && isEditMode) && (
            <div className="back-to-mainpage-button">
              <button onClick={() => handleBackToTrainerList()}>
                Back to Trainer List
              </button>
            </div>
          )}
        </div>
      </div> */}

    </div>
  );
};

export default TrainerManagement;
