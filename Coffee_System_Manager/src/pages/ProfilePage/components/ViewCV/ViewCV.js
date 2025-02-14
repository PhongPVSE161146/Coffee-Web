import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, message, Spin } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import { fetchHistoryData } from './ApiService/ApiService';
import dayjs from 'dayjs';
import './ViewCV.css';
import { showErrorNotification } from '../../../../components/Notifications/Notifications';

const { Option } = Select;

export const ViewCV = () => {
  const [minimized, setMinimized] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const [fileTypeFilter, setFileTypeFilter] = useState(null);
  const [actionFilter, setActionFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cvHistory, setCvHistory] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [uniqueActions, setUniqueActions] = useState([]);

  useEffect(() => {
    fetchCVHistory();
  }, []);

  const fetchCVHistory = async () => {
    try {
      const response = await fetchHistoryData();
      // Check if response has the expected structure
      if (response?.data?.success && Array.isArray(response.data.data)) {
        // Transform API data to match table structure
        const transformedData = response.data.data.map((item) => ({
          id: item.id,
          cvVersion: `CV_${item.version}`,
          modificationDate: dayjs(item.datetime).format('DD-MM-YYYY'),
          linkCV: item.linkCV,
          action: item.action,
          rawDate: item.datetime // Keep raw date for sorting if needed
        }));

        // Extract unique dates and actions from the API response
        const dates = [...new Set(transformedData.map(item => item.modificationDate))].sort();
        const actions = [...new Set(response.data.data.map(item => item.action))];

        setUniqueDates(dates);
        setUniqueActions(actions);
        setCvHistory(transformedData);
      } else {
        throw new Error('Invalid data structure received from server');
      }
    } catch (error) {
      message.error('Failed to fetch CV history');
      //console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'No',
      render: (_, __, index) => index + 1,
      key: 'no',
      align: 'center'
    },
    {
      title: 'CV Version',
      dataIndex: 'cvVersion',
      key: 'cvVersion',
      align: 'center',
      render: (text, record) => {
        const handleClick = (e) => {
          //console.log('Link clicked:', record.linkCV);
          if (!record.linkCV) {
            e.preventDefault(); // Prevent the default link behavior
            showErrorNotification('No CV link for download');
          }
        };

        return (
          <a href={record.linkCV || '#'} onClick={handleClick} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        );
      },
    },
    {
      title: 'Modification Date',
      dataIndex: 'modificationDate',
      key: 'modificationDate',
      align: 'center',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
    },
  ];

  const getFilteredData = () => {
    return cvHistory.filter(item => {
      const dateMatch = !dateFilter || item.modificationDate === dateFilter;
      const actionMatch = !actionFilter || item.action === actionFilter;
      return dateMatch && actionMatch;
    }).slice(0, 3);
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="cv-table">
      <Card
        className={`minimizable-card ${minimized ? 'minimized' : ''}`}
        extra={
          <Button
            type="text"
            icon={minimized ? <CaretDownOutlined /> : <CaretUpOutlined />}
            onClick={() => setMinimized(!minimized)}
          />
        }
      >
        {!minimized && (
          <>
            {/* <div className="filters-container">
              <div className="filter-group">
                <div className="filter-label">Date</div>
                <Select
                  placeholder="Select Date"
                  className="filter-select"
                  onChange={(value) => setDateFilter(value)}
                  allowClear
                >
                  {uniqueDates.map(date => (
                    <Option key={date} value={date}>{date}</Option>
                  ))}
                </Select>
              </div>

              <div className="filter-group">
                <div className="filter-label">File Type</div>
                <Select
                  placeholder="Select File Type"
                  className="filter-select"
                  onChange={(value) => setFileTypeFilter(value)}
                  allowClear
                  disabled // Disabled since it's not in use
                >
                  <Option value="pdf">PDF</Option>
                  <Option value="doc">DOC</Option>
                </Select>
              </div>

              <div className="filter-group">
                <div className="filter-label">Action</div>
                <Select
                  placeholder="Select Action"
                  className="filter-select"
                  onChange={(value) => setActionFilter(value)}
                  allowClear
                >
                  {uniqueActions.map(action => (
                    <Option key={action} value={action}>{action}</Option>
                  ))}
                </Select>
              </div>
            </div> */}

            <Table
              className="cv-version-table"
              rowKey="id"
              columns={columns}
              dataSource={getFilteredData()}
              pagination={false}
            />
          </>
        )}
      </Card>
    </div>
  );
};