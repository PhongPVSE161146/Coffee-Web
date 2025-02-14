// import React, { useState, useEffect } from "react";
// import Select from "./Select/Select";
// import SelectTrainer from "./Select/SelectTrainer";
// import { fetchChart, fetchData } from "./ApiService/apiService";
// import Chart from "react-apexcharts";
// import { Table, ConfigProvider, DatePicker, Spin } from 'antd';
// import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
// import "./StatisticGPA.css";
// import { RiStarSLine } from "react-icons/ri";


// const { RangePicker } = DatePicker;

// const GPA = () => {
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [selectedClasses, setSelectedClasses] = useState([]);
//   const [selectedAccounts, setSelectedAccounts] = useState([]);
//   const [selectedDateRange, setSelectedDateRange] = useState(null);
//   const [allData, setAllData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [fetchdata, setFetchData] = useState({});
//   const [accounts, setAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [dataAvailable, setDataAvailable] = useState(true);
//   useEffect(() => {
//     loadEvents();
//   }, []);

//   const loadEvents = async () => {
//     try {
//       const response = await fetchData();
//       setFetchData(response.data || {});
//       const accountList = response.data.map(item => item.trainerAccount);
//       setAccounts(accountList);
//       setLoading(false);
//       setDataAvailable(true);
//     } catch (error) {
//       //console.error("Error loading events:", error);
//       setLoading(false);
//       setDataAvailable(false);
//     }
//   };

//   const roleConfigs = {
//     trainer: { path: sessionStorage.getItem("username") },
//     admin: { path: selectedAccounts },
//   };

//   const role = sessionStorage.getItem("selectedRole");
//   const { path } = roleConfigs[role] || {};
//   const [topics, setTopics] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const isAllSelected = selectedTopics.length > 0 && selectedClasses.length > 0 && selectedDateRange;

//   useEffect(() => {
//     setSelectedTopics([]);
//     setSelectedClasses([]);
//     setSelectedDateRange(null);
//     setTopics([]);
//     setClasses([]);

//     if (selectedAccounts && selectedAccounts.length > 0) {
//       const data = fetchdata.filter(item => item.trainerAccount === selectedAccounts);
//       setAllData(data);

//       const extractedTopics = [...new Set(data.map(item => item.moduleName))];
//       const extractedClasses = [...new Set(data.map(item => item.className))];
//       setTopics(extractedTopics);
//       setClasses(extractedClasses);
//     }
//   }, [selectedAccounts]);

//   useEffect(() => {
//     if (allData.length > 0 && isAllSelected) {
//       //console.log(selectedDateRange[0].toISOString())
//       const filtered = allData.filter(item => {
//         const itemDate = new Date(item.endDate).getFullYear();
//         const isWithinDateRange = selectedDateRange
//           ? itemDate >= selectedDateRange[0].toDate().getFullYear() && itemDate <= selectedDateRange[1].toDate().getFullYear()
//           : true;

//         return (
//           selectedTopics.includes(item.moduleName) &&
//           selectedClasses.includes(item.className) &&
//           isWithinDateRange
//         );
//       });

//       if (JSON.stringify(filtered) !== JSON.stringify(filteredData)) {
//         setFilteredData(filtered);
//       }
//     }
//   }, [selectedTopics, selectedClasses, selectedDateRange, allData, isAllSelected, filteredData]);

//   const updateChartData = (data) => {
//     const categories = [];
//     const seriesData = {};

//     data.forEach(item => {
//       const moduleName = item.moduleName;
//       const year = new Date(item.endDate).getFullYear();

//       if (!categories.includes(moduleName)) {
//         categories.push(moduleName);
//       }

//       if (!seriesData[year]) {
//         seriesData[year] = Array(categories.length).fill(0);
//       }

//       const index = categories.indexOf(moduleName);
//       seriesData[year][index] = item.gpa;
//     });

//     const series = Object.keys(seriesData).map(year => ({
//       name: year,
//       data: seriesData[year],
//     }));

//     return { categories, series };
//   };

//   const chartData = updateChartData(filteredData);

//   const columns = [
//     { title: 'Module Name', dataIndex: 'moduleName', key: 'moduleName' },
//     { title: 'Class Name', dataIndex: 'className', key: 'className' },
//     { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (text) => new Date(text).toLocaleDateString() },
//     { title: 'GPA', dataIndex: 'gpa', key: 'gpa' },
//   ];

