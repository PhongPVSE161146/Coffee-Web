import React, { useState, useEffect } from 'react';
import { Layout, Col, Row, Select, Spin } from 'antd';
import Chart from 'react-apexcharts';
import './MouduleStatistic.css';
import { Typography } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { fetchData } from './ApiService/apiService';

const { Title } = Typography;
const { Option } = Select;

const Dashboard = () => {
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [data, setData] = useState({});
    const [statistic, setStatistic] = useState({});
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        try {
            const response = await fetchData();
            setData(response.data || {});
            setStatistic(response.data.statistic || {});
            setTrainers(response.data.trainers || []);
            setLoading(false);
        } catch (error) {
            //console.error("Error loading events:", error);
            setLoading(false);
        }
    };

    const handleTrainerChange = (value) => {
        const trainer = trainers.find(trainer => trainer.trainerId === value);
        setSelectedTrainer(trainer);
        setSelectedClass(trainer.classes[0]);
        setSelectedModule(trainer.classes[0].modules[0]);
    };

    const handleClassChange = (value) => {
        const classItem = selectedTrainer.classes.find(cls => cls.classId === value);
        setSelectedClass(classItem);
        setSelectedModule(classItem.modules[0]);
    };

    const handleModuleChange = (value) => {
        const moduleItem = selectedClass.modules.find(module => module.moduleId === value);
        setSelectedModule(moduleItem);
    };

    const deliveryOptions = {
        labels: selectedModule
            ? selectedModule.deliveryDistribution.map(item => item.deliveryType || "undefined")
            : [],
        colors: ['#34B3F15E', '#087BB3', '#08384F', '#3834F1', '#000', '#AFDDF4', '#D1E4F2'],
        legend: { show: false },
    };
    const deliverySeries = selectedModule ? selectedModule.deliveryDistribution.map(item => item.percentage) : [];

    const reportStatusDistribution = selectedModule ? selectedModule.reportStatusDistribution : [];
    let statusSeries = [];
    const statusOptions = {
        chart: {
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '20px',
                        color: '#000',
                        offsetY: 5,
                    },
                    value: {
                        fontSize: '18px',
                        color: '#000',
                        offsetY: 25,
                        formatter: function (value) {
                            if (value % 1 !== 0) {
                                return value.toFixed(2) + '%';
                            } else {
                                return value + '%';
                            }
                        }
                    },
                },
            },
        },
        stroke: {
            show: true,
            lineCap: 'round',
        },
        labels: ['On Going'],
        colors: ['#000000'],
    };

    const trueStatus = reportStatusDistribution.find(status => status.status === "true");
    statusSeries = trueStatus ? [trueStatus.percentage] : [0];

    const areAllSelected = selectedTrainer && selectedClass && selectedModule;

    return (
        <Layout className="layout">
            {loading ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <Spin size="large" />
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <Row gutter={16} style={{ marginBottom: '24px', }}>
                        {[
                            { title: "Total Trainer", icon: <UserOutlined />, value: statistic.totalTrainers },
                            { title: "Total Module", icon: <HomeOutlined />, value: statistic.totalModules },
                            { title: "Content", icon: <UserOutlined />, value: statistic.totalContents },
                            { title: "Duration (hour)", icon: <UserOutlined />, value: parseFloat(statistic.totalDuration).toFixed(2) },
                        ].map((stat, index) => (
                            <Col span={6} key={index}>
                                <div className="module-overview-card">
                                    <div className="overview-card-text">
                                        <div className="module-overview-title">{stat.value}</div>
                                        <div className="overview-card-text-1">{stat.title}</div>
                                    </div>
                                    <div className="overview-icon">{stat.icon}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>

                    <div className='statistic-module-select'>
                        <Select
                            onChange={handleTrainerChange}
                            style={{ width: '20%', marginBottom: '16px' }}
                            placeholder="Trainer"
                        >
                            {trainers.map(trainer => (
                                <Option key={trainer.trainerId} value={trainer.trainerId}>
                                    {trainer.trainerId}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            onChange={handleClassChange}
                            style={{ width: '20%', marginBottom: '16px' }}
                            disabled={!selectedTrainer}
                            value={selectedClass ? selectedClass.classId : undefined}
                            placeholder="Class"
                        >
                            {selectedTrainer && selectedTrainer.classes.map(cls => (
                                <Option key={cls.classId} value={cls.classId}>
                                    {cls.className}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            onChange={handleModuleChange}
                            style={{ width: '20%', marginBottom: '16px' }}
                            disabled={!selectedClass}
                            value={selectedModule ? selectedModule.moduleId : undefined}
                            placeholder="Module"
                        >
                            {selectedClass && selectedClass.modules.map(module => (
                                <Option key={module.moduleId} value={module.moduleId}>
                                    {module.moduleName}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {areAllSelected && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <div className="chart-card-1">
                                    <h3>Delivery Type Distribution</h3>
                                    {deliverySeries.length > 0 && deliverySeries.some(val => val > 0) ? (
                                        <Chart style={{ padding: '11%' }} options={deliveryOptions} series={deliverySeries} type="pie" />
                                    ) : (
                                        <div style={{display: "flex", justifyContent: 'center', padding: '20px', color: '#aaa', alignItems: 'center', fontSize: '20px', fontStyle: 'italic', height: '60%'}}>
                                            No Data is available
                                        </div>
                                    )}
                                </div>
                            </Col>

                            <Col span={12}>
                                <div className="chart-card-2">
                                    <h3>Report Status</h3>
                                    <Chart options={statusOptions} series={statusSeries} type="radialBar" />
                                </div>
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </Layout>
    );
};

export default Dashboard;
