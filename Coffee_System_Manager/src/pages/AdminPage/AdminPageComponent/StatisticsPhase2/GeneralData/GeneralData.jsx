import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Button, ConfigProvider, Select, Spin, Tag } from 'antd';
import './GeneralData.css';
import { Layout, Col, Row, DatePicker, message } from 'antd';
import { HomeOutlined, ToolFilled, UserOutlined } from '@ant-design/icons';
import { fetchData, fetchData2, fetchData3, fetchData4 } from './ApiService/apiService';
import dayjs from 'dayjs';
import shadows from '@mui/material/styles/shadows';
import { showErrorNotification } from '../../../../../components/Notifications/Notifications';

const TraineeManagementChart = () => {
  const [data, setData] = useState([]);
  const [data4, setData4] = useState({});
  const [data2, setData2] = useState({});
  const [data3, setData3] = useState({});
  const [loading, setLoading] = useState(true);
  const [noDataDonut, setNoDataDonut] = useState(false);
  const [noDataPie, setNoDataPie] = useState(false);
  const [errorDataGraph, setErrorDataGraph] = useState(false);
  const [errorDataGraph2, setErrorDataGraph2] = useState(false);
  const [errorDataChart, setErrorDataChart] = useState(false);
  const [errorDataChart2, setErrorDataChart2] = useState(false);
  const [isDailyView, setIsDailyView] = useState(false);
  const [filteredData, setFilteredData] = useState(data || []);
  const [selectedMonth, setSelectedMonth] = useState("JAN");
  const [generaldata, setGeneraldata] = useState({})
  const oneYear = 'false';
  const allTime = 'true';
  const yearToDate = 'false';
  const [isStudentView, setIsStudentView] = useState(true);
  const [isTechselect, setIsTechselect] = useState(false);
  const [activeStatBtn, setActiveStatBtn] = useState("allTime");
  const [activeStatBtn2, setActiveStatBtn2] = useState("allTime");
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [dates2, setDates2] = useState({ startDate: null, endDate: null });
  const name = sessionStorage.getItem("username");
  const path = name;

  const [selectedStatuses, setSelectedStatuses] = useState(["ACTIVE", "ENROLLED", "DROP_OUT", "REJECTED"]);
  const [selectedTech, setSelectedTech] = useState(["DOT_NET", "IOS"]);

  const setTechSelect = (value) => {
    setIsTechselect(value);
  };

  const setStudentView = (value) => {
    setIsStudentView(value);
  };

  const filterDataByStatus = (values) => {
    setSelectedStatuses(values);
    const filteredData = transformData(data, filterOption, selectedStatuses);
    // Bạn có thể gọi transformData hoặc bất kỳ logic nào khác sau khi trạng thái thay đổi
  };

  const filterDataByTech = (values) => {
    setSelectedTech(values);
    const filteredData = transformDataForNewChart(data4, filterOption, selectedStatuses);
    // Bạn có thể gọi transformData hoặc bất kỳ logic nào khác sau khi trạng thái thay đổi
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
      setDates((prev) => ({ ...prev, endDate: null }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (dates.startDate && dates.endDate) {
        setNoDataDonut(false); setErrorDataChart(false);
        try {
          const response3 = await fetchData3(dates.startDate, dates.endDate, path);
          if (response3.data.totalClasses === 0) { setNoDataDonut(true); }
          setData2(response3.data || {});
        } catch (error) {
          setErrorDataChart(true);
          ////console.error('Error fetching data:', error);
          message.error('Failed to fetch data. Please try again.');
        }
      }
    };

    fetchData();
  }, [dates, fetchData3, path]);

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
      setDates2((prev) => ({ ...prev, endDate: null }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (dates2.startDate && dates2.endDate) {
        setNoDataPie(false); setErrorDataChart2(false);
        try {
          const response3 = await fetchData4(dates2.startDate, dates2.endDate, path);
          if (response3.data.totalClasses === 0) { setNoDataPie(true); }
          setData3(response3.data || {});
        } catch (error) {
          setErrorDataChart2(true);
          ////console.error('Error fetching data:', error);
          message.error('Failed to fetch data. Please try again.');
        }
      }
    };

    fetchData();
  }, [dates2, fetchData4, path]);


  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const start = '2010-10-10';
    const end = '2025-10-10';
    const start1 = '';
    const end1 = '';
    setNoDataDonut(false); setNoDataPie(false);
    setErrorDataGraph(false); setErrorDataGraph2(false); setErrorDataChart(false); setErrorDataChart2(false);
    try {
      const response = await fetchData();
      setData(response.data || []);
      setActiveStatBtn("allTime")
    } catch (error) {
      showErrorNotification("Error Loading Trainee Management", `${error.message}`);
      setErrorDataGraph(true)
    }
    try {
      const response2 = await fetchData2(oneYear, yearToDate, allTime);
      setData4(response2.data.technicalManager || {});
      setGeneraldata(response2.data || {});
      setActiveStatBtn2("allTime")
    } catch (error) {
      showErrorNotification("Error Loading Technical Management", `${error.message}`);
      setErrorDataGraph2(true)
    }
    try {
      const response3 = await fetchData3(start, end, path);
      if (response3.data.totalClasses === 0) { setNoDataDonut(true) };
      setData2(response3.data || {});
    } catch (error) {
      showErrorNotification("Error Loading Class Distribution", `${error.message}`);
      setErrorDataChart(true)
    }
    try {
      const response4 = await fetchData4(start1, end1, path);
      if (response4.data.totalClasses === 0) { setNoDataPie(true) };
      setData3(response4.data || {});
      setLoading(false);
    } catch (error) {
      showErrorNotification("Error Loading Class Status", `${error.message}`);
      setErrorDataChart2(true);
      setLoading(false);
    }
  };

  // Hàm chuyển đổi dữ liệu cho biểu đồ đường
  const transformData = (data, filterOption, selectedStatuses) => {
    if (!Array.isArray(data)) {
      //console.error("Expected data to be an array, but got", typeof data, data);
      return { activeData: [], enrolledData: [], dropOutData: [], rejectedData: [], categories: [] };
    }

    const activeData = [];
    const enrolledData = [];
    const dropOutData = [];
    const rejectedData = [];
    const categories = [];
    const categories1 = [];

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // 0-11 (JAN = 0)
    const currentYear = currentDate.getFullYear();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentMonth - 12);

    data.forEach((yearData) => {
      yearData.months.forEach((month, monthIndex) => {
        month.days.forEach((day) => {
          let isDayValid = false;
          const dayDate = new Date(`${yearData.year}-${monthIndex + 1}-${day.day}`); // Tạo đối tượng Date từ ngày.

          if (filterOption === "allTime") {
            if (
              parseInt(yearData.year) >= 2000
            ) {
              isDayValid = true;
            }
          } else if (filterOption === "yearToDate") {
            if (
              currentYear === parseInt(yearData.year) &&
              monthIndex <= currentMonth &&
              dayDate <= currentDate
            ) {
              isDayValid = true;
            }
          } else if (filterOption === "1year") {
            if (dayDate >= twelveMonthsAgo && dayDate <= currentDate) {
              isDayValid = true;
            }
          }

          if (isDayValid) {
            if (selectedStatuses.includes("ACTIVE")) activeData.push(day.status.ACTIVE);
            if (selectedStatuses.includes("ENROLLED")) enrolledData.push(day.status.ENROLLED);
            if (selectedStatuses.includes("DROP_OUT")) dropOutData.push(day.status.DROP_OUT);
            if (selectedStatuses.includes("REJECTED")) rejectedData.push(day.status.REJECTED);

            // Thêm tháng vào `categories` nếu chưa tồn tại
            let timestamp = new Date(`${day.day}-${month.month}-${yearData.year}`).getTime();
            categories.push(timestamp);
            if (!categories1.includes(month.month)) {
              categories1.push(month.month); // Chỉ thêm tên tháng vào categories
            }
          }
        });
      });
    });

    return { activeData, enrolledData, dropOutData, rejectedData, categories, categories1 };
  };





  // Ví dụ gọi hàm transformData với dữ liệu đã lọc
  const [filterOption, setFilterOption] = useState("allTime");
  const { activeData, enrolledData, dropOutData, rejectedData, categories, categories1 } = transformData(data, filterOption, selectedStatuses);

  const xaxis = {
    type: 'datetime',
    categories: categories, // Chỉ chứa các năm trong dữ liệu
  };

  const donutChartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false,
      },
    },
    labels: data2.content ? data2.content.map(item => item.technicalGroup) : [],
    colors: [
      '#292d30', '#00a0f3', '#ecfcff', '#2e4554', '#9baebc', '#87b0cc', '#6e5164', '#677986',
      '#3b027c', '#dfeaf0', '#4483a2', '#fffade', '#4c4452', '#b1a8b9', '#700000', '#bea69f'],
    stroke: {
      lineCap: 'round',
    },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'horizontal',
        gradientToColors: [
          '#3b3f42', '#33b6ff', '#f2feff', '#405d6a', '#b1c4d2', '#a0c4e0', '#8b677c', '#8393a0',
          '#4e0393', '#eff5f8', '#5b9bc0', '#fffcef', '#5f5765', '#c8bcd0', '#8b0000', '#ceb8b1'], // Lighter-to-darker scheme
        stops: [0, 10, 90, 100],
      },
    },
    series: data2.content ? data2.content.map(item => item.numberClasses) : [],
    legend: {
      show: false,
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => {
        return `${Math.round(val.toFixed(2))}%`;
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val, { seriesIndex }) {
          const group = data2.content[seriesIndex];
          return `Classes: ${val} / Total: ${data2.totalClasses}`;
        },
      },
    },
    plotOptions: {
      pie: {
        customScale: 1,
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              color: "#000000",
              offsetY: 20,
              formatter: () => 'Classes',
            },
            value: {
              show: true,
              fontSize: '22px',
              fontWeight: 'bold',
              offsetY: -25,
              formatter: () => data2.totalClasses,
            },
            total: {
              show: true,
              label: 'Total',
              formatter: () => data2.totalClasses,
            },
          },
        },
      },
    },
  };

  const monthNames = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  const fillMissingDays = (data) => {
    // Kiểm tra xem data có phải là đối tượng và không phải là null hay không
    if (typeof data !== 'object' || data === null) {
      return data; // Trả về dữ liệu gốc nếu không phải là đối tượng hợp lệ
    }

    // Kiểm tra nếu data.year tồn tại và là một đối tượng
    if (!data.year || typeof data.year !== 'object') {
      return data; // Trả về dữ liệu gốc nếu data.year không tồn tại hoặc không phải là đối tượng
    }

    const years = Object.keys(data.year);

    // Nếu không có dữ liệu năm nào, trả về dữ liệu gốc
    if (years.length === 0) {
      return data;
    }

    // Lặp qua từng năm trong dữ liệu
    years.forEach((year) => {
      if (!data.year[year].moth) {
        data.year[year].moth = {};
      }
      const monthsInYear = 12;

      // Duyệt qua từng tháng trong năm
      for (let month = 1; month <= monthsInYear; month++) {
        if (!data.year[year].moth[month]) {
          data.year[year].moth[month] = { day: {} };
        }

        // Lấy số ngày trong tháng
        const daysInMonth = new Date(parseInt(year), month, 0).getDate();

        // Duyệt qua từng ngày trong tháng và kiểm tra nếu có trong dữ liệu
        for (let day = 1; day <= daysInMonth; day++) {
          if (!data.year[year].moth[month].day[day]) {
            // Thêm ngày mới với cấu trúc mặc định
            data.year[year].moth[month].day[day] = {
              totalTraineePerTech: {}, // Thêm thông tin kỹ thuật nếu cần
              totalClassPerTech: {} // Thêm thông tin lớp học nếu cần
            };
          }
        }
      }
    });

    return data;
  };


  const transformDataForNewChart = (data, isDailyView, selectedMonth, selectedTech, isStudentView) => {
    //console.log(data)
    if (!data || !data.year) {
      return {
        baDataNew: [],  // JAVA
        cSharpDataNew: [], // C#
        dotNetDataNew: [], // DOT_NET
        aiDataNew: [], // AI
        iosDataNew: [], // IOS
        embeddedDataNew: [], // EMBEDDED
        categoriesNew: []
      };
    }

    const baDataNew = [];  // JAVA
    const cSharpDataNew = []; // C#
    const dotNetDataNew = []; // DOT_NET
    const aiDataNew = []; // AI
    const iosDataNew = []; // IOS
    const embeddedDataNew = []; // EMBEDDED
    const categoriesNew = [];

    Object.keys(data.year).forEach((year) => {
      Object.keys(data.year[year].moth).forEach((month) => {
        if (isDailyView) {
          if (parseInt(month) === selectedMonth) {
            Object.keys(data.year[year].moth[month].day).forEach((day) => {
              const dayData = data.year[year].moth[month].day[day];

              if (selectedTech.includes("JAVA")) {
                baDataNew.push(dayData.totalTraineePerTech.JAVA || 0);
              }
              if (selectedTech.includes("C#")) {
                cSharpDataNew.push(dayData.totalTraineePerTech["C#"] || 0);
              }
              if (selectedTech.includes("DOT_NET")) {
                dotNetDataNew.push(dayData.totalTraineePerTech["DOT_NET"] || 0);
              }
              if (selectedTech.includes("AI")) {
                aiDataNew.push(dayData.totalTraineePerTech["AI"] || 0);
              }
              if (selectedTech.includes("IOS")) {
                iosDataNew.push(dayData.totalTraineePerTech["IOS"] || 0);
              }
              if (selectedTech.includes("EMBEDDED")) {
                embeddedDataNew.push(dayData.totalTraineePerTech["EMBEDDED"] || 0);
              }

              categoriesNew.push(`${year}-${month}-${day}`); // Thêm ngày, tháng và năm vào danh sách categories
            });
          }
        } else if (isStudentView) {
          // Tính tổng theo từng ngày và thêm từng ngày vào categoriesNew (nếu cần)
          Object.keys(data.year[year].moth[month].day).forEach((day) => {
            const dayData = data.year[year].moth[month].day[day];

            if (selectedTech.includes("JAVA")) {
              baDataNew.push(dayData.totalClassPerTech.JAVA || 0);
            }
            if (selectedTech.includes("C#")) {
              cSharpDataNew.push(dayData.totalClassPerTech["C#"] || 0);
            }
            if (selectedTech.includes("DOT_NET")) {
              dotNetDataNew.push(dayData.totalClassPerTech["DOT_NET"] || 0);
            }
            if (selectedTech.includes("AI")) {
              aiDataNew.push(dayData.totalClassPerTech["AI"] || 0);
            }
            if (selectedTech.includes("IOS")) {
              iosDataNew.push(dayData.totalClassPerTech["IOS"] || 0);
            }
            if (selectedTech.includes("EMBEDDED")) {
              embeddedDataNew.push(dayData.totalClassPerTech["EMBEDDED"] || 0);
            }

            categoriesNew.push(`${monthNames[parseInt(month) - 1]}-${day}`); // Thêm ngày, tháng và năm vào danh sách categories
          });
        } else if (isTechselect) {
          Object.keys(data.year[year].moth[month].day).forEach((day) => {
            const dayData = data.year[year].moth[month].day[day];

            if (selectedTech.includes("JAVA")) {
              baDataNew.push(dayData.totalTraineePerTech.JAVA || 0);
            }
            if (selectedTech.includes("C#")) {
              cSharpDataNew.push(dayData.totalTraineePerTech["C#"] || 0);
            }
            if (selectedTech.includes("DOT_NET")) {
              dotNetDataNew.push(dayData.totalTraineePerTech["DOT_NET"] || 0);
            }
            if (selectedTech.includes("AI")) {
              aiDataNew.push(dayData.totalTraineePerTech["AI"] || 0);
            }
            if (selectedTech.includes("IOS")) {
              iosDataNew.push(dayData.totalTraineePerTech["IOS"] || 0);
            }
            if (selectedTech.includes("EMBEDDED")) {
              embeddedDataNew.push(dayData.totalTraineePerTech["EMBEDDED"] || 0);
            }

            categoriesNew.push(`${year}-${month}-${day}`); // Thêm ngày, tháng và năm vào danh sách categories
          });
          // Tính tổng theo từng ngày và thêm từng ngày vào categoriesNew (nếu cần)

        }
      });
    });

    return {
      baDataNew,
      cSharpDataNew,
      dotNetDataNew,
      aiDataNew,
      iosDataNew,
      embeddedDataNew,
      categoriesNew
    };
  };

  // Cập nhật dữ liệu và cấu hình cho biểu đồ mới
  const { baDataNew, dotNetDataNew, iosDataNew, embeddedDataNew, categoriesNew } = transformDataForNewChart(fillMissingDays(data4), isDailyView, selectedMonth, selectedTech, isStudentView);


  const newChartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
        type: 'x'
      }
    },
    stroke: {
      width: 9,
      curve: 'smooth'
    },
    colors: ['#34B3F1', '#FFB845', '#F1343F', '#292D30'],

    series: [
      { name: 'JAVA', data: baDataNew },
      { name: 'DOT_NET', data: dotNetDataNew },
      { name: 'IOS', data: iosDataNew },
      { name: 'EMBEDDED', data: embeddedDataNew },
    ].filter(series => series.data.length > 0),
    xaxis: {
      type: "datetime",
      categories: categoriesNew,
      labels: {
        format: 'MMM', // Chỉ hiển thị tháng (viết tắt, như "JAN", "FEB")
        datetimeUTC: false,
      },
      tooltip: {
        enabled: true
      }
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      verticalAlign: 'top',
      markers: {
        width: 10,
        height: 10,
      }
    },
  };

  const handleButtonClick = async (buttonType) => {
    // Đặt tất cả các state về false trước khi cập nhật

    // Cập nhật state tương ứng với button đã chọn
    setErrorDataGraph(false);
    if (buttonType === "1year") {

      try {
        const oneYear = 'true';
        const allTime = 'false';
        const yearToDate = 'false';
        const response2 = await fetchData2(oneYear, yearToDate, allTime);
        setData4(response2.data.technicalManager || {});
        // Xử lý dữ liệu nhận được từ API, ví dụ:
        // Cập nhật dữ liệu hoặc trạng thái sau khi nhận được API response
      } catch (error) {
        setErrorDataGraph(true);
      }
    } else if (buttonType === "allTime") {
      const oneYear = 'false';
      const allTime = 'true';
      const yearToDate = 'false';
      try {
        const response2 = await fetchData2(oneYear, yearToDate, allTime);
        setData4(response2.data.technicalManager || {});
        // Xử lý dữ liệu nhận được từ API, ví dụ:
        // Cập nhật dữ liệu hoặc trạng thái sau khi nhận được API response
      } catch (error) {
        setErrorDataGraph(true);
      }
    } else if (buttonType === "yearToDate") {
      const oneYear = 'false';
      const allTime = 'false';
      const yearToDate = 'true';
      try {
        const response2 = await fetchData2(oneYear, yearToDate, allTime);
        setData4(response2.data.technicalManager || {});
        // Xử lý dữ liệu nhận được từ API, ví dụ:
        // Cập nhật dữ liệu hoặc trạng thái sau khi nhận được API response
      } catch (error) {
        setErrorDataGraph(true);
      }
    }

  };


  // Cấu hình cho biểu đồ hình tròn
  const pieChartOptions = {
    chart: {
      type: 'pie',
      dataLabels: {
        enabled: true,
        formatter: (val) => {
          return `${Math.round(val.toFixed(2))}%`;
        }
      },
      toolbar: {
        show: false
      }
    },
    labels: data3.content ? data3.content.map(item => item.status) : [],
    colors: ['#34B3F1', '#0486c7', '#08384F', '#007777'],
    series: data3.content ? data3.content.map(item => item.numberClasses) : [],
    legend: {
      show: false,
      position: 'bottom'
    },
    plotOptions: {
      pie: {
        dataLabels: {
          offset: -10, // Adjust this to move labels closer to the center
        },
      },
    },
  };

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
        type: 'x'
      }
    },
    stroke: {
      width: 9,
      curve: 'smooth'
    },
    colors: ['#34B3F1', '#292D30', '#F1343F', '#FFB845'],

    series: [
      { name: 'Active', data: activeData || 0 }, // Đảm bảo có dữ liệu
      { name: 'Enrolled', data: enrolledData || 0 }, // Đảm bảo có dữ liệu
      { name: 'Drop out', data: dropOutData || 0 }, // Đảm bảo có dữ liệu
      { name: 'Rejected', data: rejectedData || 0 }
    ].filter(series => series.data.length > 0),
    xaxis: {
      type: 'datetime',
      categories: xaxis.categories,
      labels: filterOption === 'allTime'
        ? {
          format: 'MMM-yyyy',
          datetimeUTC: false,
        }
        : {
          format: 'MMM',
          datetimeUTC: false,
        },
      tooltip: {
        enabled: true
      }
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy', // Định dạng hiển thị tooltip
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      verticalAlign: 'top',
      markers: {
        width: 10,
        height: 10,
      }
    },
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
            {[{ title: "Total Classes", icon: <HomeOutlined />, value: generaldata.totalClasses },
            { title: "Total Trainees", icon: <UserOutlined />, value: generaldata.totalTrainees },
            { title: "Total Trainer", icon: <UserOutlined />, value: generaldata.totalTrainer },
            { title: "Technical Groups", icon: <ToolFilled />, value: generaldata.totalTechnicalGroups },
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
          <Row gutter={16}>
            <Col span={16}>
              <div style={{ width: '100%' }}>
                <h2>Trainee Management</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '10px', width: '100%' }}>
                  <div>
                    <ConfigProvider
                      theme={{
                        token: {
                          borderRadius: 10,
                        },
                        components: {
                          Select: {
                            multipleItemBg: 'white',
                          },
                        },
                      }}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Status"
                        style={{ marginRight: '20px', marginBottom: '10px', height: 30, width: '120px', maxWidth: 120, }}
                        size='middle'
                        maxTagCount='responsive'
                        maxTagPlaceholder='Status'
                        value={selectedStatuses}
                        onChange={(values) => {
                          if (values.length === 0) {
                            message.warning("You must select at least one option.");
                            return;
                          }
                          filterDataByStatus(values)
                        }
                        }

                      >
                        <Select.Option value="ACTIVE">Active</Select.Option>
                        <Select.Option value="ENROLLED">Enrolled</Select.Option>
                        <Select.Option value="DROP_OUT">Drop_out</Select.Option>
                        <Select.Option value="REJECTED">Rejected</Select.Option>
                      </Select>

                    </ConfigProvider>
                  </div>
                  <div style={{ marginRight: '10px', display: 'flex' }}>
                    <div style={{ height: 30, width: '100px', overflow: 'hidden', textWrap: 'nowrap', maxWidth: 100, }}
                      className={`statistic-btn ${activeStatBtn === "yearToDate" ? 'active' : ''}`}
                      onClick={() => { setActiveStatBtn("yearToDate"); setFilterOption("yearToDate") }}
                    >
                      Year to Date
                    </div>
                    <div style={{ height: 30, width: '100px', overflow: 'hidden', textWrap: 'nowrap', maxWidth: 100, }}
                      className={`statistic-btn ${activeStatBtn === "1year" ? 'active' : ''}`}
                      onClick={() => { setActiveStatBtn("1year"); setFilterOption("1year") }}
                    >
                      1 Year
                    </div>
                    <div style={{ height: 30, width: '100px', overflow: 'hidden', textWrap: 'nowrap', maxWidth: 100, }}
                      className={`statistic-btn ${activeStatBtn === "allTime" ? 'active' : ''}`}
                      onClick={() => { setActiveStatBtn("allTime"); setFilterOption("allTime") }}
                    >
                      All Time
                    </div>
                  </div>
                </div>
                {errorDataGraph ? (
                  <div className='error-fetching'> <span>Error Loading Graph</span> </div>
                ) : (
                  <ReactApexChart options={chartOptions} series={chartOptions.series} type="line" height={320} width={'100%'} />
                )}
              </div>
            </Col>

            <Col span={8}>
              <div className="chart-card-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '60px', marginRight: '60px' }}>
                  <DatePicker
                    placeholder="Start Date"
                    format="YYYY-MM-DD"
                    onChange={(date) => handleStartDateChange(date)}
                    value={dates.startDate ? dayjs(dates.startDate) : null}
                    size='small'
                    style={{ width: '40%' }}
                  />
                  <DatePicker
                    placeholder="End Date"
                    format="YYYY-MM-DD"
                    onChange={(date) => handleEndDateChange(date)}
                    value={dates.endDate ? dayjs(dates.endDate) : null}
                    size='small'
                    style={{ width: '40%' }}
                  />
                </div>
                {errorDataChart && (
                  <div className='error-fetching'> <span>Error Loading Chart</span> </div>
                )}
                {noDataDonut ? (
                  <h3 style={{ fontWeight: 400, fontStyle: 'italic', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}> No Data of this time range is available </h3>
                ) : (
                  <ReactApexChart options={donutChartOptions} series={donutChartOptions.series} type="donut" />
                )
                }
                <p>Class Distribution of Technical Groups</p>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={16}>
              <div style={{ width: '100%' }}>
                <h2>Technical Managemnet</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {isDailyView && (
                    <Select
                      value={selectedMonth}
                      onChange={setSelectedMonth}
                      style={{ width: 120, marginRight: '10px' }}
                    >
                      {data.months.map(month => (
                        <Select.Option key={month.month} value={month.month}>
                          {month.month}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                  <div style={{ display: 'flex', border: '1px solid lightgrey', padding: '5px', borderRadius: '50px', paddingLeft: '10px', paddingRight: '10px', height: 35, width: '270px', marginBottom: '10px' }}>
                    <ConfigProvider
                      theme={{
                        token: {
                          borderRadius: 50,
                        },
                        components: {
                          Select: {
                            multipleItemBg: 'white',
                          },
                        },
                      }}
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Technical"
                        style={{ width: '120px', marginRight: '10px' }}
                        size='small'
                        maxTagCount='responsive'
                        maxTagPlaceholder='Technical'
                        value={selectedTech}
                        onChange={(values) => {
                          if (values.length === 0) {
                            message.warning("You must select at least one option.");
                            return;
                          }
                          filterDataByTech(values);
                        }}
                        disabled={!isTechselect}
                      >
                        <Select.Option value="DOT_NET">DOT_NET</Select.Option>
                        <Select.Option value="IOS">IOS</Select.Option>
                      </Select>
                    </ConfigProvider>

                    <input
                      type="checkbox"
                      checked={isTechselect}
                      onChange={() => {
                        setTechSelect(true);
                        setStudentView(false); // Đảm bảo checkbox kia được bỏ chọn
                      }}
                    />
                    <div style={{ padding: '0 10px' }}>student</div>
                    <input
                      type="checkbox"
                      checked={isStudentView}
                      onChange={() => {
                        setStudentView(true);
                        setTechSelect(false); // Đảm bảo checkbox kia được bỏ chọn
                      }}
                    />

                  </div>

                  <div style={{ marginRight: '10px', display: 'flex' }}>
                    <div style={{ height: 30, width: '100px', overflow: 'hidden', textWrap: 'nowrap', maxWidth: 100, }}
                      className={`statistic-btn ${activeStatBtn2 === "yearToDate" ? 'active' : ''}`}
                      onClick={() => { setActiveStatBtn2("yearToDate"); handleButtonClick("yearToDate") }}
                    >
                      Year to Date
                    </div>
                    <div style={{ height: 30, width: '100px', overflow: 'hidden', textWrap: 'nowrap', maxWidth: 100, }}
                      className={`statistic-btn ${activeStatBtn2 === "1year" ? 'active' : ''}`}
                      onClick={() => { setActiveStatBtn2("1year"); handleButtonClick("1year") }}
                    >
                      1 Year
                    </div>
                    <div style={{ height: 30, width: '100px', overflow: 'hidden', textWrap: 'nowrap', maxWidth: 100, }}
                      className={`statistic-btn ${activeStatBtn2 === "allTime" ? 'active' : ''}`}
                      onClick={() => { setActiveStatBtn2("allTime"); handleButtonClick("allTime") }}
                    >
                      All Time
                    </div>
                  </div>
                </div>
                {errorDataGraph2 ? (
                  <div className='error-fetching'> <span>Error Loading Graph</span> </div>
                ) : (
                  <ReactApexChart options={newChartOptions} series={newChartOptions.series} type="line" height={320} width={'100%'} />)}
              </div>
            </Col>

            <Col span={8}>
              <div className="chart-card-1">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '60px', marginRight: '60px' }}>
                  <DatePicker
                    placeholder="Start Date"
                    format="YYYY-MM-DD"
                    onChange={(date) => handleStartDateChange2(date)}
                    value={dates2.startDate ? dayjs(dates2.startDate) : null}
                    size='small'
                    style={{ width: '40%' }}
                  />
                  <DatePicker
                    placeholder="End Date"
                    format="YYYY-MM-DD"
                    onChange={(date) => handleEndDateChange2(date)}
                    value={dates2.endDate ? dayjs(dates2.endDate) : null}
                    size='small'
                    style={{ width: '40%' }}
                  />
                </div>
                {errorDataChart2 && (
                  <div className='error-fetching'> <span>Error Loading Chart</span> </div>
                )}
                {noDataPie ? (
                  <h3 style={{ fontWeight: 400, fontStyle: 'italic', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}> No Data of this time range is available </h3>
                ) : (
                  <ReactApexChart options={pieChartOptions} series={pieChartOptions.series} type="pie" />
                )
                }
                <p>Class Status Ratio By Site Over Time</p>
              </div>
            </Col>
          </Row>
        </>)}
    </Layout>
  );
};

export default TraineeManagementChart;
