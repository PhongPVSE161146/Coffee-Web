import { Row, Col, Select, DatePicker, Input } from 'antd';
import './ReportFilter.css'; // Import CSS file
import React, { useState } from 'react';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportFilter = ({ filters = {}, onFilterChange }) => {
  const [savedDates, setSavedDates] = useState(filters.reportDate);

  // Handle date range selection
  const handleDateChange = (dates) => {
    if (dates) {
      // Save the new dates when selected
      setSavedDates(dates);
    } else {
      // If 'x' is pressed, revert to saved dates
      onFilterChange({
        ...filters,
        reportDate: savedDates,
        startDate: savedDates ? savedDates[0] : null,
        endDate: savedDates ? savedDates[1] : null,
      });
      return;
    }

    // Update the date filter immediately
    onFilterChange({
      ...filters,
      reportDate: dates,
      startDate: dates ? dates[0] : null,
      endDate: dates ? dates[1] : null,
    });
  };

  // Handle input change for search field
  const handleInputChange = (e) => {
    // Update the search filter immediately
    onFilterChange({ ...filters, search: e.target.value });
  };

  // Handle class code selection
  const handleClassCodeChange = (value) => {
    // Update the class code filter immediately
    onFilterChange({ ...filters, classCode: value });
  };

  // Handle module selection
  const handleModuleChange = (value) => {
    // Update the module filter immediately
    onFilterChange({ ...filters, module: value });
  };

  return (
    <div className="report-header">
      <Row gutter={16}>
        {/* Class selection dropdown */}
        <Col span={5}>
          <div className="filter-item">
            <label>Class</label>
            <Select
              value={filters.classCode || 'Choose Class'}
              className="form-select"
              onChange={handleClassCodeChange}
            >
              <Option value="HL24_FR_FJB_02">HL24_FR_FJB_02</Option>
              <Option value="HL24_FR_FJB_03">HL24_FR_FJB_03</Option>
              <Option value="HL24_FR_FJB_05">HL24_FR_FJB_05</Option>
            </Select>
          </div>
        </Col>

        {/* Module selection dropdown */}
        <Col span={5}>
          <div className="filter-item">
            <label>Module</label>
            <Select
              value={filters.module || 'Choose a module'}
              className="form-select"
              onChange={handleModuleChange}
            >
              <Option value="[OC] Opening Ceremony">[OC] Opening Ceremony</Option>
              <Option value="[FTF_ITB] IT Basic (1.0)">[FTF_ITB] IT Basic (1.0)</Option>
              <Option value="[FTF_DSA] Data Structures and Algorithms (1.0)">
                [FTF_DSA] Data Structures and Algorithms (1.0)
              </Option>
            </Select>
          </div>
        </Col>

        {/* Date range selection */}
        <Col span={6}>
          <div className="filter-item">
            <label>Report Date</label>
            <RangePicker
              value={filters.reportDate || null}
              onChange={handleDateChange}
              style={{ width: '100%' }}
            />
          </div>
        </Col>

        {/* Search input */}
        <Col span={6} offset={2}>
          <div className="filter-item">
            <label>Search</label>
            <Input
              placeholder="Enter class code, class name"
              value={filters.search || ''}
              onChange={handleInputChange}
              className="form-select"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ReportFilter;
