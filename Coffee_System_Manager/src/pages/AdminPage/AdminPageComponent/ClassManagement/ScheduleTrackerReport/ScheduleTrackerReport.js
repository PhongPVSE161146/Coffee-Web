import './ScheduleTrackerReport.css'
import React, { useEffect, useRef, useState } from 'react';
import { Divider, Tabs, Select, Spin, DatePicker, Input, Row, Col, Table, Button, Modal, Space, Tooltip } from 'antd';
import { FunnelPlotOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import TableCL from './components/TableCL'
import TableTN from './components/TableTN'
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { DOMAIN } from './config';
import { parseISO, isAfter, isBefore, isEqual } from 'date-fns';
import { showErrorNotification } from '../../../../../components/Notifications/Notifications';
const { RangePicker } = DatePicker;
const { Option } = Select;

const TableCA = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingMethod, setTrackingMethod] = useState("");
  const [classAdminFilter, setClassAdminFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [uniqueClassAdmins, setUniqueClassAdmins] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueModules, setUniqueModules] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState("");
  const [deliveryTypeOptions, setDeliveryTypeOptions] = useState([]);
  const [trainingFormatFilter, setTrainingFormatFilter] = useState("");
  const [scheduledStartFilter, setScheduledStartFilter] = useState(null);
  const [scheduledEndFilter, setScheduledEndFilter] = useState(null);
  const [actualStartFilter, setActualStartFilter] = useState(null);
  const [actualEndFilter, setActualEndFilter] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const token = sessionStorage.getItem("accessToken");
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };
  const applyFilters = () => {
    return data.filter(item => {
      const scheduledDate = item.contentPlannedDate ? parseISO(item.contentPlannedDate) : null;
      const actualDate = item.reportActualDate ? parseISO(item.reportActualDate) : null;
      return (
        (!classAdminFilter || item.trainerId === classAdminFilter) &&
        (!classFilter || item.className === classFilter) &&
        (!moduleFilter || item.moduleName === moduleFilter) &&
        (!statusFilter || statusFilter === "Select All" || item.contentIsDone === statusFilter) &&
        (!deliveryTypeFilter || deliveryTypeFilter === "Select All" || item.contentDeliveryType === deliveryTypeFilter) &&
        (!trainingFormatFilter || trainingFormatFilter === "Select All" || item.contentTrainingFormat === trainingFormatFilter) &&
        (!scheduledStartFilter || isAfter(scheduledDate, scheduledStartFilter) || isEqual(scheduledDate, scheduledStartFilter)) &&
        (!scheduledEndFilter || isBefore(scheduledDate, scheduledEndFilter) || isEqual(scheduledDate, scheduledEndFilter)) &&
        (!actualStartFilter || isAfter(actualDate, actualStartFilter) || isEqual(actualDate, actualStartFilter)) &&
        (!actualEndFilter || isBefore(actualDate, actualEndFilter) || isEqual(actualDate, actualEndFilter)) &&
        (searchText === "" ||
          item.topicName.toLowerCase().includes(searchText.toLowerCase()) ||
          item.contentName.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    });
  };
  const filteredData = applyFilters();
  const columns = [
    { title: 'Topics', dataIndex: 'topicName', key: 'topic', width: 200, fixed: 'left', render: (text, record, index) => { const sameTopicIndex = filteredData.findIndex(item => item.topicName === record.topicName); return { children: text, props: { rowSpan: sameTopicIndex === index ? filteredData.filter(item => item.topicName === record.topicName).length : 0, }, }; }, },
    { title: 'Contents', dataIndex: 'contentName', key: 'content', width: 200, fixed: "left" },
    { title: 'Trainer/Class Admin', dataIndex: 'trainerId', key: 'trainerid', width: 150, render: (text, record, index) => { const sameTrainerIndex = filteredData.findIndex(item => item.trainerId === record.trainerId); return { children: text, props: { rowSpan: sameTrainerIndex === index ? filteredData.filter(item => item.trainerId === record.trainerId).length : 0, }, }; }, },
    { title: 'Delivery Type', dataIndex: 'contentDeliveryType', key: 'deliType', width: 150 },
    { title: 'Training Format', dataIndex: 'contentTrainingFormat', key: 'trainFormat', width: 150, render: (text, record, index) => { const sameTrainFormatIndex = filteredData.findIndex(item => item.contentTrainingFormat === record.contentTrainingFormat); return { children: text, props: { rowSpan: sameTrainFormatIndex === index ? filteredData.filter(item => item.contentTrainingFormat === record.contentTrainingFormat).length : 0, }, }; }, },
    { title: 'Scheduled Date', dataIndex: 'contentPlannedDate', key: 'scheduleDate', width: 150, render: (text, record, index) => { const sameScheduleDateIndex = filteredData.findIndex(item => item.contentPlannedDate === record.contentPlannedDate); return { children: text, props: { rowSpan: sameScheduleDateIndex === index ? filteredData.filter(item => item.contentPlannedDate === record.contentPlannedDate).length : 0, }, }; }, },
    { title: 'Actual Date', dataIndex: 'reportActualDate', key: 'actualDate', width: 150, render: (text, record, index) => { const sameActualDateIndex = filteredData.findIndex(item => item.reportActualDate === record.reportActualDate); return { children: text, props: { rowSpan: sameActualDateIndex === index ? filteredData.filter(item => item.reportActualDate === record.reportActualDate).length : 0, }, }; }, },
    { title: 'Duration(hour)', dataIndex: 'reportDuration', key: 'duration', width: 120, render: (text, record, index) => { const sameDurationIndex = filteredData.findIndex(item => item.reportDuration === record.reportDuration); return { children: text, props: { rowSpan: sameDurationIndex === index ? filteredData.filter(item => item.reportDuration === record.reportDuration).length : 0, }, }; }, },
    { title: 'Note', dataIndex: 'reportNote', key: 'note', width: 100, render: (text, record, index) => { const sameNoteIndex = filteredData.findIndex(item => item.reportNote === record.reportNote); return { children: text, props: { rowSpan: sameNoteIndex === index ? filteredData.filter(item => item.reportNote === record.reportNote).length : 0, }, }; }, },
    { title: 'Reason for mismatch - if any', dataIndex: 'reportReason', key: 'reason', width: 200, render: (text, record, index) => { const sameReasonIndex = filteredData.findIndex(item => item.reportReason === record.reportReason); return { children: text, props: { rowSpan: sameReasonIndex === index ? filteredData.filter(item => item.reportReason === record.reportReason).length : 0, }, }; }, },
    { title: 'Status', dataIndex: 'contentIsDone', key: 'status', width: 100, fixed: "right", /* render: (text, record, index) => { const sameStatusIndex = filteredData.findIndex(item => item.contentIsDone === record.contentIsDone); return { children: text, props: { rowSpan: sameStatusIndex === index ? filteredData.filter(item => item.contentIsDone === record.contentIsDone).length : 0, }, }; }, */ },
  ];
  useEffect(() => {
    if (trackingMethod === "classAdmin") {
      setIsLoading(true);
      axios.get(`${DOMAIN}/api/v1/admin/schedule-tracker?option=CLASS_ADMIN`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
        .then(response => {
          // Adjust data extraction to match the new API format
          const extractedData = response.data.data.flatMap(admin =>
            admin.classes.flatMap(classItem =>
              classItem.modules.flatMap(module =>
                module.contents
                  .map(content => ({
                    topicName: content.topicName,
                    contentName: content.contentName,
                    trainerId: admin.classAdmin,
                    className: classItem.className,
                    moduleName: module.moduleName,
                    contentDeliveryType: content.contentDeliveryType,
                    contentTrainingFormat: content.contentTrainingFormat,
                    contentPlannedDate: content.contentPlannedDate ? new Date(content.contentPlannedDate).toISOString().slice(0, 10) : null,
                    reportActualDate: content.reportActualDate ? new Date(content.reportActualDate).toISOString().slice(0, 10) : null,
                    reportDuration: content.reportDuration,
                    reportNote: content.reportNote,
                    reportReason: content.reportReason,
                    contentIsDone: content.contentIsDone ? 'Reported' : 'On Going',
                  }))
              )
            )
          );
          setData(extractedData);
          setUniqueClassAdmins([...new Set(extractedData.map(item => item.trainerId))]);
          const uniqueDeliveryTypes = [
            ...new Set(extractedData.map(item => item.contentDeliveryType).filter(Boolean)),
          ];
          setDeliveryTypeOptions(uniqueDeliveryTypes);
        })
        .catch(error => //console.error("Error fetching data:", error)
          showErrorNotification("Error fetching data", `${error.message}`)
        )
        .finally(() => setIsLoading(false));
    }
  }, [trackingMethod, token, DOMAIN]);

  useEffect(() => {
    if (classAdminFilter) {
      const classes = [...new Set(data
        .filter(item => item.trainerId === classAdminFilter)
        .map(item => item.className))];
      setUniqueClasses(classes);
      setClassFilter("");
      setModuleFilter("");
      setUniqueModules([]);
    }
  }, [classAdminFilter, data]);
  useEffect(() => {
    if (classFilter) {
      const modules = [...new Set(data
        .filter(item => item.trainerId === classAdminFilter && item.className === classFilter)
        .map(item => item.moduleName))];
      setUniqueModules(modules);
      setModuleFilter("");
    }
  }, [classFilter, classAdminFilter, data]);
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
    <>
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
              <span style={{ color: 'red' }}>*</span> Track by:
            </label>
            <Select
              placeholder="Please select your tracking method"
              style={{ width: '100%' }}
              onChange={value => setTrackingMethod(value)}
            >
              <Option value="className">Class Name</Option>
              <Option value="trainer">Trainer</Option>
              <Option value="classAdmin">Class Admin</Option>
            </Select>
          </div>
        </Col>
        {trackingMethod === "classAdmin" && (
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                <span style={{ color: 'red' }}>*</span>Class Admin:
              </label>
              <Select
                placeholder="Select a Class Admin"
                style={{ width: '100%' }}
                onChange={value => setClassAdminFilter(value)}
                allowClear
              >
                {uniqueClassAdmins.map(admin => (
                  <Option key={admin} value={admin}>{admin}</Option>
                ))}
              </Select>
            </div>
          </Col>
        )}
      </Row>
      {trackingMethod === "classAdmin" && (
        <>
          <Row gutter={16}>
            {classAdminFilter && (
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span style={{ color: 'red' }}>*</span>Class:
                  </label>
                  <Select
                    placeholder="Select a Class"
                    style={{ width: '100%' }}
                    onChange={value => setClassFilter(value)}
                    allowClear
                  >
                    {uniqueClasses.map(className => (
                      <Option key={className} value={className}>{className}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
            )}
            {classFilter && (
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>
                    <span style={{ color: 'red' }}>*</span>Module:
                  </label>
                  <Select
                    placeholder="Select a Module"
                    style={{ width: '100%' }}
                    onChange={value => setModuleFilter(value)}
                    allowClear
                  >
                    {uniqueModules.map(moduleName => (
                      <Option key={moduleName} value={moduleName}>{moduleName}</Option>
                    ))}
                  </Select>
                </div>
              </Col>
            )}
          </Row>
          {moduleFilter && (
            <>
              <div style={{ marginBottom: '30px' }} className='search-with-filter-tbst'>
                <div className='search-bar-tbst-str' style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                  <label style={{ marginBottom: '8px', fontWeight: 'bold' }}>Search</label>
                  <Input
                    placeholder='Search with topic name or content'
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    allowClear
                  />
                </div>
                <Tooltip title="Filter">
                  <Button style={{ marginTop: '26px' }} className='funnel-filter-tbst-str' icon={<FunnelPlotOutlined />} onClick={toggleFilterPanel} />
                </Tooltip>
                <Button style={{ marginTop: '26px' }} type='primary' className='btn-export-tbst-str' onClick={exportToExcel}>
                  Export data
                </Button>
              </div>
              <Modal
                title="Filter"
                open={showFilterPanel}
                onCancel={toggleFilterPanel}
                footer={null}
              >
                <Row gutter={[16, 16]} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Status</label>
                      <Select
                        placeholder="Select Status"
                        onChange={(value) => setStatusFilter(value)}
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value="Select All">Select All</Option>
                        <Option value="Reported">Reported</Option>
                        <Option value="On Going">On Going</Option>
                      </Select>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Delivery Type</label>
                      <Select
                        placeholder="Select a Delivery Type"
                        onChange={(value) => setDeliveryTypeFilter(value)}
                        style={{ width: '100%' }}
                        allowClear
                      >
                        {/* <Option value="Select All">Select All</Option>
                        <Option value="Test/Quiz">Test/Quiz</Option>
                        <Option value="Audit">Audit</Option>
                        <Option value="Exam">Exam</Option> */}
                        {deliveryTypeOptions.map(type => (
                          <Option key={type} value={type}>{type}</Option>
                        ))}
                      </Select>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Training Format</label>
                      <Select
                        placeholder="Select a Training Format"
                        
                        onChange={(value) => setTrainingFormatFilter(value)}
                        style={{ width: '100%' }}
                        allowClear
                      >
                        <Option value="Select All">Select All</Option>
                        <Option value="Online">Online</Option>
                        <Option value="Offline">Offline</Option>
                        <Option value="Homework">Homework</Option>
                      </Select>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Schedule (Start)</label>
                      <DatePicker
                        value={scheduledStartFilter || null} // Directly use the Date object or null
                        onChange={(date) => setScheduledStartFilter(date)} // Date is already a Date object
                        style={{ width: '100%' }}
                      />
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Schedule (End)</label>
                      <DatePicker
                        value={scheduledEndFilter || null} // Directly use the Date object or null
                        onChange={(date) => setScheduledEndFilter(date)} // Date is already a Date object
                        style={{ width: '100%' }}
                      />
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Actual (Start)</label>
                      <DatePicker
                        value={actualStartFilter || null} // Directly use the Date object or null
                        onChange={(date) => setActualStartFilter(date)} // Date is already a Date object
                        style={{ width: '100%' }}
                      />
                    </Space>
                  </Col>
                  <Col span={24}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <label>Actual (End)</label>
                      <DatePicker
                        value={actualEndFilter || null} // Directly use the Date object or null
                        onChange={(date) => setActualEndFilter(date)} // Date is already a Date object
                        style={{ width: '100%' }}
                      />
                    </Space>
                  </Col>
                </Row>
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <Button type="primary" onClick={toggleFilterPanel}>
                    Apply Filters
                  </Button>
                </div>
              </Modal>
              <div className="info-indicator-tableTN" style={{ marginBottom: '16px' }}>
                <span><strong>Class:</strong> {classFilter || 'All'}</span>
                <span><strong>Module:</strong> {moduleFilter || 'All'}</span>
                <span><strong>Start Date:</strong> {filteredData.length > 0 ? moment.min(filteredData.map(item => moment(item.contentPlannedDate))).format('DD/MM/YYYY') : 'N/A'}</span>
                <span><strong>End Date:</strong> {filteredData.length > 0 ? moment.max(filteredData.map(item => moment(item.contentPlannedDate))).format('DD/MM/YYYY') : 'N/A'}</span>
              </div>
              <Spin spinning={isLoading} tip="Loading...">
                <div className='tableST-container-sd-tr-rp'>
                  <Table
                    className='schedule-tracker-report-table'
                    bordered
                    columns={columns}
                    dataSource={filteredData}
                    rowKey={(record) =>
                      `${record.trainerId}-${record.className}-${record.moduleName}-${record.topicName}-${record.contentName}`
                    }
                    scroll={{ x: 'max-content', y: 'calc(100vh - 300px)' }}
                  />
                </div>
              </Spin>
            </>
          )}
        </>
      )}
      {trackingMethod === 'className' && (
        <TableCL />
      )}
      {trackingMethod === 'trainer' && (
        <TableTN />
      )}
    </>
  );
};//end tableCA
//Start TableLOG
const TableLOG = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classOptions, setClassOptions] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [reportStartDate, setReportStartDate] = useState(null);
  const [reportEndDate, setReportEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassName, setSelectedClassName] = useState('');
  const [selectedModuleName, setSelectedModuleName] = useState('');
  const columnsChangeLogVer1 = [
    { title: 'Topics', dataIndex: 'topics', key: 'topics', fixed: 'left', width: 300, className: 'center-align-tableLOG-column-header' },
    { title: 'Contents', dataIndex: 'contents', key: 'contents', width: 300, className: 'center-align-tableLOG-column-header' },
    { title: 'Trainer/Class Admin', dataIndex: 'trainerClassAdmin', key: 'trainerClassAdmin', width: 140, className: 'center-align-tableLOG-column-header' },
    { title: 'Changed Content', dataIndex: 'changedContent', key: 'changedContent', width: 300, className: 'center-align-tableLOG-column-header' },
    {
      title: 'Old Value', dataIndex: 'oldValue', key: 'oldValue', width: 300, className: 'center-align-tableLOG-column-header', render: (text) => {
        if (typeof text === 'string' && text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
          return text.split('T')[0];
        }
        return text;
      }
    },
    {
      title: 'New Value', dataIndex: 'newValue', key: 'newValue', width: 300, className: 'center-align-tableLOG-column-header', render: (text) => {
        if (typeof text === 'string' && text.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)) {
          return text.split('T')[0];
        }
        return text;
      }
    },
    { title: 'Date Changed', dataIndex: 'dateChanged', key: 'dateChanged', width: 140, fixed: 'right', className: 'center-align-tableLOG-column-header', render: (_, row) => ({ children: moment(row.dateChanged).format("YYYY-MM-DD"), }) },
  ];
  useEffect(() => {// Fetch all classes on component mount
    const fetchClasses = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        //console.error("No token found in sessionStorage");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `${DOMAIN}/api/v3/classes/class-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const classList = response.data.data;
        const classOptions = classList.map(c => ({
          value: c.id,
          label: c.classCode,
        }));
        setClassOptions(classOptions);
        // console.log("chosen class: ", selectedClass);
      } catch (error) {
        //console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);
  useEffect(() => { // Fetch modules when a class is selected
    const fetchModules = async () => {
      if (!selectedClass) return;
      const token = sessionStorage.getItem("accessToken");
      setLoading(true);
      try {
        const response = await axios.get(
          `${DOMAIN}/api/v3/getAllModulesByClass?classId=${selectedClass}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const moduleList = response.data.data;
        const moduleOptions = moduleList.map(m => ({
          value: m.id,
          label: m.moduleName,
        }));
        setModuleOptions(moduleOptions);
        // console.log("chosen module: ", selectedModule);
      } catch (error) {
        //console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [selectedClass]);
  useEffect(() => { // Fetch logs when both class and module are selected
    const fetchLogs = async () => {
      if (!selectedClass || !selectedModule) return;
      const token = sessionStorage.getItem("accessToken");
      setLoading(true);
      try {
        const response = await axios.get(
          `${DOMAIN}/api/v3/logs?classId=${selectedClass}&moduleId=${selectedModule}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );
        const logs = response.data.data;
        const formattedData = logs.map(log => ({
          key: log.id,
          topics: log.topicName,
          contents: log.contentName,
          trainerClassAdmin: log.trainerId,
          changedContent: log.changedContent,
          oldValue: log.oldValue,
          newValue: log.newValue,
          dateChanged: new Date(log.changedDate).toLocaleString(),
          classId: log.classId,
          moduleId: log.moduleId,
          className: log.className,
          moduleName: log.moduleName,
        }));
        setData(formattedData);
      } catch (error) {
        //console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [selectedClass, selectedModule]);
  useEffect(() => {
    if (selectedClass) {
      const modulesForClass = data
        .filter(item => item.classId === selectedClass)
        .map(item => ({ value: item.moduleId, label: item.moduleName }));
      const uniqueModules = Array.from(new Set(modulesForClass.map(m => m.value)))
        .map(value => modulesForClass.find(m => m.value === value));
      setModuleOptions(uniqueModules);
    } else {
      setModuleOptions([]);
    }
  }, [selectedClass, data]);
  useEffect(() => {
    const filtered = data.filter(item => {
      const changedDate = new Date(item.dateChanged);

      return (
        (!selectedClass || item.classId === selectedClass) &&
        (!selectedModule || item.moduleId === selectedModule) &&
        (!reportStartDate || changedDate >= reportStartDate) &&
        (!reportEndDate || changedDate <= reportEndDate)
      );
    });

    setFilteredData(filtered);
  }, [selectedClass, selectedModule, reportStartDate, reportEndDate, data]);

  const handleClassChange = (value, option) => {
    setSelectedClass(value);
    setSelectedClassName(option.label);
    setSelectedModule(null);
    setSelectedModuleName('');
  };
  const handleModuleChange = (value, option) => {
    setSelectedModule(value);
    setSelectedModuleName(option.label);
  };
  const handleReportDateChange = (dates, dateStrings) => {
    if (!dates) {
      setReportStartDate(null);
      setReportEndDate(null);
      return;
    }

    setReportStartDate(dates[0]?.toDate() || null);
    setReportEndDate(dates[1]?.toDate() || null);
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };
  return (
    <div>
      <Row gutter={16} className='selector-row-group-tablelog-sd-tr-rp-container' style={{ marginBottom: '10px' }}>
        <Col span={5}>
          <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 'bold' }}><span style={{ color: 'red' }}>*</span>Class</label><br /></div> {/* appear first  */}
          <Select
            style={{ width: '100%', fontSize: '10px' }}
            onChange={handleClassChange}
            placeholder="Please select class"
            options={classOptions}
            value={selectedClass}
          />
        </Col>
        {selectedClass && (
          <Col span={7}>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 'bold' }}><span style={{ color: 'red' }}>*</span>Module</label><br /></div> {/* appear after class is selected  */}
            <Select
              style={{ width: '100%' }}
              onChange={handleModuleChange}
              placeholder="Please select module"
              options={moduleOptions}
              value={selectedModule}
              disabled={!selectedClass}
            />
          </Col>
        )}
        {selectedClass && selectedModule && (
          <Col span={6}>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 'bold' }}><span style={{ color: 'red' }}>*</span>Select report date</label></div> {/* appear after module and class is selected */}
            <RangePicker
              className='reset-date-picker-table-log-selector'
              onChange={handleReportDateChange}
            />
          </Col>
        )}
        {selectedClass && selectedModule && (
          <Col span={6}>
            <div style={{ marginBottom: '10px' }}><label style={{ fontWeight: 'bold' }}>Search</label></div>
            <Input placeholder='Select any thing with ease of time'
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            ></Input> {/* appear after module class and date picker is selected  */}
          </Col>
        )}
      </Row>
      {selectedClass && selectedModule && (
        <div className='table-CL'> {/* appear after module class and date picker is selected */}
          <div className='flex-info-tblog-container'>
            <div className='flex-info-tblog-ptag'>
              <p><strong>Class: </strong>{selectedClassName || "N/A"}</p>
            </div>
            <div className='flex-info-tblog-ptag'>
              <p><strong>Module: </strong>{selectedModuleName || "N/A"}</p>
            </div>
            <div className='flex-info-tblog-ptag'>
              <p><strong>Start Date: </strong>{reportStartDate?.toLocaleDateString() || "N/A"}</p>
            </div>
            <div className='flex-info-tblog-ptag'>
              <p><strong>End Date: </strong>{reportEndDate?.toLocaleDateString() || "N/A"}</p>
            </div>
          </div>
          <div className='table-log-main-container'>
            <Table
              columns={columnsChangeLogVer1}
              dataSource={filteredData}
              loading={loading}
              scroll={{ x: 1000, y: 'calc(100vh - 300px)' }}
              className='custom-table-header-tableFixed-tableLOG'
              bordered={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}; //END TableLOG
const ScheduleTrackerReport = () => {
  const [activeKey, setActiveKey] = useState("1");
  return (
    <div className='schedule-tracker-report-container'>
      <div className='header-schedule-tracker-report'>
        <h2 style={{ fontWeight: 'bold', color: "#374456" }}>Schedule Tracker</h2>
      </div>
      <Divider />
      <Tabs
        defaultActiveKey="1"
        centered
        className="custom-tab-table-schedule-tracker-report"
        onChange={(key) => setActiveKey(key)}
        items={[
          {
            label: 'Schedule Tracker',
            key: '1',
          },
          {
            label: 'Log',
            key: '2',
          },
        ]}
      />
      {activeKey === "1" && <TableCA />}
      {activeKey === "2" && <TableLOG />}
    </div>
  );
};
export default ScheduleTrackerReport;