import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from "antd-style";
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const OrderList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [formUpdate] = useForm();
  const [orderList, setOrderList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");

  async function fetchOrder() {
    try {
      const response = await axiosInstance.get("order");
      console.log("API response:", response);

      const data = response?.data?.orders;
      if (Array.isArray(data)) {
        setOrderList(data);
        setFilteredList(data);
      } else {
        console.warn("Dữ liệu không đúng dạng mảng:", data);
        setOrderList([]);
        setFilteredList([]);
      }
    } catch (error) {
      console.error("Lỗi fetch order:", error);
      setOrderList([]);
      setFilteredList([]);
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  // Hàm tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = orderList.filter((order) =>
      order.productName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filteredData);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "productId",
      fixed: "left",
      sorter: (a, b) => a.productId.localeCompare(b.productId),
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Mã khách hàng",
      dataIndex: "CustomerId",
      fixed: "left",
      sorter: (a, b) => a.CustomerId.localeCompare(b.CustomerId),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryId",
      sorter: (a, b) => a.categoryId.localeCompare(b.categoryId),
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />

      <Table
        bordered
        columns={columns}
        dataSource={filteredList}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 5 }}
        style={{ width: "90%", maxWidth: "1200px" }}
      />
    </div>
  );
};

export default OrderList;
