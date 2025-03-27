import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import { Button, DatePicker, Spin, Layout, Col, Row } from "antd";
import { HomeOutlined, ToolFilled, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./GeneralData.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMachines: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalStaff: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("day"); // Chế độ xem: day, month, year
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, "day"), dayjs()]); // Khoảng thời gian mặc định (7 ngày gần nhất)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const fetchData = async (url, key) => {
        try {
          const response = await axios.get(url);
          return response.data[key]?.length || 0;
        } catch (error) {
          console.error(`Lỗi khi fetch ${key}:`, error);
          return 0;
        }
      };

      const totalMachines = await fetchData(
        "https://coffeeshop.ngrok.app/api/machine?page=1&pageSize=10",
        "machines"
      );
      const totalOrders = await fetchData(
        "https://coffeeshop.ngrok.app/api/order?page=1&pageSize=10",
        "orders"
      );
      const totalCustomers = await fetchData(
        "https://coffeeshop.ngrok.app/api/customer?page=1&pageSize=10",
        "customers"
      );
      const totalStaff = await fetchData(
        "https://coffeeshop.ngrok.app/api/staff?page=1&pageSize=10",
        "staffs"
      );

      setStats({ totalMachines, totalOrders, totalCustomers, totalStaff });
      setLoading(false);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(
          "https://coffeeshop.ngrok.app/api/order?sortBy=OrderId&isAscending=true&page=1&pageSize=10"
        );
        const orders = response.data.orders || [];

        const startDate = dateRange[0].startOf("day");
        const endDate = dateRange[1].endOf("day");

        // Lọc đơn hàng theo khoảng thời gian đã chọn
        const filteredOrders = orders.filter((order) => {
          const orderDate = dayjs(order.createdAt);
          return orderDate.isBetween(startDate, endDate, null, "[]");
        });

        // Nhóm doanh thu theo chế độ xem
        const revenueByPeriod = filteredOrders.reduce((acc, order) => {
          let dateKey;
          switch (viewMode) {
            case "month":
              dateKey = order.createdAt.slice(0, 7); // YYYY-MM
              break;
            case "year":
              dateKey = order.createdAt.slice(0, 4); // YYYY
              break;
            default:
              dateKey = order.createdAt.slice(0, 10); // YYYY-MM-DD
          }

          acc[dateKey] = (acc[dateKey] || 0) + order.totalAmount;
          return acc;
        }, {});

        setRevenueData(
          Object.entries(revenueByPeriod).map(([date, amount]) => ({
            date,
            amount,
          }))
        );
      } catch (error) {
        console.error("Lỗi khi lấy doanh thu:", error);
      }
    };

    fetchRevenue();
  }, [viewMode, dateRange]);

  const revenueChartOptions = {
    chart: { type: "line", height: 320 },
    xaxis: { categories: revenueData.map((item) => item.date) },
    series: [{ name: "Doanh thu", data: revenueData.map((item) => item.amount) }],
  };

  return (
    <Layout className="layout">
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <Spin size="large" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* Tổng quan số lượng */}
          <Row gutter={16} style={{ marginBottom: "24px" }}>
            {[
              { title: "Tổng đơn hàng", icon: <HomeOutlined />, value: stats.totalOrders },
              { title: "Tổng khách hàng", icon: <UserOutlined />, value: stats.totalCustomers },
              { title: "Nhân viên", icon: <UserOutlined />, value: stats.totalStaff },
              { title: "Tổng số máy", icon: <ToolFilled />, value: stats.totalMachines },
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

          {/* Biểu đồ doanh thu */}
          <Row gutter={16}>
            <Col span={16}>
              <div style={{ width: "100%" }}>
                <h2>Doanh Thu</h2>

                {/* Bộ lọc thời gian */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <DatePicker.RangePicker
                  value={dateRange}
                  disabledDate={(current) => current && current > dayjs().endOf("day")} // Chặn chọn ngày trong tương lai
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1] && dates[0].isBefore(dates[1])) {
                      setDateRange(dates);
                    } else {
                      alert("Ngày bắt đầu phải trước ngày kết thúc!");
                    }
                  }}
                />

                  <div>
                    <Button
                      type={viewMode === "day" ? "primary" : "default"}
                      onClick={() => setViewMode("day")}
                      style={{ marginRight: 8 }}
                    >
                      Theo Ngày
                    </Button>
                    <Button
                      type={viewMode === "month" ? "primary" : "default"}
                      onClick={() => setViewMode("month")}
                      style={{ marginRight: 8 }}
                    >
                      Theo Tháng
                    </Button>
                    <Button
                      type={viewMode === "year" ? "primary" : "default"}
                      onClick={() => setViewMode("year")}
                    >
                      Theo Năm
                    </Button>
                  </div>
                </div>

                {/* Biểu đồ */}
                <ReactApexChart
                  options={revenueChartOptions}
                  series={revenueChartOptions.series}
                  type="line"
                  height={320}
                />
              </div>
            </Col>
          </Row>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
