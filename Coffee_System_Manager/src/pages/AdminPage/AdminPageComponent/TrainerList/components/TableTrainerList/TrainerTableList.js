import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Table, Tag, Pagination, Row, Col, Spin, notification, Select, message } from 'antd';
import { useParams } from 'react-router-dom';
import './TrainerTable.css';
import FilterTrainerList from '../FilterTrainerList/FilterTrainerList';
import { DeleteOutlined } from '@ant-design/icons';



// Set up axios instance with base URL and headers
export const axiosInstance = axios.create({
    baseURL:
        'http://fams-api.ap-northeast-1.elasticbeanstalk.com/api/v2',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add token to request headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const TrainerTable = ({ onTrainerSelect, authToken }) => {
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({ status: [], site: [], searchTerm: '', skill: [] });

    // Fetch trainers on component mount
    useEffect(() => {
        const fetchTrainers = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/trainer/get-all');

                if (response.status === 200 && response.data.success) {
                    const trainers = response.data.data.map((trainer, index) => ({
                        key: trainer.id,
                        no: index + 1,
                        fullName: trainer.name,
                        account: trainer.account,
                        email: trainer.email,
                        type: trainer.type,
                        site: trainer.site || "N/A",
                        jobRank: trainer.jobRank,
                        trainerCert: trainer.trainTheTrainerCert || 'None',
                        professionalLevel: trainer.professionalLevel || 'Unknown',
                        active: trainer.status || '',
                        action: (trainer.registeredSkills || []).join(', ') || 'None',
                        skill: (trainer.registeredSkills || []).join(', ') || 'None'
                    }));

                    notification.success({
                        message: 'Success',
                        description: 'Data retrieved successfully',
                    });
                    setDataSource(trainers);
                    setFilteredData(trainers);

                } else {
                    throw new Error(`API response error: ${response.data.message || 'Unexpected response format'}`);
                }
            } catch (error) {
                //console.error('Error fetching trainers:', error);
                notification.error({
                    message: 'Fetch Error',
                    description: error.message || 'Failed to fetch trainers. Please check your network or try again later.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTrainers();
    }, []);

    // Apply filters when the filter state or data source changes
    useEffect(() => {
        applyFilters();
    }, [filter, dataSource]);

    // Handle trainer selection
    const handleTrainerClick = (trainerID) => {
        onTrainerSelect(trainerID);
    };

    // Function to apply filters
    const applyFilters = () => {
        const { status, site, searchTerm, skill } = filter;
        const filtered = dataSource.filter((trainer) => {
            const statusMatch = status.length === 0 || status.includes(trainer.active) || status.includes("N/A");
            const siteMatch = site.length === 0 || site.includes(trainer.site);
            const skillMatch = skill.length === 0 || skill.some((sk) => trainer.skill.includes(sk));
            const searchTermLower = searchTerm.toLowerCase();

            const searchMatch =
                trainer.fullName.toLowerCase().includes(searchTermLower) ||
                trainer.account.toLowerCase().includes(searchTermLower) ||
                (trainer.email && trainer.email.toLowerCase().includes(searchTermLower));

            return statusMatch && siteMatch && skillMatch && searchMatch;
        });
        setFilteredData(filtered);
    };
    // Function to handle trainer deletion
    // Function to handle trainer deletion (local state update only)
    const handleDeleteTrainer = (trainerID) => {
        // Remove the selected trainer from dataSource and filteredData
        const updatedDataSource = dataSource.filter(trainer => trainer.key !== trainerID);
        const updatedFilteredData = filteredData.filter(trainer => trainer.key !== trainerID);

        setDataSource(updatedDataSource);
        setFilteredData(updatedFilteredData);

        notification.success({
            message: 'Success',
            description: 'Trainer deleted successfully from the list.',
        });
    };



    // Handle filter changes
    const handleFilterChange = (filterCriteria) => {
        setFilter((prevFilter) => ({ ...prevFilter, ...filterCriteria }));
    };

    // Pagination data
    const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Define table columns
    const columns = [
        { title: 'No.', dataIndex: 'no', key: 'no', width: '80px', fixed: 'left' },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '200px',
            render: (text, record) => <a onClick={() => handleTrainerClick(record.account)}>{text}</a>,
        },
        { title: 'FPT Account', dataIndex: 'account', key: 'account', width: '150px' },
        { title: 'Type', dataIndex: 'type', key: 'type', width: '90px' },
        { title: 'Site', dataIndex: 'site', key: 'site', width: '90px' },
        { title: 'Job Rank', dataIndex: 'jobRank', key: 'jobRank', width: '140px' },
        { title: 'Train The Trainer Cert', dataIndex: 'trainerCert', key: 'trainerCert', width: '150px' },
        { title: 'Professional Level', dataIndex: 'professionalLevel', key: 'professionalLevel', width: '150px' },
        { title: 'Skill', dataIndex: 'skill', key: 'skill', width: '140px' },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            width: '90px',
            render: (active) => {
                let color = '';
                switch (active) {
                    case '':
                        active = 'N/A'
                        color = 'green';
                        break;
                    case 'Busy':
                        color = 'yellow';
                        break;
                    case 'Out':
                        color = 'red';
                        break;
                    case 'Onsite':
                        color = 'gray';
                        break;
                    case 'Unavailable':
                        color = 'red';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color}>{active}</Tag>;
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: '130px',
            fixed: 'right',
            render: (text, record) => (
                <span>
                    <a
                        style={{ color: 'red', marginLeft: 12 }}
                        onClick={() => handleDeleteTrainer(record.key)}
                    >
                        <DeleteOutlined />
                    </a>
                </span>
            ),
        }

    ];

    // Handle page change
    const handlePageChange = (page, size) => {
        setCurrentPage(page);
        setPageSize(size);
    };

    return (
        <div className="TrainerTableContainer">


            {loading ? (
                <div className="SpinContainer" style={{ marginLeft: 550, paddingTop: 200 }}>
                    <Spin size="large" />
                </div>
            ) : (

                <div className="TableContainer">
                    <FilterTrainerList onFilterChange={handleFilterChange} />
                    <Table
                        columns={columns}
                        dataSource={paginatedData}
                        pagination={false}
                        bordered
                    // scroll={{ x: 1200 }}
                    />
                    {filteredData.length === 0 && <p>No trainers available.</p>}
                    <Row
                        justify="space-between"
                        align="middle"
                        style={{
                            marginTop: 35,

                        }}
                    >
                        <Col style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: 5, marginLeft: 20 }}>Items per page:</div>
                            <Select
                                defaultValue={5}
                                onChange={(value) => handlePageChange(1, value)}
                                style={{ width: 100, marginRight: 16 }}
                                options={[
                                    { value: 5, label: '5' }, //page number             
                                    { value: 10, label: '10' },
                                    { value: 15, label: '15' },
                                ]}
                            />
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredData.length}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                            />
                        </Col>
                    </Row>

                </div>
            )}
        </div>
    );
};

export default TrainerTable;
