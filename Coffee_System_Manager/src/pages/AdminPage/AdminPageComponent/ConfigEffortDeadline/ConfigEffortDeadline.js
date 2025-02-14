import { Table, Input, Button, Modal, Menu, Dropdown, DatePicker, TimePicker } from 'antd';
import React, { useState, useEffect } from 'react';
import './ConfigEffortDeadline.css';
import { CaretDownOutlined } from '@ant-design/icons';
import { showInfoNotification, showSuccessNotification } from '../../../../components/Notifications/Notifications';
import { fetchData, updateData } from './ApiServices/apiService';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const ConfigEffortDeadline = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [editingData, setEditingData] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [savedEdits, setSavedEdits] = useState(() => {
    const saved = localStorage.getItem('savedEdits');
    return saved ? JSON.parse(saved) : [];
  });
  const [isChanged, setIsChanged] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("Nov - 2024");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchData();

        if (response.success && response.data && response.data.length > 0) {
          const formattedData = response.data.map((item) => ({
            id: item.id.toString(),
            code: item.code || 'None',
            department: item.department || 'None',
            deadline: item.deadline || 'None',
            time: item.time ? formatTimeForDisplay(item.time) : 'None',
            description: item.description || 'None',
            lastModifiedDate: item.lastModifiedDate || 'None',
            lastModifiedBy: item.lastModifiedBy || 'None',
            checkpointMonth: item.checkpointMonth,
            checkpointYear: item.checkpointYear,
            configKey: item.configKey
          }));

          // Filter to keep only the first occurrence of each configKey
          const uniqueData = [];
          const seenKeys = new Set();

          formattedData.forEach(item => {
            if (!seenKeys.has(item.configKey)) {
              seenKeys.add(item.configKey);
              uniqueData.push(item);
            }
          });

          // Extract unique checkpoints
          const uniqueCheckpoints = Array.from(new Set(
            uniqueData.map(item => `${item.checkpointMonth}-${item.checkpointYear}`)
          )).map(checkpoint => {
            const [month, year] = checkpoint.split('-');
            return {
              month: parseInt(month),
              year: parseInt(year)
            };
          }).sort((a, b) => {
            // Sort by year first, then by month
            if (a.year !== b.year) return a.year - b.year;
            return a.month - b.month;
          });

          setCheckpoints(uniqueCheckpoints);

          // Set initial selected month
          if (uniqueCheckpoints.length > 0) {
            const firstCheckpoint = uniqueCheckpoints[0];
            setSelectedMonth(formatCheckpoint(firstCheckpoint.month, firstCheckpoint.year));
          }

          setFilteredData(uniqueData);
          setEditingData(uniqueData);
        }
      } catch (error) {
        //console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('savedEdits', JSON.stringify(savedEdits));
  }, [savedEdits]);

  const columns = [
    { title: 'No', render: (_, __, index) => index + 1, key: 'no', className: 'no-column' },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 300,
      render: (text) => text || 'None'
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (text) => text || 'None'
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (text, record, index) => {
        const dateString = editingData[index]?.deadline || text;
        const dateValue = dateString && dateString !== 'None' ? dayjs(dateString, 'YYYY-MM-DD') : null;
        return (
          <DatePicker
            value={dateValue && dateValue.isValid() ? dateValue : null}
            format="DD-MMM-YYYY"
            onChange={(date, dateString) => handleInputChange(dateString || 'None', index, 'deadline')}
            style={{
              width: '150px',
              height: '32px',
              backgroundColor: '#EEEEEE',
              border: '1px solid black',
            }}
            placeholder="None"
          />
        );
      },
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (text, record, index) => {
        const timeString = editingData[index]?.time || text;
        const timeValue = timeString && timeString !== 'None' ? dayjs(timeString, 'HH:mm') : null;
        return (
          <TimePicker
            className="time-column"
            value={timeValue && timeValue.isValid() ? timeValue : null}
            format="HH:mm"
            onChange={(time, timeString) => handleInputChange(timeString || 'None', index, 'time')}
            style={{
              width: '100px',
              height: '32px',
              backgroundColor: '#EEEEEE',
              border: '1px solid black',
              textAlign: 'right', // Align text to the right
            }}
            placeholder="HH:mm"
          />
        );
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record, index) => (
        <Input.TextArea
          value={editingData[index]?.description === 'None' ? '' : (editingData[index]?.description ?? text)}
          onChange={(e) => handleInputChange(e.target.value || 'None', index, 'description')}
          style={{
            width: '200px',
            height: '96px',
            backgroundColor: '#EEEEEE',
            border: '1px solid black',
          }}
          autoSize={{ minRows: 3, maxRows: 6 }}
          placeholder="None"
        />
      ),
    },
    {
      title: 'Last Modified Date',
      dataIndex: 'lastModifiedDate',
      key: 'lastModifiedDate',
      align: 'center',
      render: (text) => {
        if (!text || text === 'None') return 'None';
        return dayjs(text).format('DD-MM-YYYY');
      }
    },
    {
      title: 'Last Modified By',
      dataIndex: 'lastModifiedBy',
      key: 'lastModifiedBy',
      render: (text) => text || 'None'
    },
  ];

  // Handle input changes in the table
  const handleInputChange = (value, index, field) => {
    const newData = [...editingData];
    let formattedValue = value;

    if (field === 'time' && value !== 'None') {
      // Only format if it matches HH:mm pattern
      if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        formattedValue = value;
      } else if (value.length < 5) {
        // Allow partial input while typing
        formattedValue = value;
      } else {
        formattedValue = 'None';
      }
    } else if (field === 'deadline' && value !== 'None') {
      // Ensure the date is valid before setting it
      const dateValue = dayjs(value, 'DD-MMM-YYYY');
      if (dateValue.isValid()) {
        formattedValue = dateValue.format('YYYY-MM-DD'); // Store in API format
      } else {
        formattedValue = 'None';
      }
    }

    newData[index] = {
      ...newData[index],
      [field]: formattedValue,
    };
    setEditingData(newData);
    setIsChanged(true); // Ensure this is set to true when changes are made
  };

  const getMonthAbbreviation = (monthNumber) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthNumber - 1] || '';
  };

  // Function to format checkpoint display
  const formatCheckpoint = (month, year) => {
    return `${getMonthAbbreviation(month)} - ${year}`;
  };

  const handleSave = () => {
    setIsModalVisible(true);
  };

  const handleRewindChanges = () => {
    setEditingData(filteredData);
    setIsChanged(false);
  };

  // Modal handle
  const handleModalOk = async () => {
    setIsSaving(true); // Start loading

    try {
      const editedRecords = editingData.filter((curr, index) =>
        JSON.stringify(curr) !== JSON.stringify(filteredData[index])
      ).map(record => ({
        id: parseInt(record.id),
        code: record.code,
        department: record.department,
        deadline: record.deadline,
        time: formatTimeForAPI(record.time),
        description: record.description,
        checkpointMonth: record.checkpointMonth,
        checkpointYear: record.checkpointYear,
        lastModifiedDate: dayjs().tz('Asia/Bangkok').toISOString(), // Set to GMT+7
        lastModifiedBy: sessionStorage.getItem('username') || 'Unknown'
      }));

      if (editedRecords.length > 0) {
        const response = await updateData(editedRecords);
        if (response.success) {
          // Fetch the updated data
          const updatedData = await fetchData();

          // Filter to keep only the first occurrence of each configKey
          const uniqueUpdatedData = [];
          const seenKeys = new Set();

          updatedData.data.forEach(item => {
            if (!seenKeys.has(item.configKey)) {
              seenKeys.add(item.configKey);
              uniqueUpdatedData.push(item);
            }
          });

          // Update both filteredData and editingData with new unique data
          setFilteredData(uniqueUpdatedData);
          setEditingData(uniqueUpdatedData); // Ensure editingData is updated
          showSuccessNotification('Changes saved successfully');
          //console.log("edit",editedRecords);
          setIsModalVisible(false);
          setIsChanged(false);
        } else {
          showInfoNotification('Error saving changes: ' + response.message);
        }
      }
    } catch (error) {
      //console.error('Error saving changes:', error);
      showInfoNotification('Error saving changes');
    } finally {
      setIsSaving(false); // Stop loading regardless of outcome
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const clearSavedEdits = () => {
    setSavedEdits([]);
    localStorage.removeItem('savedEdits');
  };

  const rowClassName = (record) => {
    const today = dayjs().startOf('day'); // Get today's date at the start of the day
    const deadlineDate = dayjs(record.deadline, 'YYYY-MM-DD'); // Parse the deadline

    // Check if the deadline is before today
    if (deadlineDate.isValid() && deadlineDate.isBefore(today)) {
      return 'overlapping-row'; // Set color to #F5CCCC
    }

    // Check if LastModifiedBy is not null
    if (record.lastModifiedBy) {
      return 'edited-row'; // Set color to rgba(255, 204, 0, 0.4)
    }

    return ''; // No color for other cases
  };

  const menuItems = {
    items: checkpoints.map((checkpoint, index) => ({
      key: index,
      label: formatCheckpoint(checkpoint.month, checkpoint.year),
      onClick: () => setSelectedMonth(formatCheckpoint(checkpoint.month, checkpoint.year))
    }))
  };

  const formatTimeForDisplay = (timeString) => {
    if (timeString === 'None' || !timeString) return 'None';
    // Remove second
    if (timeString.includes(':')) {
      return timeString.substring(0, 5);
    }
    return timeString;
  };

  const formatTimeForAPI = (timeString) => {
    if (timeString === 'None' || !timeString) return 'None';
    // Add seconds if not present
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return `${timeString}:00`;
    }
    return timeString;
  };

  return (
    <div className='config-container'>
      <div className="config-header-container">
        <h1 className="statitics-text">Config Effort Deadline</h1>
        <div className="checkpoint-config">
          <h3>Checkpoint</h3>
          <Dropdown
            className='checkpoint-dropdown'
            menu={menuItems}
            trigger={['click']}
            disabled={checkpoints.length === 0}
          >
            <Button className="dropdown-button">
              <span className="dropdown-text">{selectedMonth}</span> <CaretDownOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>
      <div className="table-container">
        <Table
          className="config-table"
          columns={columns}
          dataSource={filteredData.map((item, index) => ({ ...item, key: item.id || index }))}
          bordered={false}
          pagination={false}
          rowClassName={rowClassName}
          scroll={{ x: 'max-content' }}
          loading={loading}
          rowStyle={(record, index) => index === 0 ? { backgroundColor: 'yellow' } : {}}
        />
      </div>
      <div className='option-config-container'>
        <div className='status-indicators'>
          <div className='status-item'>
            <div className='status-square' style={{ backgroundColor: 'rgba(255, 204, 0, 0.4)', width: '45px', height: '42px' }}></div>
            <h3>Edited</h3>
          </div>
          <div className='status-item'>
            <div className='status-square' style={{ backgroundColor: '#F5CCCC', width: '45px', height: '42px' }}></div>
            <h3>Deadline Overlapping</h3>
          </div>
        </div>

        {isChanged && (
          <div className='option-config-btn'>
            <Button className='cancel-btn' onClick={handleRewindChanges}>Cancel</Button>
            <Button className="save-btn" onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>

      <Modal
        title="Confirm Changes"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save"
        cancelText="Cancel"
        okButtonProps={{
          className: 'save-btn',
          loading: isSaving
        }}
        cancelButtonProps={{
          className: 'cancel-btn',
          disabled: isSaving
        }}
        className="config-modal"
      >
        <p>Are you sure you want to save these changes?</p>
      </Modal>
    </div>
  );
};