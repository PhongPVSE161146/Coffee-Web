import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table, message } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../axios/Axios";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const StaffMana = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form] = useForm();
  const [formUpdate] = useForm();
  const [loading, setLoading] = useState(false);
   const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
    const [filteredStaffList, setFilteredStaffList] = useState([]); // Danh sách sau khi lọc

  const useStyle = createStyles(({ css }) => ({
    centeredContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      width: 85vw;
      flex-direction: column;
      padding: 20px;
    `,
    actionButton: css`
      display: flex;
      gap: 8px;
    `,
  }));

  // Fetch staff data
  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("staffs");
      const data = response?.data?.staff?.map(item => ({
        ...item,
        key: item.id,
        fullName: ` ${item.lastName} ${item.firstName}`
      })) || [];
      setStaffList(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nhân viên:", error);
      message.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };
  const fetchStore = async () => {
    try {
      const response = await axiosInstance.get('/stores');
      const stores = response.data?.stores;

      if (Array.isArray(stores)) {
        setStoreList(stores);
      } else {
        console.warn('❗ Không nhận được danh sách store hợp lệ:', stores);
        setStoreList([]); // reset danh sách nếu không đúng định dạng
      }
    } catch (error) {
      console.error('❌ Lỗi khi gọi API /store:', error);
    }
  };
  useEffect(() => {
    fetchStaffs();
    fetchStore();
  }, []);

  useEffect(() => {
    const filteredData = staffList.filter((staff) => {
      const staffId = staff.staffId ? String(staff.staffId).toLowerCase() : "";
      const fullName = staff.fullName ? staff.fullName.toLowerCase() : "";

      return (
        staffId.includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase())
      );
    });

    setFilteredStaffList(filteredData);
  }, [searchTerm, staffList]);

  // Modal handlers
  const showCreateModal = () => setIsCreateModalOpen(true);
  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const showUpdateModal = () => setIsUpdateModalOpen(true);
  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    setSelectedStaff(null);
    formUpdate.resetFields();
  };

  // Form handlers
  const handleAddStaff = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        status: 1,
        storeId: values.storeId
      };

      await axiosInstance.post("staffs", payload);
      toast.success("Thêm nhân viên thành công!");
      fetchStaffs();
      handleCreateCancel();
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Đã có lỗi khi thêm nhân viên!");
    }
  };

  const handleUpdateStaff = async (values) => {
    try {
      if (!selectedStaff?.staffId) {
        throw new Error("Không tìm thấy ID nhân viên");
      }

      const payload = {
        staffId: selectedStaff.staffId,
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        storeId: values.storeId,
        email: values.email,
        status: selectedStaff.status || 1
      };

      await axiosInstance.put(`staffs/${selectedStaff.staffId}`, payload);
      toast.success("Cập nhật nhân viên thành công");
      fetchStaffs();
      handleUpdateCancel();
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật nhân viên");
    }
  };

  const handleDeleteStaff = async (staff) => {
    Modal.confirm({
      title: "Xác nhận xóa nhân viên",
      content: `Bạn có chắc muốn xóa nhân viên ${staff.fullName}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`staffs/${staff.staffId}`);
          toast.success("Xóa nhân viên thành công");
          fetchStaffs();
        } catch (error) {
          console.error("Lỗi khi xóa nhân viên:", error);
          toast.error(error.response?.data?.message || "Lỗi khi xóa nhân viên");
        }
      }
    });
  };

  const { styles } = useStyle();

  const columns = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'staffId',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'fullName',
      width: 200,
    
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      width: 150,
    },
    {
      title: "Hành động",
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <div className={styles.actionButton}>
          <Button
            danger
            onClick={() => handleDeleteStaff(record)}
          >
            Xóa
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => {
              setSelectedStaff(record);
              formUpdate.setFieldsValue({
                ...record,
                firstName: record.firstName,
                lastName: record.lastName
              });
              showUpdateModal();
            }}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.centeredContainer}>
       <Input
                placeholder="Tìm kiếm nhân viên..."
                style={{ width: "30%", marginBottom: 20 }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
      <Table
        bordered
        columns={columns}
        dataSource={filteredStaffList}
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ width: '100%' }}
      />
      <Button
        type="primary"
        onClick={showCreateModal}
        style={{ marginBottom: 16 }}
      >
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
          onFinish={handleAddStaff}
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
            name="storeId"
            label="Cửa hàng"
            rules={[{ required: true, message: "Vui lòng chọn cửa hàng!" }]}
          >
            <Select placeholder="Chọn cửa hàng">
              {storeList.map(store => (
                <Select.Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Select.Option>
              ))}
            </Select>
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

          <Form.Item>
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
          onFinish={handleUpdateStaff}
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
            name="storeId"
            label="Cửa hàng"
            rules={[{ required: true, message: "Vui lòng chọn cửa hàng!" }]}
          >
            <Select placeholder="Chọn cửa hàng">
              {storeList.map(store => (
                <Select.Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Select.Option>
              ))}
            </Select>
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

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StaffMana;
