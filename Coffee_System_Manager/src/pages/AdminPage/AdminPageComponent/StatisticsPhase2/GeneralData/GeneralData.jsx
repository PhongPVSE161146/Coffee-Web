import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button, ConfigProvider, Select, Spin, Tag } from 'antd';
import './GeneralData.css';
import { Layout, Col, Row, DatePicker, message } from 'antd';
import { HomeOutlined, ToolFilled, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

// Mock data
const MOCK_DATA = {
  generalStats: {
    totalClasses: 150,
    totalTrainees: 450,
    totalTrainer: 25,
    totalTechnicalGroups: 6
  },

  traineeManagement: {
    months: [
      {
        month: "JAN",
        days: Array.from({ length: 31 }, (_, i) => ({
          day: i + 1,
          status: {
            ACTIVE: Math.floor(Math.random() * 100),
            ENROLLED: Math.floor(Math.random() * 80),
            DROP_OUT: Math.floor(Math.random() * 20),
            REJECTED: Math.floor(Math.random() * 10)
          }
        }))
      },
      // Thêm các tháng khác tương tự...
    ]
  },

  classDistribution: {
    totalClasses: 100,
    content: [
      { technicalGroup: "JAVA", numberClasses: 30 },
      { technicalGroup: ".NET", numberClasses: 25 },
      { technicalGroup: "iOS", numberClasses: 20 },
      { technicalGroup: "Android", numberClasses: 15 },
      { technicalGroup: "Frontend", numberClasses: 10 }
    ]
  },

  classStatus: {
    content: [
      { status: "In Progress", numberClasses: 45 },
      { status: "Completed", numberClasses: 35 },
      { status: "Planned", numberClasses: 20 }
    ]
  },

  technicalData: {
    year: {
      "2023": {
        moth: {
          "1": {
            day: {
              "1": {
                totalTraineePerTech: {
                  JAVA: 20,
                  "DOT_NET": 15,
                  IOS: 10,
                  EMBEDDED: 8
                },
                totalClassPerTech: {
                  JAVA: 2,
                  "DOT_NET": 2,
                  IOS: 1,
                  EMBEDDED: 1
                }
              }
            }
          }
        }
      }
    }
  }
};

const CONSTANTS = {
  STATUS_OPTIONS: ["ACTIVE", "ENROLLED", "DROP_OUT", "REJECTED"],
  TECH_OPTIONS: ["DOT_NET", "IOS", "JAVA", "EMBEDDED"],
  COLORS: {
    PRIMARY: ['#34B3F1', '#FFB845', '#F1343F', '#292D30'],
    DONUT: ['#292d30', '#00a0f3', '#ecfcff', '#2e4554', '#9baebc'],
    PIE: ['#34B3F1', '#0486c7', '#08384F', '#007777']
  }
};

const TraineeManagementChart = () => {
  // States
  const [data, setData] = useState(MOCK_DATA.traineeManagement);
  const [data4, setData4] = useState(MOCK_DATA.technicalData);
  const [data2, setData2] = useState(MOCK_DATA.classDistribution);
  const [data3, setData3] = useState(MOCK_DATA.classStatus);
  const [loading, setLoading] = useState(true);
  const [noDataDonut, setNoDataDonut] = useState(false);
  const [noDataPie, setNoDataPie] = useState(false);
  const [errorDataGraph, setErrorDataGraph] = useState(false);
  const [errorDataGraph2, setErrorDataGraph2] = useState(false);
  const [errorDataChart, setErrorDataChart] = useState(false);
  const [errorDataChart2, setErrorDataChart2] = useState(false);
  const [isDailyView, setIsDailyView] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("JAN");
  const [generaldata, setGeneraldata] = useState(MOCK_DATA.generalStats);
  const [isStudentView, setIsStudentView] = useState(true);
  const [isTechselect, setIsTechselect] = useState(false);
  const [activeStatBtn, setActiveStatBtn] = useState("allTime");
  const [activeStatBtn2, setActiveStatBtn2] = useState("allTime");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [dates2, setDates2] = useState({ startDate: null, endDate: null });
  const [selectedStatuses, setSelectedStatuses] = useState(CONSTANTS.STATUS_OPTIONS);
  const [selectedTech, setSelectedTech] = useState(["DOT_NET", "IOS"]);
  // Handlers
  const setTechSelect = (value) => {
    setIsTechselect(value);
  };

  const setStudentView = (value) => {
    setIsStudentView(value);
  };

  const filterDataByStatus = (values) => {
    if (values.length === 0) {
      message.warning("You must select at least one status");
      return;
    }
    setSelectedStatuses(values);
  };

  const filterDataByTech = (values) => {
    if (values.length === 0) {
      message.warning("You must select at least one technology");
      return;
    }
    setSelectedTech(values);
  };

  const handleStartDateChange = (date) => {
    setDates((prev) => ({ ...prev, startDate: date ? dayjs(date).format('YYYY-MM-DD') : null }));
  };

  const handleEndDateChange = (date) => {
    if (dates.startDate && date) {
      if (dayjs(date).isAfter(dayjs(dates.startDate))) {
        setDates((prev) => ({ ...prev, endDate: dayjs(date).format('YYYY-MM-DD') }));
      } else {
        message.error('End Date must be after Start Date');
      }
    } else if (!dates.startDate) {
      message.warning('Please select Start Date first');
    }
  };

  const handleStartDateChange2 = (date) => {
    setDates2((prev) => ({ ...prev, startDate: date ? dayjs(date).format('YYYY-MM-DD') : null }));
  };

  const handleEndDateChange2 = (date) => {
    if (dates2.startDate && date) {
      if (dayjs(date).isAfter(dayjs(dates2.startDate))) {
        setDates2((prev) => ({ ...prev, endDate: dayjs(date).format('YYYY-MM-DD') }));
      } else {
        message.error('End Date must be after Start Date');
      }
    } else if (!dates2.startDate) {
      message.warning('Please select Start Date first');
    }
  };

  // Effects
  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      setNoDataDonut(false);
      setErrorDataChart(false);
      // Simulate API call with mock data
      setData2(MOCK_DATA.classDistribution);
    }
  }, [dates]);

  useEffect(() => {
    if (dates2.startDate && dates2.endDate) {
      setNoDataPie(false);
      setErrorDataChart2(false);
      // Simulate API call with mock data
      setData3(MOCK_DATA.classStatus);
    }
  }, [dates2]);

  const loadEvents = () => {
    setLoading(true);
    try {
      // Simulate API calls with mock data
      setData(MOCK_DATA.traineeManagement);
      setData4(MOCK_DATA.technicalData);
      setGeneraldata(MOCK_DATA.generalStats);
      setData2(MOCK_DATA.classDistribution);
      setData3(MOCK_DATA.classStatus);
      setActiveStatBtn("allTime");
      setActiveStatBtn2("allTime");
    } catch (error) {
      message.error("Error loading data");
      setErrorDataGraph(true);
      setErrorDataGraph2(true);
      setErrorDataChart(true);
      setErrorDataChart2(true);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = (buttonType) => {
    setErrorDataGraph(false);
    setActiveStatBtn2(buttonType);
    // Simulate different data based on button type
    setData4(MOCK_DATA.technicalData);
  };

  // Chart Configurations
  const donutChartOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: false },
    },
    labels: data2.content.map(item => item.technicalGroup),
    colors: CONSTANTS.COLORS.DONUT,
    series: data2.content.map(item => item.numberClasses),
    legend: {
      show: false,
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${Math.round(val)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => data2.totalClasses,
            }
          }
        }
      }
    }
  };

  const pieChartOptions = {
    chart: {
      type: 'pie',
      toolbar: { show: false }
    },
    labels: data3.content.map(item => item.status),
    colors: CONSTANTS.COLORS.PIE,
    series: data3.content.map(item => item.numberClasses),
    legend: {
      show: false,
      position: 'bottom'
    }
  };

  const lineChartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: true },
      zoom: { enabled: true }
    },
    stroke: {
      width: 9,
      curve: 'smooth'
    },
    colors: CONSTANTS.COLORS.PRIMARY,
    series: selectedStatuses.map(status => ({
      name: status,
      data: MOCK_DATA.traineeManagement.months[0].days.map(day => day.status[status])
    })),
    xaxis: {
      type: 'datetime',
      categories: MOCK_DATA.traineeManagement.months[0].days.map(day => 
        new Date(2023, 0, day.day).getTime()
      )
    }
  };

  return (
    <Layout className="layout">
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            {[
              { title: "Tổng đơn hàng", icon: <HomeOutlined />, value: generaldata.totalClasses },
              { title: "", icon: <UserOutlined />, value: generaldata.totalTrainees },
              { title: "Total Trainer", icon: <UserOutlined />, value: generaldata.totalTrainer },
              { title: "Technical Groups", icon: <ToolFilled />, value: generaldata.totalTechnicalGroups }
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

          {/* Charts Section */}
          <Row gutter={16}>
            <Col span={16}>
              <div style={{ width: '100%' }}>
                <h2>Doanh Thu</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Status"
                    style={{ width: '200px' }}
                    value={selectedStatuses}
                    onChange={filterDataByStatus}
                  >
                    {CONSTANTS.STATUS_OPTIONS.map(status => (
                      <Select.Option key={status} value={status}>{status}</Select.Option>
                    ))}
                  </Select>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {['yearToDate', '1year', 'allTime'].map(type => (
                      <Button
                        key={type}
                        className={`statistic-btn ${activeStatBtn === type ? 'active' : ''}`}
                        onClick={() => setActiveStatBtn(type)}
                      >
                        {type === 'yearToDate' ? 'Year to Date' : type === '1year' ? '1 Year' : 'All Time'}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {errorDataGraph ? (
                  <div className='error-fetching'>Error Loading Graph</div>
                ) : (
                  <ReactApexChart 
                    options={lineChartOptions} 
                    series={lineChartOptions.series} 
                    type="line" 
                    height={320} 
                  />
                )}
              </div>
            </Col>

            <Col span={8}>
              <div className="chart-card-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 60px' }}>
                  <DatePicker
                    placeholder="Start Date"
                    onChange={handleStartDateChange}
                    value={dates.startDate ? dayjs(dates.startDate) : null}
                  />
                  <DatePicker
                    placeholder="End Date"
                    onChange={handleEndDateChange}
                    value={dates.endDate ? dayjs(dates.endDate) : null}
                  />
                </div>
                
                {errorDataChart ? (
                  <div className='error-fetching'>Error Loading Chart</div>
                ) : noDataDonut ? (
                  <h3 style={{ textAlign: 'center', opacity: 0.4 }}>No Data Available</h3>
                ) : (
                  <ReactApexChart 
                    options={donutChartOptions} 
                    series={donutChartOptions.series} 
                    type="donut" 
                  />
                )}
                <p>Class Distribution of Technical Groups</p>
              </div>
            </Col>
          </Row>

          {/* Additional Charts Section */}
          <Row gutter={16}>
            <Col span={16}>
              {/* Technical Management Chart */}
            </Col>
            <Col span={8}>
              {/* Pie Chart */}
            </Col>
          </Row>
        </>
      )}
    </Layout>
  );
};

export default TraineeManagementChart;