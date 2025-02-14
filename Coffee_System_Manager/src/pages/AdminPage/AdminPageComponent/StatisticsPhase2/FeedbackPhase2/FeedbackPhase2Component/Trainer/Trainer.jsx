import React, { useState, useEffect } from "react";
import { DatePicker, Select } from "antd";
import { DownOutlined, UpOutlined, CloseOutlined } from "@ant-design/icons";
import "./Trainer.css";
import TrainerTable from "./TrainerTable/TrainerTable";
import BadTable from "./BadTable/BadTable";
import GoodTable from "./GoodTable/GoodTable";
import {
  fetchEvaluateData,
  fetchModuleData,
  fetchTrainerData,
  fetchStatisticsTrainer,
} from "./ApiServices/ApiServices";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const Trainer = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [fetchConfirmData, setFetchConfirmData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState([]);
  const [selectedClassCode, setSelectedClassCode] = useState("");
  const [trainerOptions, setTrainerOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [trainerDataOptions, setTrainerDataOptions] = useState([]);
  const [showBadFeedbackTable, setShowBadFeedbackTable] = useState(false);
  const [isFiltersSelected, setIsFiltersSelected] = useState(false);
  const [badFeedbackData, setBadFeedbackData] = useState(null);
  const [goodFeedbackData, setGoodFeedbackData] = useState(null);
  const [showGoodFeedbackTable, setShowGoodFeedbackTable] = useState(false);
  const [trackBy, setTrackBy] = useState("");
  const [averageScoreRange, setAverageScoreRange] = useState({
    min: null,
    max: null,
  });
  const [averageScore, setAverageScore] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data2 = await fetchTrainerData();
      setTrainerDataOptions(Array.isArray(data2.data) ? data2.data : []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const moduleData = await fetchModuleData();
      setModuleOptions(moduleData);
    } catch (error) {
      //console.error("Error loading module data:", error);
    }
  };

  const handleToggleTrainerSection = () => {
    setIsOpen1(!isOpen1);

    if (isOpen1) {
      setTrainerOptions([]);
      setSelectedTrainer([]);
      setFilteredData([]);
      setShowBadFeedbackTable(false);
      setShowGoodFeedbackTable(false);
      setIsFiltersSelected(false);
      setSelectedModule("");
      setSelectedTime(null);
      setTrackBy("");
    }
  };

  const handleModuleChange = (selectedModule) => {
    setSelectedModule(selectedModule);

    const selectedTrainers = moduleOptions
      .filter((module) => module.module === selectedModule)
      .flatMap((module) => module.trainer.map((trainer) => trainer.name));

    setTrainerOptions(selectedTrainers);

    setSelectedTrainer([]);
    setFilteredData([]);
    setShowBadFeedbackTable(false);
    setShowGoodFeedbackTable(false);
    setIsFiltersSelected(false);
  };

  const handleTrackByChange = (value) => {
    setTrackBy(value);
    setSelectedTrainer([]);
    setFilteredData([]);
    setShowBadFeedbackTable(false);
    setShowGoodFeedbackTable(false);
    setIsFiltersSelected(false);
  };

  useEffect(() => {
    if (trackBy === "evaluate") {
      handleFilter();
    } else if (trackBy === "statistics") {
      handleStatisticsFilter();
    }
  }, [
    selectedModule,
    selectedTrainer,
    trackBy,
    selectedClassCode,
    selectedTime,
  ]);

  const handleFilter = async () => {
    try {
      if (selectedModule && selectedTrainer.length > 0) {
        const response = await fetchEvaluateData(
          selectedModule,
          selectedTrainer
        );

        if (Array.isArray(response) && response.length > 0) {
          setFilteredData(response);
          const averageScores = response.map((item) => item.averageRating);
          const minScore = Math.min(...averageScores);
          const maxScore = Math.max(...averageScores);

          setAverageScoreRange({ min: minScore, max: maxScore });
        } else {
          //console.error("Invalid or empty data:", response);
          setFilteredData([]);
        }

        setIsFiltersSelected(true);
      } else {
        setFilteredData([]);
        setIsFiltersSelected(false);
      }
    } catch (error) {
      //console.error("Error filtering data:", error);
      setFilteredData([]);
    }
  };

  const handleStatisticsFilter = async () => {
    try {
      if (selectedTrainer && selectedClassCode) {
        const response = await fetchStatisticsTrainer(
          selectedTrainer,
          selectedClassCode
        );

        if (Array.isArray(response) && response.length > 0) {
          setFilteredData(
            response.filter((item) => {
              const createDate = dayjs(item?.createdDate);
              if (!selectedTime[0] || !selectedTime[1]) return true;
              return (
                createDate.isAfter(selectedTime?.[0], "day") &&
                createDate.isBefore(selectedTime?.[1], "day")
              );
            })
          );
          const averageScores = response.map((item) => item.averageRating);
          const minScore = Math.min(...averageScores);
          const maxScore = Math.max(...averageScores);
          const totalScore = averageScores.reduce(
            (sum, score) => sum + score,
            0
          );
          const averageScore = Math.round(totalScore / averageScores.length);
          setAverageScoreRange({ min: minScore, max: maxScore });
          setAverageScore(averageScore);
        } else {
          //console.error("Invalid or empty data:", response);
          setFilteredData([]);
        }

        setIsFiltersSelected(true);
      } else {
        setFilteredData([]);
        setIsFiltersSelected(false);
      }
    } catch (error) {
      //console.error("Error filtering statistics data:", error);
      setFilteredData([]);
    }
  };

  const handleBadFeedbackClick = (record) => {
    setBadFeedbackData({
      trainerName: trackBy === "statistics" ? "trainer 01" : record.trainerName,
      classCode: record.classCode,
      moduleName: record.moduleName,
      badFeedbackList: record.badFeedbackList,
    });
    setShowBadFeedbackTable(true);
    setShowGoodFeedbackTable(false);
  };

  const handleGoodFeedbackClick = (record) => {
    setGoodFeedbackData({
      trainerName: trackBy === "statistics" ? "trainer 01" : record.trainerName,
      classCode: record.classCode,
      moduleName: record.moduleName,
      goodFeedbackList: record.goodFeedbackList,
    });
    setShowGoodFeedbackTable(true);
    setShowBadFeedbackTable(false);
  };

  const handleCloseTable = () => {
    setShowBadFeedbackTable(false);
    setShowGoodFeedbackTable(false);
  };

  const handleTrainerChange = (value) => {
    if (value.includes("all")) {
      setSelectedTrainer(trainerOptions);
    } else {
      setSelectedTrainer(value);
    }

    setFilteredData([]);
    setShowBadFeedbackTable(false);
    setShowGoodFeedbackTable(false);
    setIsFiltersSelected(false);
  };

  const handleTrainerChange2 = (value) => {
    if (value.includes("all")) {
      setSelectedTrainer(
        selectedTrainer.length === trainerOptions.length ? [] : trainerOptions
      );
    } else {
      setSelectedTrainer(value);
    }

    sessionStorage.setItem("selectedTrainerStatistics", JSON.stringify(value));
    setSelectedClassCode("");
    setFilteredData([]);
    setShowBadFeedbackTable(false);
    setShowGoodFeedbackTable(false);
    setIsFiltersSelected(false);
  };

  return (
    <div className="trainer-container">
      <div className="trainer-content">
        <div>
          <div className="trainer-info-dropdown">
            <div
              className={`trainer-info-dropdown-header ${
                isOpen1 ? "active" : ""
              }`}
              onClick={handleToggleTrainerSection}
            >
              Trainer
              <span className="trainer-info-dropdown-arrow">
                {isOpen1 ? <UpOutlined /> : <DownOutlined />}
              </span>
            </div>
            {isOpen1 && (
              <div className="trainer-dropdown-body">
                <div className="trainer-filter">
                  <div>
                    <label>Track By</label>
                    <Select
                      value={trackBy}
                      onChange={handleTrackByChange}
                      placeholder="Select Tracking Option"
                      style={{ width: "100%" }}
                    >
                      <Option value="evaluate">
                        Evaluate Trainer by Module
                      </Option>
                      <Option value="statistics">
                        Module Statistics by Trainer
                      </Option>
                    </Select>
                  </div>

                  {trackBy === "evaluate" && (
                    <>
                      <div>
                        <label>Time</label>
                        <RangePicker
                          onChange={(dates) => setSelectedTime(dates)}
                        />
                      </div>
                      <div>
                        <label>Module</label>
                        <Select
                          placeholder="Select Module"
                          onChange={handleModuleChange}
                          style={{ width: "100%" }}
                        >
                          {moduleOptions.map((module) => (
                            <Option key={module.module} value={module.module}>
                              {module.module}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label>Trainer</label>
                        <Select
                          mode="multiple"
                          allowClear
                          value={selectedTrainer}
                          onChange={handleTrainerChange}
                          placeholder="Select trainers"
                        >
                          <Option key="all" value="all">
                            Select All
                          </Option>
                          {trainerOptions.map((trainer) => (
                            <Option key={trainer} value={trainer}>
                              {trainer}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    </>
                  )}

                  {trackBy === "statistics" && (
                    <>
                      <div>
                        <label>Time</label>
                        <RangePicker
                          onChange={(dates) => setSelectedTime(dates)}
                        />
                      </div>
                      <div>
                        <label>Trainer</label>
                        <Select
                          placeholder="Select Trainer"
                          onChange={handleTrainerChange2}
                          value={selectedTrainer}
                          style={{ width: "100%" }}
                          options={trainerDataOptions.map((option) => ({
                            label: option.trainerName,
                            value: option.trainerName,
                          }))}
                        ></Select>
                      </div>
                      <div>
                        <label>Class Code</label>
                        <Select
                          placeholder="Select Class Code"
                          onChange={(value) => {
                            if (value === "all") {
                              const allClassCodes = trainerDataOptions.filter(
                                (option) =>
                                  option.trainerName === selectedTrainer
                              )[0]?.classCode;
                              setSelectedClassCode(allClassCodes || []);
                            } else {
                              setSelectedClassCode(value);
                            }
                          }}
                          style={{ width: "100%" }}
                          options={[
                            { label: "Select All", value: "all" },
                            ...(trainerDataOptions
                              .filter(
                                (option) =>
                                  option.trainerName === selectedTrainer
                              )[0]
                              ?.classCode?.map((item) => ({
                                label: item,
                                value: item,
                              })) || []),
                          ]}
                        />
                      </div>
                    </>
                  )}
                </div>
                <div className="table">
                  {isFiltersSelected && filteredData.length > 0 && (
                    <div className="average-score-1">
                      <p>Average Score Range</p>
                      <div className="lower-range">{averageScoreRange.min}</div>
                      <div className="higher-range">
                        {averageScoreRange.max}
                      </div>
                    </div>
                  )}
                  {isFiltersSelected &&
                    filteredData.length > 0 &&
                    trackBy === "statistics" && (
                      <div className="average-score-2">
                        <p>Average Score Range</p>
                        <div className="higher-range-2">{averageScore}</div>
                      </div>
                    )}
                  {isFiltersSelected && (
                    <TrainerTable
                      data={filteredData}
                      onBadFeedbackClick={handleBadFeedbackClick}
                      onGoodFeedbackClick={handleGoodFeedbackClick}
                      trackBy={trackBy}
                    />
                  )}
                </div>

                {showBadFeedbackTable && (
                  <div>
                    <div className="table-icon" onClick={handleCloseTable}>
                      <CloseOutlined />
                    </div>
                    <BadTable badFeedbackData={badFeedbackData} />
                  </div>
                )}

                {showGoodFeedbackTable && (
                  <div>
                    <div className="table-icon" onClick={handleCloseTable}>
                      <CloseOutlined />
                    </div>
                    <GoodTable goodFeedbackData={goodFeedbackData} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainer;
