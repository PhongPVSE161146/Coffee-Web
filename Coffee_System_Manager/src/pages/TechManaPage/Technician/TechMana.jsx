
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../axios/Axios";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TechMana = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [techList, setTechList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTechList, setFilteredTechList] = useState([]);

  const [form] = useForm();
  const [formUpdate] = useForm();
  const [loading, setLoading] = useState(false);

  // Fetch technicians
  const fetchTechs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("technicians");
      const data =
        response?.data?.technicians?.map((item) => ({
          ...item,
          key: item.technicianId,
          fullName: `${item.lastName} ${item.firstName}`,
        })) || [];
      setTechList(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách kỹ thuật viên");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stores
  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get("/stores");
      setStoreList(response.data?.stores || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách cửa hàng:", error);
    }
  };

  useEffect(() => {
    fetchTechs();
    fetchStores();
  }, []);

  useEffect(() => {
    const filteredData = techList.filter((tech) => {
      const techId = tech.technicianId ? String(tech.technicianId).toLowerCase() : "";
      const fullName = tech.fullName ? tech.fullName.toLowerCase() : "";
      return techId.includes(searchTerm.toLowerCase()) || fullName.includes(searchTerm.toLowerCase());
    });

    setFilteredTechList(filteredData);
  }, [searchTerm, techList]);

  // Modal handlers
  const showCreateModal = () => setIsCreateModalOpen(true);
  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const showUpdateModal = () => setIsUpdateModalOpen(true);
  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    setSelectedTech(null);
    formUpdate.resetFields();
  };

  // Add technician
  const handleAddTech = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        storeId: values.storeId,
        status: 1,
      };

      await axiosInstance.post("technicians", payload);
      toast.success("Thêm kỹ thuật viên thành công!");
      fetchTechs();
      handleCreateCancel();
    } catch (error) {
      toast.error("Lỗi khi thêm kỹ thuật viên!");
    }
  };

  // Update technician
  const handleUpdateTech = async (values) => {
    try {
      if (!selectedTech?.technicianId) throw new Error("Không tìm thấy ID kỹ thuật viên");

      const payload = {
        technicianId: selectedTech.technicianId,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        storeId: values.storeId,
        status: selectedTech.status || 1,
      };

      await axiosInstance.put(`technicians/${selectedTech.technicianId}`, payload);
      toast.success("Cập nhật kỹ thuật viên thành công");
      fetchTechs();
      handleUpdateCancel();
    } catch (error) {
      toast.error("Lỗi khi cập nhật kỹ thuật viên");
    }
  };

  // Delete technician
  const handleDeleteTech = async (tech) => {
    Modal.confirm({
      title: "Xác nhận xóa kỹ thuật viên",
      content: `Bạn có chắc muốn xóa kỹ thuật viên ${tech.fullName}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`technicians/${tech.technicianId}`);
          toast.success("Xóa kỹ thuật viên thành công");
          fetchTechs();
        } catch (error) {
          toast.error("Lỗi khi xóa kỹ thuật viên");
        }
      },
    });
  };

  const columns = [
    {
      title: "Mã NV",
      dataIndex: "technicianId",
      width: 100,
    },
    {
      title: "Họ và Tên",
      dataIndex: "fullName",
      width: 200,
    },
    {
      title: "Gmail",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Số ĐT",
      dataIndex: "phoneNumber",
      width: 150,
    },
    {
      title: "Hành động",
      width: 200,
      render: (_, record) => (
        <>
          <Button danger onClick={() => handleDeleteTech(record)} icon={<DeleteOutlined />} style={{ marginRight: 8 }}>
            Xóa
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedTech(record);
              formUpdate.setFieldsValue(record);
              showUpdateModal();
            }}
          >
            Sửa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <Input placeholder="🔍 Tìm kiếm nhân viên..." style={{ width: "30%", marginBottom: 20 }} onChange={(e) => setSearchTerm(e.target.value)} />

      <Table bordered columns={columns} dataSource={filteredTechList} loading={loading} pagination={{ pageSize: 10 }} />

      <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} style={{ marginTop: 20 }}>
        Thêm nhân viên mới
      </Button>

      {/* Create Staff Modal */}
            <Modal
              title="Thêm nhân viên mới"
              open={isCreateModalOpen}
              onCancel={handleCreateCancel}
              footer={null}
              width={700}
            >
              <Form
                form={form}
                onFinish={handleAddTech}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Form.Item
                  name="lastName"
                  label="Họ"
                  rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="firstName"
                  label="Tên"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input />
                </Form.Item>
                
               
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email', message: "Vui lòng nhập email hợp lệ!" }]}
                >
                  <Input />
                </Form.Item>
      
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                  <Input />
                </Form.Item>
      
                <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                  <Button type="primary" htmlType="submit">
                    Thêm nhân viên
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
      
            {/* Update Staff Modal */}
            <Modal
              title="Cập nhật thông tin nhân viên"
              open={isUpdateModalOpen}
              onCancel={handleUpdateCancel}
              footer={null}
              width={700}
            >
              <Form
                form={formUpdate}
                onFinish={handleUpdateTech}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Form.Item
                  name="lastName"
                  label="Họ"
                  rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="firstName"
                  label="Tên"
                  rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                >
                  <Input />
                </Form.Item>
                
      
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[{ required: true, type: 'email', message: "Vui lòng nhập email hợp lệ!" }]}
                >
                  <Input />
                </Form.Item>
      
                <Form.Item
                  name="phoneNumber"
                  label="Số điện thoại"
                  rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
                >
                  <Input />
                </Form.Item>
      
                <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
    </div>
  );
};

export default TechMana;

