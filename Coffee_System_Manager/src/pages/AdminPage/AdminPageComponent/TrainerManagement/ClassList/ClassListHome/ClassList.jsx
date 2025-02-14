import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Select, Table, Button, Card, Tag } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import './ClassList.css';
import Loading from '../../../../../../components/Loading/Loading';
import { axiosInstance } from '../../../../../../axios/Axios';



const { Option } = Select;

export const ClassList = () => {
  const [status, setStatus] = useState('');
  const [className, setClassName] = useState('');
  const [module, setModule] = useState('');
  const [tableData, setTableData] = useState({});
  const [minimizedTables, setMinimizedTables] = useState('minimized');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  const roleConfigs = {
    trainer: {
      path: sessionStorage.getItem("username"),
    },
    admin: {
      path: sessionStorage.getItem("accounttrainer"),
    },
    // Add more roles here in the future
  };

  const role = sessionStorage.getItem("selectedRole");
  const { path } = roleConfigs[role] || {};



  useEffect(() => {
    fetchData();
    //console.log("Fetching data for role:", role); // Debugging log
    //console.log("Path:", path);
  }, []);


  const fetchData = async () => {
    setLoading(true); // Move loading state here for both roles
    try {
      const response = await axiosInstance.get(`/trainer/get-info/${path}`);
      const organizedData = {};
      response.data.data.trainerClassList.forEach(classItem => {
        organizedData[classItem.className] = classItem.modules.map(module => ({
          id: module.id,
          moduleName: module.moduleName,
          endDate: module.endDate,
          startDate: module.startDate,
          status: module.status,
        }));
      });

      const minimizedState = Object.keys(organizedData).reduce((acc, className) => {
        acc[className] = true; // Set each class to minimized (true)
        return acc;
      }, {});

      setTableData(organizedData);
      setMinimizedTables(minimizedState);
    } catch (error) {
      //console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleStatusChange = (value) => {
    setStatus(value || '');
  };

  const handleModuleDetailClick = (id) => {
    window.scrollTo(0, 0);

    if (role === 'admin')
      navigate(`/adminPage/moduleDetail/${id}`);
    if (role === 'trainer')
      navigate(`/trainerPage/moduleDetail/${id}`);
  };

  const toggleTable = (className) => {
    setMinimizedTables(prev => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  const filteredData = Object.entries(tableData)
    .filter(([classNameKey, modules]) =>
      (classNameKey.toLowerCase().includes(className.toLowerCase())) &&  // Filter className
      (status === '' || modules.some(item => item.status === status))  // Filter by status
    )
    .map(([classNameKey, modules]) => [
      classNameKey,
      modules.filter(item => item.moduleName.toLowerCase().includes(module))  // Filter modules
    ])
    .filter(([classNameKey, modules]) => modules.length > 0); // Exclude classes with no matching modules

  const columns = [
    {
      title: 'No.',
      key: 'no',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Module',
      dataIndex: 'moduleName',
      key: 'moduleName',
      render: (text, record) => (
        <a onClick={() => handleModuleDetailClick(record.id)}>
          {text}
        </a>
      ),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'gray';
        if (status === 'Not Started') color = 'yellow';
        if (status === 'In Progress') color = 'green';
        if (status === 'Cancel') color = 'red';
        return <Tag className='drop-opt' color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <>


      <div className="class-list-container">
        <div className="input-group">
          <label className="fil-title">Class Name</label>
          <Input
            placeholder="Enter class name"
            onChange={e => setClassName(e.target.value)}
            allowClear
          />
        </div>
        <div className="input-group">
          <label className="fil-title">Module</label>
          <Input
            placeholder="Enter module"
            onChange={e => setModule(e.target.value.toLowerCase())}
            allowClear
          />
        </div>
        <div className="input-group">
          <label className="fil-title">Status</label>
          <Select
            className="status-select"
            onChange={handleStatusChange}
            value={status}
            allowClear
          >
            <Option value="Cancel">
              <Tag className='drop-opt' color="red">Cancel</Tag>
            </Option>
            <Option value="Not Started">
              <Tag className='drop-opt' color="yellow">Not Started</Tag>
            </Option>
            <Option value="Closed">
              <Tag className='drop-opt' color="gray">Closed</Tag>
            </Option>
            <Option value="In Progress">
              <Tag className='drop-opt' color="green">In Progress</Tag>
            </Option>
          </Select>
        </div>
      </div>
      {loading ? (
        <Loading isLoading={loading} />
      ) : (<>
        {filteredData.map(([classNameKey, modules]) => (
          <div className="classlist-table" key={classNameKey} onClick={() => toggleTable(classNameKey)}>
            <Card
              className={`minimizable-card ${minimizedTables[classNameKey] ? 'minimized' : ''}`}
              title={classNameKey}
              extra={
                <Button
                  type="text"
                  icon={minimizedTables[classNameKey] ? <CaretDownOutlined /> : <CaretUpOutlined />}

                />
              }
            >
              {!minimizedTables[classNameKey] && (
                <Table
                  className="class-table"
                  rowKey="id"
                  columns={columns}
                  dataSource={modules}
                  pagination={false}
                />
              )}
            </Card>
          </div>
        ))}

      </>
      )}


    </>
  );
};

export default ClassList;
