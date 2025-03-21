import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../axios/Axios";

const StaffMana = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [form] = useForm();
  const [formUpdate] = useForm();

  async function fetchStaff() {
    try {
      const response = await axiosInstance.get("staff");
      setStaffList(response?.data?.staffs || []);
    } catch (error) {
      console.error("Lỗi fetch staff:", error);
      setStaffList([]);
    }
  }

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = staffList.filter((staff) =>
    staff.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
    staff.staffId.toLowerCase().includes(searchText.toLowerCase())
  );

  async function updateStaff() {
    try {
      await axiosInstance.put(`staff/${selectedStaff.id}`, formUpdate.getFieldsValue());
      toast.success("Cập nhật nhân viên thành công");
      fetchStaff();
      setIsModalUpdateOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật nhân viên");
    }
  }

  async function deleteStaff(staff) {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa nhân viên này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        await axiosInstance.delete(`staff/${staff.id}`);
        toast.success("Xóa nhân viên thành công");
        fetchStaff();
      },
    });
  }

  const columns = [
    { 
      title: "Mã Nhân Viên", 
      dataIndex: "staffId", 
      sorter: (a, b) => a.staffId.localeCompare(b.staffId) 
    },
    { 
      title: "Tên Nhân Viên", 
      dataIndex: "firstName", 
      sorter: (a, b) => a.firstName.localeCompare(b.firstName) 
    },
    { 
      title: "Gmail", 
      dataIndex: "email" 
    },
    { 
      title: "Chi Tiết", 
      render: () => <a>Xem thêm</a> 
    },
    {
      title: "Hành Động",
      render: (record) => (
        <>
          <Button onClick={() => deleteStaff(record)}>Xóa</Button>
          <Button icon={<UploadOutlined />} onClick={() => {
            setSelectedStaff(record);
            formUpdate.setFieldsValue(record);
            setIsModalUpdateOpen(true);
          }}>Chỉnh sửa</Button>
        </>
      ),
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
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Tạo thông tin nhân viên mới</Button>

      {/* Modal Thêm Nhân Viên */}
      <Modal title="Thêm nhân viên" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={() => {}}>
          <Form.Item label="Mã Nhân Viên" name="mid" rules={[{ required: true, message: "Nhập mã nhân viên" }]}><Input /></Form.Item>
          <Form.Item label="Tên Nhân Viên" name="name" rules={[{ required: true, message: "Nhập tên nhân viên" }]}><Input /></Form.Item>
          <Form.Item label="Gmail" name="gmail" rules={[{ required: true, type: "email", message: "Nhập Gmail hợp lệ" }]}><Input /></Form.Item>
          <Form.Item name="adate" label="Ngày thêm nhân viên" rules={[{ required: true, message: "Chọn ngày thêm nhân viên" }]}><DatePicker style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Vai Trò" name="role"><Select><Select.Option value="SALES">Nhân viên bán hàng</Select.Option><Select.Option value="DELIVERY">Nhân viên giao hàng</Select.Option><Select.Option value="MANAGER">Quản lý</Select.Option></Select></Form.Item>
          <Button htmlType="submit">Thêm nhân viên mới</Button>
        </Form>
      </Modal>

      {/* Modal Chỉnh Sửa Nhân Viên */}
      <Modal title="Chỉnh sửa nhân viên" open={isModalUpdateOpen} onCancel={() => setIsModalUpdateOpen(false)} footer={null}>
        <Form form={formUpdate} onFinish={updateStaff}>
          <Form.Item label="Mã Nhân Viên" name="staffId"><Input disabled /></Form.Item>
          <Form.Item label="Tên Nhân Viên" name="firstName" rules={[{ required: true, message: "Nhập tên nhân viên" }]}><Input /></Form.Item>
          <Form.Item label="Gmail" name="email" rules={[{ required: true, type: "email", message: "Nhập Gmail hợp lệ" }]}><Input /></Form.Item>
          <Button htmlType="submit">Cập Nhật Nhân Viên</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffMana;
