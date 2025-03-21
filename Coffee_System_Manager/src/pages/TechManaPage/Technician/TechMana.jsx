import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../axios/Axios";

const TechMana = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [techStaffList, setTechStaffList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [form] = useForm();

  async function fetchTechStaff() {
    try {
      const response = await axiosInstance.get("technician");
      const data = response?.data?.technicians;
      setTechStaffList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi fetch store:", error);
      setTechStaffList([]);
    }
  }

  useEffect(() => {
    fetchTechStaff();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = techStaffList.filter((staff) =>
    staff.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.technicianId.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã Nhân Viên",
      dataIndex: "technicianId",
      sorter: (a, b) => a.technicianId.localeCompare(b.technicianId),
    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "firstName",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Gmail",
      dataIndex: "email",
    },
    {
      title: "Chi Tiết",
      render: () => <a>Xem thêm</a>,
    },
    {
      title: "Hành Động",
      render: (record) => <Button onClick={() => console.log("Edit", record)}>Chỉnh sửa</Button>,
    },
  ];

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Input
        placeholder="Tìm kiếm nhân viên..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table bordered columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} style={{ width: "90%", maxWidth: "1200px" }} />
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Tạo thông tin nhân viên mới
      </Button>
      <Modal title="Thêm nhân viên" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={() => {}}>
          <Form.Item label="Mã Nhân Viên" name="mid" rules={[{ required: true, message: "Nhập mã nhân viên" }]}> <Input /> </Form.Item>
          <Form.Item label="Tên Nhân Viên" name="name" rules={[{ required: true, message: "Nhập tên nhân viên" }]}> <Input /> </Form.Item>
          <Form.Item label="Gmail" name="gmail" rules={[{ required: true, type: "email", message: "Nhập Gmail hợp lệ" }]}> <Input /> </Form.Item>
          <Form.Item name="adate" label="Ngày thêm nhân viên" rules={[{ required: true, message: "Chọn ngày thêm nhân viên" }]}> <DatePicker style={{ width: "100%" }} /> </Form.Item>
          <Form.Item label="Vai Trò" name="role" initialValue="techStaff"> <Input value="Kỹ thuật viên" disabled /> </Form.Item>
          <Button htmlType="submit">Thêm nhân viên mới</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TechMana;
