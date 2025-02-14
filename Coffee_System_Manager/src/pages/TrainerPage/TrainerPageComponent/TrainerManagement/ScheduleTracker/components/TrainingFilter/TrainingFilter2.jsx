import React from "react";
import { DatePicker, Input, Select, Row, Col } from "antd";
import "./TrainingFilter.css";
import dayjs from "dayjs";

const { Option } = Select;

const TrainingFilter2 = ({
  modules = [],
  deliveryTypes = [],
  trainingFormats = [],
  scheduleDates = [],
  selectedModule,
  selectedDeliveryType,
  selectedTrainingFormat,
  selectedDate,
  searchTerm,
  onModuleChange,
  onDeliveryTypeChange,
  onTrainingFormatChange,
  onDateChange,
  onSearchChange,
}) => {
  const disabledDate = (current) => {
    if (!selectedModule || scheduleDates.length === 0) return false;
    return !scheduleDates.some((date) =>
      dayjs(date).isSame(current, "day")
    );
  };

  return (
    <div className="report-form-container">
      <Row gutter={16} style={{ width: "100%" }}>
        <Col span={6}>
          <div className="form-item">
            <label className="form-label">Module</label>
            <Select
              placeholder="Select Module"
              className="form-select"
              onChange={onModuleChange}
              value={selectedModule}
              options={modules.map((module) => ({
                value: module.id,
                label: module.name,
              }))}
            />
          </div>
        </Col>

        {selectedModule && (
          <>
            <Col span={4}>
              <div className="form-item">
                <label className="form-label">Delivery Type</label>
                <Select
                  className="form-select"
                  onChange={onDeliveryTypeChange}
                  value={selectedDeliveryType}
                  placeholder="Select Delivery Type"
                >
                  <Option value="">Select All</Option>
                  {deliveryTypes.map((type, index) => (
                    <Option key={index} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>

            <Col span={4}>
              <div className="form-item">
                <label className="form-label">Training Format</label>
                <Select
                  className="form-select"
                  onChange={onTrainingFormatChange}
                  value={selectedTrainingFormat}
                  placeholder="Select Training Format"
                >
                  <Option value="">Select All</Option>
                  {trainingFormats.map((format, index) => (
                    <Option key={index} value={format}>
                      {format}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>

            <Col span={4}>
              <div className="form-item">
                <label className="form-label">Schedule Date</label>
                <DatePicker
                  className="form-date-picker"
                  format="DD/MM/YYYY"
                  disabledDate={disabledDate}
                  onChange={onDateChange}
                  value={selectedDate}
                />
              </div>
            </Col>

            <Col span={6}>
              <div className="form-item">
                <label className="form-label">Search</label>
                <Input
                  placeholder="Enter the class code, class name"
                  className="form-input"
                  onChange={(e) => onSearchChange(e.target.value)}
                  value={searchTerm}
                />
              </div>
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default TrainingFilter2;
