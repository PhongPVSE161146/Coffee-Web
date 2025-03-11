import React, { useState, useEffect } from "react";
import { Dropdown, Menu, Tooltip, Modal, Button, DatePicker, Select } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import "./StatisticsPhase2.css";

const { RangePicker } = DatePicker;
const { Option } = Select;

const SatisticsPhase2 = () => {
  const [tag, setTag] = useState(
    () => sessionStorage.getItem("activeTag") || null
  );
  const [activeTag, setActiveTag] = useState(() =>
    tag == null ? null : tag.replace(" - ", "")
  );
  const [visibleTags, setVisibleTags] = useState([]);
  const [hiddenTags, setHiddenTags] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const username = sessionStorage.getItem("username");

  const navigate = useNavigate();

  // const tags = ["General Data", "Module Statistic", "Feedback", "GPA"];
  const tags = ["Dashboard"];

  const updateVisibleTags = () => {
    const containerWidth =
      document.querySelector(".trainer-management-category")?.offsetWidth || 0;
    let totalWidth = 0;
    const visible = [];
    const hidden = [];

    tags.forEach((tag) => {
      const tagWidth = 120; // Estimated width for each tag, adjust as needed
      if (totalWidth + tagWidth < containerWidth - 60) {
        // Adjust the extra space for the ellipsis dropdown
        visible.push(tag);
        totalWidth += tagWidth;
      } else {
        hidden.push(tag);
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

  const handleClick = (tag) => {
    if (tag === activeTag) { } else {
      setActiveTag((prevActiveTag) => (prevActiveTag === tag ? null : tag));
      setTag(" - " + tag);

      sessionStorage.setItem("activeTag", " - " + tag);
      navigate(tag.toLowerCase().replace(/\s+/g, ""));
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalOpen = () => {
    let content;
    switch (activeTag) {
      case "General Data":
        content = (
          <div>
            <h3>Select Date Range:</h3>
            <RangePicker style={{width: "100%"}}/>
          </div>
        );
        setModalContent(content);
        setIsModalVisible(true);
        break;
      // case "Module Statistic":
      //   content = (
      //     <div>
      //       <h3>Select Options:</h3>
      //       <Select style={{ width: "100%", marginBottom: "10px" }} placeholder="Select option 1">
      //         <Option value="option1">Option 1</Option>
      //         <Option value="option2">Option 2</Option>
      //       </Select>
      //       <Select style={{ width: "100%", marginBottom: "10px" }} placeholder="Select option 2">
      //         <Option value="option1">Option 1</Option>
      //         <Option value="option2">Option 2</Option>
      //       </Select>
      //       <Select style={{ width: "100%" }} placeholder="Select option 3">
      //         <Option value="option1">Option 1</Option>
      //         <Option value="option2">Option 2</Option>
      //       </Select>
      //     </div>
      //   );
      //   setModalContent(content);
      //   setIsModalVisible(true);
      //   break;
      // case "Feedback":
      //   content = <div>This is the Feedback modal content.</div>;
      //   break;
      // case "GPA":
      //   content = (
      //     <div>
      //       <h3>Select GPA Details:</h3>
      //       <Select style={{ width: "100%", marginBottom: "10px" }} placeholder="Select GPA category 1">
      //         <Option value="gpa1">GPA Category 1</Option>
      //         <Option value="gpa2">GPA Category 2</Option>
      //       </Select>
      //       <Select style={{ width: "100%", marginBottom: "10px" }} placeholder="Select GPA category 2">
      //         <Option value="gpa1">GPA Category 1</Option>
      //         <Option value="gpa2">GPA Category 2</Option>
      //       </Select>
      //       <h3>Select Date Range:</h3>
      //       <RangePicker />
      //     </div>
      //   );
        setModalContent(content);
        setIsModalVisible(true);
        break;
      default:
        content = <div>No content available.</div>;
        setModalContent(content);
        setIsModalVisible(true);
    }
  };



  const menu = (
    <Menu>
      {hiddenTags.map((tag) => (
        <Menu.Item key={tag} onClick={() => handleClick(tag)}>
          {tag}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="trainer-management-content">
      {/* <div className="trainer-management-title">
        <h1 className="statitics-text">
          {username} {tag}
        </h1>
      </div> */}
      <div className="trainer-management-category" style={{height: '44px'}}>
        <div className="trainer-management-category1">
          {visibleTags.map((tag) => (
            <Tooltip key={tag} title={tag}>
              <div
                className={`trainer-management-category-tag ${activeTag === tag ? "active" : ""
                  }`}
                onClick={() => handleClick(tag)}
              >
                {tag}
              </div>
            </Tooltip>
          ))}
          {hiddenTags.length > 0 && (
            <Dropdown overlay={menu} trigger={["click"]}>
              <div className="trainer-management-category-tag more-icon">
                <MoreVert />
              </div>
            </Dropdown>
          )}
        </div>
        {/* <Button
          style={{ float: 'right' }}
          type="primary"
          onClick={handleModalOpen}
          disabled={!activeTag}
          className="open-modal-button"
        >
          Export
        </Button> */}
      </div>

      <Modal
        title={activeTag + " Export"}
        open={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        {modalContent}
      </Modal>
      <Outlet />
    </div>
  );
};

export default SatisticsPhase2;
