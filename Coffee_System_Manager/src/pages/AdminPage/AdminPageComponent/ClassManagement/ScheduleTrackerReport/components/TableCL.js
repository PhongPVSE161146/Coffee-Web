import './TableCL.css'
import React, { useEffect, useMemo, useState } from 'react';
import { Select, Spin, DatePicker, Input, Row, Col, Table, Button, Tooltip, Modal } from 'antd';
import { FunnelPlotOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { DOMAIN } from '../config';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
const { Option } = Select;
const TableCL = () => {
  const [dataTableCL, setDataTableCL] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [classFilter, setClassFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [uniqueModules, setUniqueModules] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("");
  const [trainingFormatFilter, setTrainingFormatFilter] = useState("");
  const [scheduledStartFilter, setScheduledStartFilter] = useState(null);
  const [scheduledEndFilter, setScheduledEndFilter] = useState(null);
  const [actualStartFilter, setActualStartFilter] = useState(null);
  const [actualEndFilter, setActualEndFilter] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [deliveryTypeOptions, setDeliveryTypeOptions] = useState([]);
  const [trainingFormatOptions, setTrainingFormatOptions] = useState([]);
  const handleOpenFilterPanel = () => setShowFilterPanel(true);
  const handleCloseFilterPanel = () => setShowFilterPanel(false);
  const columnsTableCL = [
    {
      title: 'Topics',
      dataIndex: 'topicName',
      key: 'topic',
      width: 200,
      fixed: 'left',
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'topicName', record.topicName, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Contents',
      dataIndex: 'contentName',
      key: 'content',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Trainer/Class Admin',
      dataIndex: 'trainerId',
      key: 'trainerId',
      width: 150,
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'trainerId', record.trainerId, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Delivery Type',
      dataIndex: 'contentDeliveryType',
      key: 'deliType',
      width: 150,
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'contentDeliveryType', record.contentDeliveryType, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Training Format',
      dataIndex: 'contentTrainingFormat',
      key: 'trainFormat',
      width: 150,
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'contentPlannedDate',
      key: 'scheduleDate',
      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD'),
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'contentPlannedDate', record.contentPlannedDate, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Actual Date',
      dataIndex: 'reportActualDate',
      key: 'actualDate',
      width: 150,
      render: (text) => moment(text).format('YYYY-MM-DD'),
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'reportActualDate', record.reportActualDate, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Duration(hour)',
      dataIndex: 'reportDuration',
      key: 'duration',
      width: 120,
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'reportDuration', record.reportDuration, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Note',
      dataIndex: 'reportNote',
      key: 'note',
      width: 100,
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'reportNote', record.reportNote, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Reason for mismatch - if any',
      dataIndex: 'reportReason',
      key: 'reason',
      width: 200,
      onCell: (record, rowIndex) => {
        const rowSpan = calculateRowSpan(filteredData, 'reportReason', record.reportReason, rowIndex);
        return { rowSpan };
      },
    },
    {
      title: 'Status',
      dataIndex: 'contentIsDone',
      key: 'status',
      width: 150,
      fixed: 'right',
      render: (text) => {
        return text ? 'Reported' : 'On Going';
      },
    },
  ];
  const calculateRowSpan = (data, dataIndex, value, rowIndex) => {
    if (rowIndex === 0 || data[rowIndex - 1][dataIndex] !== value) {
      let count = 0;// Count consecutive rows with the same value
      for (let i = rowIndex; i < data.length; i++) {
        if (data[i][dataIndex] === value) count++;
        else break;
      }
      return count;
    }
    return 0; // Hide subsequent rows with the same value
  };
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
          `${DOMAIN}/api/v1/admin/schedule-tracker?option=CLASS`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const flattenedData = [];
        const deliveryTypes = new Set();
        const trainingFormats = new Set();
        response.data.data.forEach((classItem) => {
          classItem.modules.forEach((moduleItem) => {
            moduleItem.contents.forEach((contentItem) => {
              flattenedData.push({
                key: `${classItem.classId}-${moduleItem.moduleId}-${contentItem.contentId}`,
                className: classItem.className,
                moduleName: moduleItem.moduleName,
                trainerId: moduleItem.trainerId,
                topicName: contentItem.topicName,
                contentName: contentItem.contentName,
                contentDeliveryType: contentItem.contentDeliveryType,
                contentTrainingFormat: contentItem.contentTrainingFormat,
                contentPlannedDate: moment(contentItem.contentPlannedDate).format('YYYY-MM-DD'),
                contentIsDone: contentItem.contentIsDone,
                reportActualDate: contentItem.reportActualDate ? moment(contentItem.reportActualDate).format('YYYY-MM-DD') : null,
                reportDuration: contentItem.reportDuration,
                reportNote: contentItem.reportNote,
                reportReason: contentItem.reportReason,
              });
              deliveryTypes.add(contentItem.contentDeliveryType);// Collect unique delivery types and training formats
              trainingFormats.add(contentItem.contentTrainingFormat);
            });
          });
        });
        setDataTableCL(flattenedData);
        setDeliveryTypeOptions(Array.from(deliveryTypes));// Update state with unique options
        setTrainingFormatOptions(Array.from(trainingFormats));
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const handleClassChange = (value) => {
    setClassFilter(value);
    setModuleFilter(""); // Reset module filter
    const filteredModules = Array.from(
      new Set(dataTableCL.filter(item => item.className === value).map(item => item.moduleName))
    );
    setUniqueModules(filteredModules);
  };
  const filteredData = useMemo(() => {
    return dataTableCL.filter(item => {
      const matchesSearch = item.topicName?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.contentName?.toLowerCase().includes(searchText.toLowerCase());
      const matchesClass = classFilter ? item.className === classFilter : true;
      const matchesModule = moduleFilter ? item.moduleName === moduleFilter : true;
      const matchesStatus = statusFilter
        ? statusFilter === 'selectall' || (statusFilter === 'reported' && item.contentIsDone) || (statusFilter === 'ongoing' && !item.contentIsDone)
        : true;
      const matchesDeliveryType = deliveryTypeFilter && deliveryTypeFilter !== 'selectall'
        ? item.contentDeliveryType === deliveryTypeFilter
        : true;
      const matchesTrainingFormat = trainingFormatFilter
        ? trainingFormatFilter === 'selectall' || item.contentTrainingFormat === trainingFormatFilter
        : true;
      const matchesScheduledDate = scheduledStartFilter && scheduledEndFilter
        ? moment(item.contentPlannedDate, 'YYYY-MM-DD').isBetween(
          moment(scheduledStartFilter).startOf('day'),
          moment(scheduledEndFilter).endOf('day'),
          'day',
          '[]'
        )
        : true;
      const matchesActualDate = actualStartFilter && actualEndFilter
        ? moment(item.reportActualDate, 'YYYY-MM-DD').isBetween(
          moment(actualStartFilter).startOf('day'),
          moment(actualEndFilter).endOf('day'),
          'day',
          '[]'
        )
        : true;
      return matchesSearch && matchesClass && matchesModule && matchesStatus && matchesDeliveryType &&
        matchesTrainingFormat && matchesScheduledDate && matchesActualDate;
    });
  }, [dataTableCL, classFilter, moduleFilter, statusFilter, deliveryTypeFilter, trainingFormatFilter, scheduledStartFilter, scheduledEndFilter, actualStartFilter, actualEndFilter, searchText]);
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
    <div className='main-tableCL-container'>
      <div className="filter-row-class-module-tableCL">
        <div className='class-filter-tableCL-container' style={{ width: '50%' }}>
          <label><span style={{ color: 'red' }}>*</span>Class</label>
          <Select
            placeholder="Select Class"
            value={classFilter}
            onChange={handleClassChange}
            style={{ width: '100%', marginBottom: 16 }}
          >
            {Array.from(new Set(dataTableCL.map((item) => item.className))).map(
              (className) => (
                <Option key={className} value={className}>
                  {className}
                </Option>
              )
            )}
          </Select>
        </div>
        <div className='module-filter-container-tableCL' style={{ width: '50%' }}>
          {classFilter && (
            <>
              <label><span style={{ color: 'red' }}>*</span>Module</label>
              <Select
                placeholder="Select Module"
                value={moduleFilter}
                onChange={setModuleFilter}
                style={{ width: '100%', marginBottom: 16 }}
              >
                {uniqueModules.map((moduleName) => (
                  <Option key={moduleName} value={moduleName}>
                    {moduleName}
                  </Option>
                ))}
              </Select>
            </>
          )}
        </div>
      </div>
      {classFilter && moduleFilter && (
        <>
          <div className="actions-row-tableCL" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
            <div className='search-section-label-input-tableCL' style={{ width: '90%' }}>
              <div style={{ marginBottom: '8px' }}><label><b>Search</b></label></div>
              <Input
                placeholder="Search with topic name or content"
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: '100%' }}
                allowClear
              />
            </div>
            <Tooltip title="Filter" >
              <Button icon={<FunnelPlotOutlined />} onClick={handleOpenFilterPanel} style={{ marginTop: '26px' }} />
            </Tooltip>
            <Button style={{ marginTop: '25px' }} type='primary' className='btn-export-tbst-str' onClick={exportToExcel}>
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
                  // value={statusFilter}
                  onChange={setStatusFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="selectall">Select All</Option>
                  <Option value="reported">Reported</Option>
                  <Option value="ongoing">On Going</Option>
                </Select>
              </Col>
              <Col span={24}>
                <label>Delivery Type</label>
                <Select
                  placeholder="Select Delivery Type"
                  // value={deliveryTypeFilter}
                  onChange={setDeliveryTypeFilter}
                  style={{ width: '100%' }}
                  allowClear
                >
                  <Option value="selectall">Select All</Option>
                  {deliveryTypeOptions.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
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
                  <Option value="selectall">Select All</Option>
                  {trainingFormatOptions.map((format) => (
                    <Option key={format} value={format}>
                      {format}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col span={24}>
                <label>Schedule (Start)</label>
                <DatePicker
                  style={{ width: '100%' }}
                  value={scheduledStartFilter ? moment(scheduledStartFilter, 'YYYY-MM-DD') : null}
                  onChange={(date) => setScheduledStartFilter(date ? date.format('YYYY-MM-DD') : null)}
                />
              </Col>
              <Col span={24}>
                <label>Schedule (End)</label>
                <DatePicker
                  style={{ width: '100%' }}
                  value={scheduledEndFilter ? moment(scheduledEndFilter, 'YYYY-MM-DD') : null}
                  onChange={(date) => setScheduledEndFilter(date ? date.format('YYYY-MM-DD') : null)}
                />
              </Col>
              <Col span={24}>
                <label>Actual (Start)</label>
                <DatePicker
                  style={{ width: '100%' }}
                  value={actualStartFilter ? moment(actualStartFilter, 'YYYY-MM-DD') : null}
                  onChange={(date) => setActualStartFilter(date ? date.format('YYYY-MM-DD') : null)}
                />
              </Col>
              <Col span={24}>
                <label>Actual (End)</label>
                <DatePicker
                  style={{ width: '100%' }}
                  value={actualEndFilter ? moment(actualEndFilter, 'YYYY-MM-DD') : null}
                  onChange={(date) => setActualEndFilter(date ? date.format('YYYY-MM-DD') : null)}
                />
              </Col>
            </Row>
          </Modal>
          <div className="info-indicator-tableCL" style={{ marginBottom: '16px' }}>
            <span><strong>Class:</strong> {classFilter || 'All'}</span>
            <span><strong>Module:</strong> {moduleFilter || 'All'}</span>
            <span><strong>Start Date:</strong> {filteredData.length > 0 ? moment.min(filteredData.map(item => moment(item.contentPlannedDate))).format('DD/MM/YYYY') : 'N/A'}</span>
            <span><strong>End Date:</strong> {filteredData.length > 0 ? moment.max(filteredData.map(item => moment(item.contentPlannedDate))).format('DD/MM/YYYY') : 'N/A'}</span>
          </div>
          <div className='table-render-container-tableCL'>
            <Spin spinning={isLoading}>
              <Table
                columns={columnsTableCL}
                dataSource={filteredData}
                loading={isLoading}
                scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
                bordered
                className="custom-tableCL"
              />
            </Spin>
          </div>
        </>
      )}
    </div>
  );
};
export default TableCL;