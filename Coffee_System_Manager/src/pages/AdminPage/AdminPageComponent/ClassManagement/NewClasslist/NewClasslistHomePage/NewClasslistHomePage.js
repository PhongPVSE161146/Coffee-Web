import React, { useEffect, useState } from 'react';
import { Input, DatePicker, Select, Table, Spin, Row, Col, Pagination } from 'antd';
import './NewClasslistHomePage.css';
import { useNavigate } from 'react-router-dom';
import { fetchData } from './ApiServices/apiService';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;

export const NewClasslistHomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [startDateFilter, setStartDateFilter] = useState(null);
  const [endDateFilter, setEndDateFilter] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    loadClass();
  }, []);

  useEffect(() => {
    if (data.length) {
      const statuses = [...new Set(data.map(item => item.status).filter(status => status))];
      setStatusOptions(statuses);
    }
  }, [data]);

  const loadClass = async () => {
    try {
      const response = await fetchData();
      const processedData = response.data.map(item => ({
        ...item,
        classAdmin: item.classAdmin ? item.classAdmin.replace(/,\s*$/, '') : 'None'
      }));
      setData(processedData);
      setFilteredData(processedData);
      setLoading(false);
    } catch (error) {
      //console.error("Error loading events:", error);
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(filteredData.map((item) => item.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const handleRowSelection = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const columns = [
    { title: 'No', render: (_, __, index) => index + 1, key: 'no' },
    {
      title: 'Class Code', dataIndex: 'classCode', key: 'classCode',
      render: (text, record) => (
        <a  className='hover-claslist-name' onClick={() => handleClassDetailClick(record.id)}>
          {text}
        </a>
      ),
    },
    { title: 'Trainee Type', dataIndex: 'traineeType', key: 'traineeType', render: text => text || 'None' },
    { title: 'Class Admin', dataIndex: 'classAdmin', key: 'classAdmin', render: text => text || 'None' },
    { title: 'Technical Group', dataIndex: 'technicalGroup', key: 'technicalGroup', render: text => text || 'None' },
    { title: 'Training Program', dataIndex: 'trainingProgram', key: 'trainingProgram', render: text => text || 'None' },
    { title: 'Site', dataIndex: 'site', key: 'site', render: text => text || 'None' },
    { title: 'Planned Trainee', dataIndex: 'plannedTraineeNo', key: 'plannedTraineeNo', render: text => text || 'None' },
    { title: 'Actual Trainee', dataIndex: 'actualTraineeNo', key: 'actualTraineeNo', render: text => text || 'None' },
    { title: 'Expected Start Date', dataIndex: 'expectedStartDate', key: 'expectedStartDate', render: (value) => (value ? dayjs(value).format('DD-MMM-YYYY') : null), },
    { title: 'Expected End Date', dataIndex: 'expectedEndDate', key: 'expectedEndDate', render: (value) => (value ? dayjs(value).format('DD-MMM-YYYY') : null), },
    { title: 'Master Trainer', dataIndex: 'masterTrainer', key: 'masterTrainer', render: text => text || 'None' },
    { title: 'Status', dataIndex: 'status', key: 'status', fixed: 'right', },
  ];

  const handleClassDetailClick = (id) => {
    window.scrollTo(0, 0);
    const role = sessionStorage.getItem("selectedRole");
    if (role === 'admin') navigate(`/adminPage/classDetail/${id}`);
    if (role === 'trainer') navigate(`/trainerPage/classDetail/${id}`);
    if (role === 'deliverymanager') navigate(`/DeliveryManagerPage/classDetail/${id}`);
    if (role === 'FAMadmin') navigate(`/FAMAdminPage/classDetail/${id}`);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value || '');
  };
  const handleStartDateChange = (date) => {
    setStartDateFilter(date);
  };

  const handleEndDateChange = (date) => {
    setEndDateFilter(date);
  };

  const handleSearchChange = (e) => {
    setSearchFilter(e.target.value);
  };

  useEffect(() => {
    let filtered = data;

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        (item.status || '').toLowerCase() === statusFilter.toLowerCase() // Default to '' if item.status is null
      );
    }

    if (startDateFilter && endDateFilter) {
      const start = dayjs(startDateFilter).startOf('day');
      const end = dayjs(endDateFilter).endOf('day');

      filtered = filtered.filter(item => {
        const itemStartDate = dayjs(item.expectedStartDate);
        const itemEndDate = dayjs(item.expectedEndDate);

        return itemStartDate.isSameOrAfter(start) && itemEndDate.isSameOrBefore(end);
      });
    }

    if (searchFilter) {
      filtered = filtered.filter(item => 
        (item.classCode || '').toLowerCase().includes(searchFilter.toLowerCase()) // Default to '' if item.classCode is null
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, startDateFilter, endDateFilter, searchFilter, data]);

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Loading...</p>
        </div>
      ) : (
        <div className='newclasslist-container'>
          <h1 className="statitics-text">Class List</h1>

          <div className='newclasslist-content'>
            {/* Filters */}
            <div className="newclasslist-filters">
              <div>
                <div className="newclasslist-filter-title">Status</div>
                <Select placeholder="Status" className="newclasslist-select-status" onChange={handleStatusChange}>
                  <Option value="all">Select All</Option>
                  {statusOptions.map((status) => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <div className="newclasslist-filter-title">Start Date</div>
                <DatePicker className="newclasslist-date-input" placeholder="Select Start Date" onChange={handleStartDateChange} />
              </div>
              <div>
                <div className="newclasslist-filter-title">End Date</div>
                <DatePicker className="newclasslist-date-input" placeholder="Select End Date" onChange={handleEndDateChange} />
              </div>
              <div>
                <div className="newclasslist-filter-title">Search</div>
                <Input placeholder="Search by Class Code" className="newclasslist-search-input" onChange={handleSearchChange} />
              </div>
            </div>

            {/* Table */}
            <Table
              className="newclasslist-table"
              columns={columns}
              dataSource={paginatedData}
              pagination={false}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: handleRowSelection,
              }}
            />
            <Row justify="flex-start" align="middle" style={{ marginTop: 16 }}>
              <Col>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 5 }}>Items per page:</span>
                  <Select
                    defaultValue={5}
                    onChange={(value) => handlePageChange(1, value)}
                    style={{ width: 100 }}
                    options={[
                      { value: 5, label: '5' },
                      { value: 10, label: '10' },
                      { value: 15, label: '15' },
                    ]}
                  />
                </div>
              </Col>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                style={{ margin: '16px 0' }}
              />
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default NewClasslistHomePage;