//   const handleDateChange = (dates) => {
//     if (!dates) {
//       setSelectedDateRange(null);
//     } else {
//       setSelectedDateRange(dates);
//     }
//   };
//   return (
//     <div className="GPA-container" style={{ padding: "20px" }}>
//       {loading ? (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//           <Spin size="large" />
//           <p>Loading...</p>
//         </div>
//       ) : (
//         <>
//           {dataAvailable ? (
//             <>
//               <div className="GPA-select-container" style={{ display: "flex", justifyContent: "space-evenly" }}>
//                 <div className="GPA-select-2">
//                   <h2 style={{ display: "flex" }}>Trainer<div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px', fontSize: '15px', color: 'red' }}><RiStarSLine /></div></h2>
//                   <SelectTrainer topics={accounts} onSelect={setSelectedAccounts} multiSelect={false} />
//                 </div>

//                 <div className="GPA-select-2">
//                   <h2 style={{ display: "flex" }}>Class<div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px', fontSize: '15px', color: 'red' }}><RiStarSLine /></div></h2>
//                   <Select topics={classes} onSelect={setSelectedClasses} selected={selectedClasses} multiSelect={true} />
//                 </div>

//                 <div className="GPA-select-1">
//                   <h2 style={{ display: "flex" }}>Module<div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px', fontSize: '15px', color: 'red' }}><RiStarSLine /></div></h2>
//                   <Select topics={topics} onSelect={setSelectedTopics} selected={selectedTopics} multiSelect={true} />
//                 </div>

//                 <div className="GPA-select-3">
//                   <h2 style={{ display: "flex" }}>Year<div style={{ display: 'flex', alignItems: 'center', marginLeft: '5px', fontSize: '15px', color: 'red' }}><RiStarSLine /></div></h2>
//                   <ConfigProvider
//                     theme={{
//                       components: {
//                         DatePicker: { cellWidth: 22, withoutTimeCellHeight: 40 },
//                       },
//                     }}
//                   >
//                     <RangePicker
//                       picker="year"
//                       value={selectedDateRange}
//                       style={{ width: "100%", borderRadius: "10px", height: "41px" }}
//                       onChange={handleDateChange}
//                     />
//                   </ConfigProvider>
//                 </div>
//               </div>

//               <div className="GPA-chart">
//                 {isAllSelected ? (
//                   filteredData.length > 0 ? (
//                     <div>
//                       <div className="GPA-mixed-chart">
//                         <h1>GPA BAR CHART</h1>
//                         <Chart
//                           options={{
//                             chart: { type: "bar", height: 350 },
//                             plotOptions: { bar: { horizontal: false, columnWidth: "60%", endingShape: "rounded" } },
//                             dataLabels: { enabled: false },
//                             stroke: { show: true, width: 2, colors: ["transparent"] },
//                             xaxis: {
//                               categories: chartData.categories,
//                               labels: {
//                                 style: {
//                                   fontSize: '12px', // Kích thước nhãn
//                                 },
//                                 trim: true,
//                                 formatter: (value) => {
//                                   // Rút gọn label nếu dài hơn 10 ký tự
//                                   return value.length > 20 ? value.slice(0, 20) + "..." : value;
//                                 },
//                               },
//                             },
//                             fill: { opacity: 1 },
//                             colors: ["#1E3382", "#037EC2", "#475578", "#5750df"],
//                             legend: { position: "top", horizontalAlign: "center" },
//                             tooltip: {
//                               y: { formatter: (val) => val },
//                               x: {
//                                 formatter: (value) => {
//                                   // Hiển thị label đầy đủ trong tooltip
//                                   return value;
//                                 },
//                               },
//                             },
//                           }}
//                           series={chartData.series}
//                           type="bar"
//                           width="100%"
//                         />
//                       </div>
//                       <div className="GPA-data-table">
//                         <h1>GPA TABLE</h1>
//                         <Table dataSource={filteredData} columns={columns} rowKey="moduleName" pagination={false} />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="no-data">
//                       <h1>No Data Available</h1>
//                     </div>
//                   )
//                 ) : null}
//               </div>
//             </>
//           ) : (
//             <div className="no-data">
//               <h1>No Data Available</h1>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default GPA;
