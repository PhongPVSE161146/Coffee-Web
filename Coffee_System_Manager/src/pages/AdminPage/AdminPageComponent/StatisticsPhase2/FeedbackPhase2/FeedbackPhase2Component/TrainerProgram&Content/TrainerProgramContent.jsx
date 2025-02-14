import { DatePicker, InputNumber, message, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  DownOutlined,
  FilterOutlined,
  UpOutlined,
} from "@ant-design/icons";
import "./TrainerProgramContent.css";
import BadFbTable from "./table/bad feedback table/badFbTable";
import {
  fetchModuleData,
  fetchTrainingProgramContentData,
} from "./table/apiService";
import GoodFbTable from "./table/goodFeedbackTable/goodFbTable";
import { style } from "@mui/system";
import ClassTable from "./table/class table/classTable";
import { render } from "@testing-library/react";

const TrainerProgramContent = () => {
  const [visible, setVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [dateValue, setdateValue] = useState("");
  const [moduleValue, setModuleValue] = useState("");
  const [filterModule, setFilterModule] = useState([]);
  const [belowValue, setBelowValue] = useState(4);
  const [upValue, setUpValue] = useState(5);
  const [filterScore, setFilterScore] = useState([]);
  const scoreCondition = belowValue < upValue;
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState([]);
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState("");

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const moduleData = await fetchModuleData();
        setModules(moduleData);

        if (moduleData.length > 0) {
          const data = await fetchTrainingProgramContentData(moduleData);
          setDataSource(data);
        }
      } catch (error) {
        //console.log(error);
      }
    };

    fetchClass();
  }, []);

  //==============================

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Module",
      dataIndex: "moduleName",
      key: "moduleName",
      width: 120,
    },
    {
      title: "Number Class",
      dataIndex: "numberOfClass",
      key: "numberOfClass",
      width: 80,
      render: (numberOfClass, record) => (
        <span
          style={{
            cursor: numberOfClass > 0 ? "pointer" : "default",
            color: numberOfClass > 0 ? "blue" : "inherit",
            textDecoration: numberOfClass > 0 ? "underline" : "",
          }}
          onClick={() => {
            if (numberOfClass > 0) {
              setSelectedTable("moduleFeedback");
              setModuleName(record.moduleName);
            } else {
              setSelectedTable("");
            }
          }}
        >
          {numberOfClass}
        </span>
      ),
    },
    {
      title: "Number of Feedbacks",
      dataIndex: "feedBack",
      key: "feedBack",
      width: 100,
    },
    {
      title: "Good Feedbacks",
      dataIndex: "goodFeedback",
      key: "goodFeedback",
      width: 90,
      render: (goodFeedback, record) => (
        <span
          style={{
            cursor: goodFeedback > 0 ? "pointer" : "default",
            color: goodFeedback > 0 ? "blue" : "inherit",
            textDecoration: goodFeedback > 0 ? "underline" : "",
          }}
          onClick={() => {
            if (goodFeedback > 0) {
              setSelectedTable("goodFeedback");
              setModuleName(record.moduleName);
            } else {
              setSelectedTable("");
            }
          }}
        >
          {goodFeedback}
        </span>
      ),
    },
    {
      title: "Bad Feedbacks",
      dataIndex: "badFeedback",
      key: "badFeedback",
      width: 90,
      render: (badFeedback, record) => (
        <span
          style={{
            cursor: badFeedback > 0 ? "pointer" : "default",
            color: badFeedback > 0 ? "blue" : "inherit",
            textDecoration: badFeedback > 0 ? "underline" : "",
          }}
          onClick={() => {
            if (badFeedback > 0) {
              setSelectedTable("badFeedback");
              setModuleName(record.moduleName);
            } else {
              setSelectedTable("");
            }
          }}
        >
          {badFeedback}
        </span>
      ),
    },
    {
      title: "Average",
      dataIndex: "averageRating",
      key: "averageRating",
      width: 70,
      render: (averageRating) => {
        return <span style={{ color: "red" }}>{averageRating}</span>;
      },
    },
  ];

  //==============================

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setModuleValue("");
    setdateValue("");
    setSelectedTable("");
    setModuleName("");
    setBelowValue(4);
    setUpValue(5);
    setFilterScore([]);
    setFilterModule([]);
  };

  const handleModuleValue = (value) => {
    setModuleValue(value);
    setSelectedTable("");
    if (value === "selectAll") {
      setFilterModule(dataSource);
      return;
    }

    const filteredData = dataSource?.filter((data) =>
      data.moduleName.toLowerCase().includes(value.toLowerCase())
    );

    setFilterModule(filteredData);
  };

  const handleDateValue = (dateString) => {
    setdateValue(dateString);
  };

  const handleBelowValue = (value) => {
    setBelowValue(value);
  };

  const handleAboveValue = (value) => {
    setUpValue(value);
  };

  const handleFilterScore = () => {
    if (!Array.isArray(dataSource)) {
      message.error("Data source is not available or is not an array.");
      return;
    }
    if (scoreCondition) {
      setFilterScore(
        dataSource?.filter(
          (item) =>
            item.averageRating > belowValue && item.averageRating < upValue
        )
      );
    } else {
      message.error("Please input correct below score!");
    }
  };

  const filteredData =
    dataSource?.filter((data) => {
      const moduleMatch =
        filterModule.length === 0 ||
        filterModule.some((item) => item.moduleName === data.moduleName);

      const averageMatch =
        filterScore.length === 0 ||
        (data.averageRating &&
          data.averageRating < upValue &&
          data.averageRating > belowValue);
      return moduleMatch && averageMatch;
    }) ?? [];

  return (
    <div className="trainer-program-container">
      <div className="trainer-program-content">
        <div>
          <div className="trainer-program-info-dropdown">
            <div
              className={`trainer-program-info-dropdown-header ${visible ? "active" : ""
                }`}
              onClick={() => {
                visible ? hideModal() : showModal();
              }}
            >
              Trainer Program & Content
              <span className="trainer-program-dropdown-arrow">
                {visible ? <UpOutlined /> : <DownOutlined />}
              </span>
            </div>
            {visible && (
              <div className="trainer-program-dropdown-body">
                <div className="trainer-program-filter">
                  <div className="time">
                    <p>Time</p>
                    <RangePicker
                      allowClear={!visible}
                      onChange={handleDateValue}
                      style={{
                        width: "250px",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                  <div className="module">
                    <p>Module</p>
                    <Select
                      allowClear={!visible}
                      onChange={handleModuleValue}
                      style={{
                        width: "250px",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                      }}
                      placeholder="Please select Module"
                      options={[
                        { value: "selectAll", label: "Select All" },
                        ...modules.map((module) => ({
                          value: module,
                          label: module,
                        })),
                      ]}
                    />
                  </div>
                  <div className="score">
                    <p>Average Score Range</p>
                    <div className="range">
                      <InputNumber
                        min={1}
                        max={5}
                        value={belowValue}
                        // disabled={scoreCondition}
                        onChange={handleBelowValue}
                        style={{
                          width: "50px",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <InputNumber
                        min={1}
                        max={5}
                        value={upValue}
                        disabled={!scoreCondition}
                        onChange={handleAboveValue}
                        style={{
                          width: "50px",
                          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <div className="filter-icon" onClick={handleFilterScore}>
                        <FilterOutlined
                          style={{
                            fontSize: "15px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {dateValue !== "" && moduleValue !== "" ? (
                  <Table
                    dataSource={filteredData.length > 0 ? filteredData : ""}
                    columns={columns}
                    size="small"
                  />
                ) : (
                  ""
                )}
                {selectedTable === "badFeedback" ? (
                  <div className="bad-fb-table">
                    <div
                      className="table-icon"
                      onClick={() => setSelectedTable("")}
                    >
                      <CloseOutlined />
                    </div>
                    <BadFbTable moduleName={moduleName} />
                  </div>
                ) : selectedTable === "goodFeedback" ? (
                  <div className="good-fb-table">
                    <div
                      className="table-icon"
                      onClick={() => setSelectedTable("")}
                    >
                      <CloseOutlined />
                    </div>
                    <GoodFbTable moduleName={moduleName} />
                  </div>
                ) : selectedTable === "moduleFeedback" ? (
                  <div className="module-fb-table">
                    <div
                      className="table-icon"
                      onClick={() => setSelectedTable("")}
                    >
                      <CloseOutlined />
                    </div>
                    <ClassTable moduleName={moduleName} />
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProgramContent;
