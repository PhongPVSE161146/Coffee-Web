import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ProductList = () => {
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");

  async function fetchProduct() {
    try {
      const response = await axiosInstance.get("product");
      const data = response?.data?.products;
      if (Array.isArray(data)) {
        setProductList(data);
        setFilteredList(data);
      } else {
        console.warn("Dữ liệu không đúng dạng mảng:", data);
        setProductList([]);
        setFilteredList([]);
      }
    } catch (error) {
      console.error("Lỗi fetch product:", error);
      setProductList([]);
      setFilteredList([]);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = productList.filter((product) =>
      product.productName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filteredData);
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productId",
      sorter: (a, b) => a.productId.localeCompare(b.productId),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "categoryId",
      sorter: (a, b) => a.categoryId.localeCompare(b.categoryId),
    },
    {
      title: "Số lượng",
      dataIndex: "stockQuantity",
    },
    {
      title: "Giá sản phẩm",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
  ];

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300, marginBottom: 16, textAlign: "center" }}
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

export default ProductList;