import React, { useState, useEffect } from 'react';
import "./TraineeList.css";
import { fetchData } from '../ApiService/apiService';
import { Table, Tag } from 'antd';
import { Outlet } from 'react-router-dom';

const TraineeList = () => {
  const name = sessionStorage.getItem("classcode");
  const [data, setData] = useState({});
  const path = name;

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await fetchData(path);
      setData(response.data || {});
    } catch (error) {
      //console.error("Error loading events:", error);
    }
  };
  //console.log(data.traineeList)

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'FPT Account',
      dataIndex: 'fptAccount',
      key: 'fptAccount',
    },
    {
      title: 'Personal Email',
      dataIndex: 'personalEmail',
      key: 'personalEmail',
    },
    {
      title: 'National ID',
      dataIndex: 'nationalId',
      key: 'nationalId',
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
    },
    {
      title: 'Access Card ID',
      dataIndex: 'accessCardId',
      key: 'accessCardId',
    },
    {
      title: 'DOB',
      dataIndex: 'dob',
      key: 'dob',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'volcano'}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
    <div className='trainee-content'>
      <Table
        dataSource={data.traineeList}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      <Outlet />
    </div>
  );
};

export default TraineeList;