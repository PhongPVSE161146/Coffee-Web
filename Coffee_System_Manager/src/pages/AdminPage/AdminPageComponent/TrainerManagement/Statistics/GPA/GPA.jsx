import React, { useState, useEffect } from "react";
import Select from "../chartComponent/Select/Select";
import SelectDateRange from "../chartComponent/Select/SelectDateRange";
import { fetchChart } from "../ApiService/apiService";
import Chart from "react-apexcharts";
import { Table, Spin } from 'antd';
import "./GPA.css";

const GPA = () => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataAvailable, setDataAvailable] = useState(true);

  // Define role configurations
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


  const [topics, setTopics] = useState([]);
  const [classes, setClasses] = useState([]);

  const isAllSelected = selectedTopics.length > 0 && selectedClasses.length > 0 && selectedDateRange;

  useEffect(() => {
    //console.log("Fetching data for role:", role); // Debugging log
    //console.log("Path:", path);
    const loadData = async () => {
      if (path) {
        try {
          const data = await fetchChart(path);
          //console.log("Fetched data:", data);
          setAllData(data);
          const extractedTopics = [...new Set(data.map(item => item.moduleName))];
          const extractedClasses = [...new Set(data.map(item => item.className))];
          setTopics(extractedTopics);
          setClasses(extractedClasses);
          //console.log(data);
          setLoading(false);
          setDataAvailable(true);
        } catch (error) {
          //console.error("Error fetching data:", error);
          setLoading(false);
          setDataAvailable(false);
        }
      }
    };

    loadData();
  }, [path]);

  useEffect(() => {
    if (allData.length > 0 && isAllSelected) {
      const filtered = allData.filter(item => {
        const itemDate = new Date(item.endDate).getFullYear();
        const isWithinDateRange = selectedDateRange
          ? itemDate >= selectedDateRange[0].toDate().getFullYear() && itemDate <= selectedDateRange[1].toDate().getFullYear()
          : true;

        return (
          selectedTopics.includes(item.moduleName) &&
          selectedClasses.includes(item.className) &&
          isWithinDateRange
        );
      });

      if (JSON.stringify(filtered) !== JSON.stringify(filteredData)) {
        setFilteredData(filtered);
      }
    }
  }, [selectedTopics, selectedClasses, selectedDateRange, allData, isAllSelected, filteredData]);

  const updateChartData = (data) => {
    const categories = [];
    const seriesData = {};

    data.forEach(item => {
      const moduleName = item.moduleName;
      const year = new Date(item.endDate).getFullYear();

      if (!categories.includes(moduleName)) {
        categories.push(moduleName);
      }

      if (!seriesData[year]) {
        seriesData[year] = Array(categories.length).fill(0);
      }

      const index = categories.indexOf(moduleName);
      seriesData[year][index] = item.gpa;
    });

    const series = Object.keys(seriesData).map(year => ({
      name: year,
      data: seriesData[year],
    }));

    return { categories, series };
  };

  const chartData = updateChartData(filteredData);

  const columns = [
    {
      title: 'Module Name',
      dataIndex: 'moduleName',
      key: 'moduleName',
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      key: 'className',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'GPA',
      dataIndex: 'gpa',
      key: 'gpa',
    },
  ];

  return (
    <>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Spin size="large" />
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {dataAvailable ? (
            <div className="GPA-container" style={{ padding: "20px" }}>
              <div className="GPA-select-container" style={{ display: "flex", justifyContent: "space-evenly" }}>
                <div className="GPA-select-1">
                  <h2 >Select Topic</h2>
                  <Select topics={topics} onSelect={setSelectedTopics} multiSelect={true} />
                </div>
                <div className="GPA-select-2">
                  <h2 >Select Class</h2>
                  <Select topics={classes} onSelect={setSelectedClasses} multiSelect={true} />
                </div>
                <div className="GPA-select-3">
                  <h2 >Select Date Range</h2>
                  <SelectDateRange onSelect={setSelectedDateRange} />
                </div>
              </div>

              <div className="GPA-chart">
                {isAllSelected ? (
                  filteredData.length > 0 ? (
                    <div>
                      <h1>GPA BAR CHART</h1>
                      <Chart
                        options={{
                          chart: {
                            type: "bar",
                            height: 350,
                          },
                          plotOptions: {
                            bar: {
                              horizontal: false,
                              columnWidth: "60%",
                              endingShape: "rounded",
                            },
                          },
                          dataLabels: {
                            enabled: false,
                          },
                          stroke: {
                            show: true,
                            width: 2,
                            colors: ["transparent"],
                          },
                          xaxis: {
                            categories: chartData.categories,
                          },
                          fill: {
                            opacity: 1,
                          },
                          colors: ["#1E3382", "#037EC2", "#475578", "#5750df"],
                          legend: {
                            position: "top",
                            horizontalAlign: "center",
                          },
                          tooltip: {
                            y: {
                              formatter: function (val) {
                                return val;
                              },
                            },
                          },
                        }}
                        series={chartData.series}
                        type="bar"
                        width="100%"
                      />
                      <div className="GPA-data-table">
                        <h1>GPA TABLE</h1>
                        <Table
                          dataSource={filteredData}
                          columns={columns}
                          rowKey="moduleName"
                          pagination={false}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="no-data">
                      <h1>No Data Available</h1>
                    </div>
                  )
                ) : null}
              </div>
            </div>
          ) : (
            <div className="no-data">
              <h1>No Data Available</h1>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default GPA;
