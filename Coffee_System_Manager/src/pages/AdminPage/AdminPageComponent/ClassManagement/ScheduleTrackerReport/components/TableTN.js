import './TableTN.css';
import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Input, Tooltip, Select, Modal, Row, Col, DatePicker } from 'antd';
import { FunnelPlotOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { DOMAIN } from '../config';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
const { Option } = Select;
const TableTN = () => {
  const [dataTableTN, setDataTableTN] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trainerFilter, setTrainerFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("");
  const [trainingFormatFilter, setTrainingFormatFilter] = useState("");
  const [scheduledStartFilter, setScheduledStartFilter] = useState(null);
  const [scheduledEndFilter, setScheduledEndFilter] = useState(null);
  const [actualStartFilter, setActualStartFilter] = useState(null);
  const [actualEndFilter, setActualEndFilter] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [uniqueTrainers, setUniqueTrainers] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueModules, setUniqueModules] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [trainingFormats, setTrainingFormats] = useState([]);
  const handleOpenFilterPanel = () => setShowFilterPanel(true);
  const handleCloseFilterPanel = () => setShowFilterPanel(false);
  const [filteredData, setFilteredData] = useState(dataTableTN);
  const getRowSpan = (data, index, key) => { //function row spanning logic
    if (index === 0 || data[index][key] !== data[index - 1][key]) {
      let span = 1;
      for (let i = index + 1; i < data.length; i++) {
        if (data[i][key] === data[index][key]) span++;
        else break;
      }
      return span;
    }
    return 0;
  };
  const columnsTableTN = [
    { title: 'Topics', dataIndex: 'topicName', key: 'topicKEY', width: 200, fixed: 'left', render: (_, row, index) => ({ children: row.topicName, props: { rowSpan: getRowSpan(filteredData, index, 'topicName') } }) },
    { title: 'Contents', dataIndex: 'contentName', key: 'contentKEY', width: 200, fixed: 'left' },
    { title: 'Trainer/Class Admin', dataIndex: 'trainerId', key: 'traineridKEY', width: 150, render: (_, row, index) => ({ children: row.trainerId, props: { rowSpan: getRowSpan(filteredData, index, 'trainerId') } }) },
    { title: 'Delivery Type', dataIndex: 'contentDeliveryType', key: 'deliTypeKEY', width: 150, render: (_, row, index) => ({ children: row.contentDeliveryType, props: { rowSpan: getRowSpan(filteredData, index, 'contentDeliveryType') } }) },
    { title: 'Training Format', dataIndex: 'contentTrainingFormat', key: 'trainFormatKEY', width: 150 },
    { title: 'Scheduled Date', dataIndex: 'contentPlannedDate', key: 'scheduleDateKEY', width: 150, render: (_, row, index) => ({ children: moment(row.contentPlannedDate).format("YYYY-MM-DD"), props: { rowSpan: getRowSpan(filteredData, index, 'contentPlannedDate') } }) },
    { title: 'Actual Date', dataIndex: 'reportActualDate', key: 'actualDateKEY', width: 150, render: (_, row, index) => ({ children: moment(row.reportActualDate).format("YYYY-MM-DD"), props: { rowSpan: getRowSpan(filteredData, index, 'reportActualDate') } }) },
    { title: 'Duration(hour)', dataIndex: 'reportDuration', key: 'durationKEY', width: 120, render: (_, row, index) => ({ children: row.reportDuration, props: { rowSpan: getRowSpan(filteredData, index, 'reportDuration') } }) },
    { title: 'Note', dataIndex: 'reportNote', key: 'noteKEY', width: 100, render: (_, row, index) => ({ children: row.reportNote, props: { rowSpan: getRowSpan(filteredData, index, 'reportNote') } }) },
    { title: 'Reason for mismatch - if any', dataIndex: 'reportReason', key: 'reasonKEY', width: 200, render: (_, row, index) => ({ children: row.reportReason, props: { rowSpan: getRowSpan(filteredData, index, 'reportReason') } }) },
    { title: 'Status', dataIndex: 'contentIsDone', key: 'statusKEY', width: 150, fixed: 'right', render: (text) => (text ? 'Reported' : 'On Going') },
  ];
  useEffect(() => {
    setFilteredData(dataTableTN);
  }, [dataTableTN]);
  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        //console.error("No token found in sessionStorage");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${DOMAIN}/api/v1/admin/schedule-tracker?option=TRAINER`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const flattenedData = [];
        const trainersSet = new Set();
        const deliveryTypesSet = new Set();
        const trainingFormatsSet = new Set();
        response.data.data.forEach((trainerItem) => {
          trainersSet.add(trainerItem.trainerId);
          trainerItem.classes.forEach((classItem) => {
            classItem.modules.forEach((moduleItem) => {
              moduleItem.contents.forEach((contentItem) => {
                flattenedData.push({
                  key: `${classItem.classId}-${moduleItem.moduleId}-${contentItem.contentId}`,
                  trainerId: trainerItem.trainerId,
                  className: classItem.className,
                  moduleName: moduleItem.moduleName,
                  topicName: contentItem.topicName,
                  contentName: contentItem.contentName,
                  contentDeliveryType: contentItem.contentDeliveryType,
                  contentTrainingFormat: contentItem.contentTrainingFormat,
                  contentPlannedDate: moment(contentItem.contentPlannedDate).format('YYYY-MM-DD'),
                  reportActualDate: contentItem.reportActualDate ? moment(contentItem.reportActualDate).format('YYYY-MM-DD') : null,
                  reportDuration: contentItem.reportDuration,
                  reportNote: contentItem.reportNote,
                  reportReason: contentItem.reportReason,
                  contentIsDone: contentItem.contentIsDone,
                });
                deliveryTypesSet.add(contentItem.contentDeliveryType);
                trainingFormatsSet.add(contentItem.contentTrainingFormat);
              });
            });
          });
        });
        setDataTableTN(flattenedData);
        setUniqueTrainers(Array.from(trainersSet));
        setDeliveryTypes(Array.from(deliveryTypesSet));
        setTrainingFormats(Array.from(trainingFormatsSet));
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const initialFilteredData = trainerFilter // Apply the trainer filter initially if it's set
      ? dataTableTN.filter(item => item.trainerId === trainerFilter)
      : dataTableTN;
    setFilteredData(initialFilteredData);
  }, [dataTableTN, trainerFilter]);
  //function for modal

  // Utility function to check if a date is within a specified range
  const isDateInRange = (date, startDate, endDate) => {
    if (!date) return false;
    const dateObj = new Date(date);
    const startObj = startDate ? new Date(startDate) : null;
    const endObj = endDate ? new Date(endDate) : null;

    return (
      (!startObj || dateObj >= startObj) &&
      (!endObj || dateObj <= endObj)
    );
  };

  useEffect(() => {
    // Filter logic for schedule and actual date ranges
    const filteredByDates = dataTableTN.filter(item => {
      const matchesScheduled = isDateInRange(
        item.contentPlannedDate,
        scheduledStartFilter,
        scheduledEndFilter
      );

      const matchesActual = isDateInRange(
        item.reportActualDate,
        actualStartFilter,
        actualEndFilter
      );

      return matchesScheduled && matchesActual;
    });

    setFilteredData(filteredByDates);
  }, [
    scheduledStartFilter,
    scheduledEndFilter,
    actualStartFilter,
    actualEndFilter,
    dataTableTN
  ]);

  useEffect(() => {
    // Apply filters independently
    let filtered = [...dataTableTN];

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(item => {
        if (statusFilter === "Reported") return item.contentIsDone;
        if (statusFilter === "On Going") return !item.contentIsDone;
        return true; // No filter applied
      });
    }

    // Filter by delivery type
    if (deliveryTypeFilter) {
      filtered = filtered.filter(item => item.contentDeliveryType === deliveryTypeFilter);
    }

    // Filter by training format
    if (trainingFormatFilter) {
      filtered = filtered.filter(item => item.contentTrainingFormat === trainingFormatFilter);
    }

    setFilteredData(filtered);
  }, [dataTableTN, statusFilter, deliveryTypeFilter, trainingFormatFilter]);


  const handleTrainerChange = (value) => {
    setTrainerFilter(value);
    setClassFilter("");
    setModuleFilter("");
    const classesSet = new Set(
      dataTableTN
        .filter(item => item.trainerId === value)
        .map(item => item.className)
    );
    setUniqueClasses(Array.from(classesSet));
  };
  const handleClassChange = (value) => {
    setClassFilter(value);
    setModuleFilter("");
    const modulesSet = new Set(
      dataTableTN
        .filter(item => item.trainerId === trainerFilter && item.className === value)
        .map(item => item.moduleName)
    );
    setUniqueModules(Array.from(modulesSet));
  };
  useEffect(() => {
    // Search logic for filtering dataTableTN based on searchQuery
    const filtered = dataTableTN.filter((item) => {
      const topicMatch = item.topicName.toLowerCase().includes(searchQuery.toLowerCase());
      const contentMatch = item.contentName.toLowerCase().includes(searchQuery.toLowerCase());
      return topicMatch || contentMatch;
    });
    setFilteredData(filtered);
  }, [searchQuery, dataTableTN]);

  const exportToExcel = async () => {
    const headers = [
      { title: "Topics", dataKey: "topicName" },
      { title: "Contents", dataKey: "contentName" },
      { title: "Trainer/Class Admin", dataKey: "trainerId" },
      { title: "Delivery Type", dataKey: "contentDeliveryType" },
      { title: "Training Format", dataKey: "contentTrainingFormat" },
      { title: "Scheduled Date", dataKey: "contentPlannedDate" },
      { title: "Actual Date", dataKey: "reportActualDate" },
      { title: "Duration(hr)", dataKey: "reportDuration" },
      { title: "Note", dataKey: "reportNote" },
      { title: "Reason for mismatch", dataKey: "reportReason" },
      { title: "Status", dataKey: "contentIsDone" }
    ];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Table Data');

    // Prepare data rows for export
    const rows = filteredData.map(row =>
      headers.reduce((acc, header) => {
        acc[header.dataKey] = row[header.dataKey];
        return acc;
      }, {})
    );

    // Add column headers with fixed width
    worksheet.columns = headers.map((header, index) => {
      let defaultWidth = 20; // Default width for all columns
      return {
        header: header.title,
        key: header.dataKey,
        width: header.dataKey === 'topicName'
          ? 50
          : header.dataKey === 'contentName'
            ? 50
            : header.dataKey === 'reportNote'
              ? 50
              : header.dataKey === 'reportReason'
                ? 50
                : defaultWidth
      };
    });

    // Apply bold font and green background color (#92c47d) to headers
    headers.forEach((header, index) => {
      const cell = worksheet.getCell(`${String.fromCharCode(65 + index)}1`);
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' }; // Center alignment
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF92C47D' }
      };
    });

    // Add data rows to worksheet
    rows.forEach(row => {
      worksheet.addRow(row);
    });

    worksheet.eachRow((row, rowIndex) => {
      row.eachCell((cell, colIndex) => {
        // Center alignment for each cell
        cell.alignment = { horizontal: 'center', vertical: 'middle' };

        // Add border to each cell
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    // Helper function to trim and compare values for merging
    const areEqual = (a, b) => {
      if (typeof a !== 'string' || typeof b !== 'string') return a === b;
      return a.trim() === b.trim(); // Trim spaces to avoid splitting due to whitespace
    };

    // Helper function to merge cells and center-align content
    const addMergeForColumn = (colKey, dataKey) => {
      let startRow = 2;
      for (let i = 2; i <= filteredData.length + 1; i++) {
        const currentValue = filteredData[i - 2]?.[dataKey];
        const nextValue = filteredData[i - 1]?.[dataKey];

        if (areEqual(currentValue, nextValue)) continue;

        if (i - startRow > 1) {
          worksheet.mergeCells(`${colKey}${startRow}:${colKey}${i - 1}`);
          const cell = worksheet.getCell(`${colKey}${startRow}`);
          cell.alignment = { vertical: 'middle', horizontal: 'center' };
        }
        startRow = i;
      }
    };

    // Apply merges and center-align for required columns
    addMergeForColumn('A', 'topicName');          // Topics column
    addMergeForColumn('C', 'trainerId');      // Trainer/Class Admin column
    addMergeForColumn('E', 'contentTrainingFormat');    // Training Format column
    addMergeForColumn('F', 'contentPlannedDate');   // Scheduled Date column
    addMergeForColumn('G', 'reportActualDate');     // Actual Date column
    addMergeForColumn('H', 'reportDuration');       // Duration column
    addMergeForColumn('I', 'reportNote');           // Note column
    addMergeForColumn('J', 'reportReason');         // Reason column
    addMergeForColumn('K', 'contentIsDone');         // Status column

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'DATA.xlsx');
  };
  return (
    <div className='main-tableTN-container'>
      <div className="filters-container-tableTN">
        <div className="label-select-trainer-class-module-group-filter-tableTN">
          <label><span style={{ color: 'red' }}>*</span><b>Trainer</b></label>
          <Select
            placeholder="Select Trainer"
            value={trainerFilter}
            onChange={handleTrainerChange}
            style={{ width: '100%' }}
          >
            {uniqueTrainers.map(trainer => (
              <Option key={trainer} value={trainer}>{trainer}</Option>
            ))}
          </Select>
        </div>
        {trainerFilter && (
          <div className="label-select-trainer-class-module-group-filter-tableTN">
            <label><span style={{ color: 'red' }}>*</span><b>Class</b></label>
            <Select
              placeholder="Select Class"
              value={classFilter}
              onChange={handleClassChange}
              style={{ width: '100%' }}
            >
              {uniqueClasses.map(className => (
                <Option key={className} value={className}>{className}</Option>
              ))}
            </Select>
          </div>
        )}
        {trainerFilter && classFilter && (
          <div className="label-select-trainer-class-module-group-filter-tableTN">
            <label><span style={{ color: 'red' }}>*</span><b>Module</b></label>
            <Select
              placeholder="Select Module"
              value={moduleFilter}
              onChange={setModuleFilter}
              style={{ width: '100%' }}
            >
              {uniqueModules.map(moduleName => (
                <Option key={moduleName} value={moduleName}>{moduleName}</Option>
              ))}
            </Select>
          </div>
        )}
      </div>
      {moduleFilter && (
        <div className='tableTN-render-group-container'>
          <div className='table-actions-tableTN' style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginTop: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: '1' }}>
              <label style={{ marginBottom: '8px', fontWeight: 'bold' }}>Search</label>
              <Input
                className='input-search-table-actions-tableTN'
                placeholder="Search topics or contents"
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
                allowClear
              />
            </div>
            <Tooltip title="Filter">
              <Button style={{ marginTop: '26px' }} icon={<FunnelPlotOutlined />} className='btn-funnel-antd-filter-group-tableTN' onClick={handleOpenFilterPanel} />
            </Tooltip>
            <Button style={{ marginTop: '26px' }} type='primary' className='btn-export-tbst-str' onClick={exportToExcel}>
              Export data
            </Button>
          </div>
          <Modal
            title="Filter"
            open={showFilterPanel}
            onCancel={handleCloseFilterPanel}
            onOk={handleCloseFilterPanel}
            okText="Apply"
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <label>Status</label>
                <Select
                  placeholder="Select Status"
                  
                  onChange={setStatusFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {/* <Option value="selectall">Select All</Option> */}
                  <Option value="Reported">Reported</Option>
                  <Option value="Ongoing">On Going</Option>
                </Select>
              </Col>
              <Col span={24}>
                <label>Delivery Type</label>
                <Select
                  placeholder="Select Delivery Type"
                  
                  onChange={setDeliveryTypeFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {/* <Option value="selectall">Select All</Option> */}
                  {deliveryTypes.map((type) => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={24}>
                <label>Training Format</label>
                <Select
                  placeholder="Select Training Format"
                  // value={trainingFormatFilter}
                  onChange={setTrainingFormatFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {trainingFormats.map((format) => (
                    <Option key={format} value={format}>{format}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={24}>
                <label>Schedule (Start)</label>
                <DatePicker
                  onChange={(date, dateString) => setScheduledStartFilter(dateString)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={24}>
                <label>Schedule (End)</label>
                <DatePicker
                  onChange={(date, dateString) => setScheduledEndFilter(dateString)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={24}>
                <label>Actual (Start)</label>
                <DatePicker
                  onChange={(date, dateString) => setActualStartFilter(dateString)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={24}>
                <label>Actual (End)</label>
                <DatePicker
                  onChange={(date, dateString) => setActualEndFilter(dateString)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </Modal>
          <div className="info-indicator-tableTN" style={{ marginBottom: '16px' }}>
            <span><strong>Class:</strong> {classFilter || 'All'}</span>
            <span><strong>Module:</strong> {moduleFilter || 'All'}</span>
            <span><strong>Start Date:</strong> {filteredData.length > 0 ? moment.min(filteredData.map(item => moment(item.contentPlannedDate))).format('DD/MM/YYYY') : 'N/A'}</span>
            <span><strong>End Date:</strong> {filteredData.length > 0 ? moment.max(filteredData.map(item => moment(item.contentPlannedDate))).format('DD/MM/YYYY') : 'N/A'}</span>
          </div>
          <Spin spinning={isLoading}>
            <div className="custom-table-render-tableTN-container">
              <Table
                columns={columnsTableTN}
                dataSource={filteredData}
                scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
                pagination={{ pageSize: 10 }}
                bordered
                className="custom-tableCL"
              />
            </div>
          </Spin>
        </div>
      )}
    </div>
  );
};
export default TableTN;