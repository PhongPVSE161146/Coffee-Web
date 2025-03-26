import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Table } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/Axios";
import { createStyles } from 'antd-style';

const ManaStaff = () => {
  const [manaStaffList, setManaStaffList] = useState([]);
  const [selectedManaStaff, setSelectedManaStaff] = useState(null);
  const [storeNames, setStoreNames] = useState({}); 

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();

  const useStyle = createStyles(({ css }) => ({
    centeredContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh; // Chiều cao toàn màn hình
      width: 85w; // Chiều rộng toàn màn hình
      flex-direction: column;
    `,
  }));

  const { styles } = useStyle();

  useEffect(() => {
    fetchManaStaff();
  }, []);
  async function fetchManaStaff() {
    try {
      const response = await axiosInstance.get(
        "https://coffeeshop.ngrok.app/api/managers?sortBy=ManagerId&isAscending=true&page=1&pageSize=10"
      );
      const managers = response.data?.managers || [];
      setManaStaffList(managers);

      // Lấy danh sách storeId duy nhất
      // const storeIds = [...new Set(managers.map((staff) => staff.storeId))];
      // fetchStoreNames(storeIds);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", error);
    }
  }

  // async function fetchStoreNames(storeIds) {
  //   try {
  //     const storeData = {};
  //     await Promise.all(
  //       storeIds.map(async (id) => {
  //         const response = await axiosInstance.get(`https://coffeeshop.ngrok.app/api/stores/${id}`);
  //         storeData[id] = response.data?.storeName || "Không xác định";
  //       })
  //     );
  //     setStoreNames(storeData);
  //   } catch (error) {
  //     console.error("❌ Lỗi khi lấy thông tin cửa hàng:", error);
  //   }
  // }

  // Mở form Thêm nhân viên
  const showAddModal = () => {
    setIsAddModalOpen(true);
    setIsEditModalOpen(false); // Đảm bảo không mở cả hai
  };

  // Đóng form Thêm nhân viên
  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields(); // Reset form khi đóng modal
  };

  // Mở form Chỉnh sửa nhân viên
  const showEditModal = (staff) => {
    setSelectedManaStaff(staff);
    setIsEditModalOpen(true);
    setIsAddModalOpen(false); // Đảm bảo không mở cả hai
    formUpdate.setFieldsValue(staff); // Đổ dữ liệu vào form cập nhật
  };

  // Đóng form Chỉnh sửa nhân viên
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    formUpdate.resetFields(); // Reset form khi đóng modal
  };

  // Thêm nhân viên
  async function AddStaff(values) {
    try {
      const payload = {
        managerId: 0,
        username: values.email.split("@")[0],
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        status: 1,
        storeId: 1,
        store: null,
      };

      await axiosInstance.post("managers", payload);
      toast.success("Thêm nhân viên thành công!");
      fetchManaStaff();
      handleAddCancel();
    } catch (error) {
      toast.error("Lỗi khi thêm nhân viên!");
    }
  }

  // Cập nhật nhân viên
  async function updateManaStaff(values) {
    if (!selectedManaStaff?.managerId) {
      toast.error("Không tìm thấy ID nhân viên!");
      return;
    }
  
    const updatedData = {
      managerId: selectedManaStaff.managerId, // Cần gửi ID cho API
      ...values,
    };
  
    console.log("🛠 Gửi dữ liệu cập nhật:", updatedData); // Kiểm tra dữ liệu gửi lên API
  
    try {
      await axiosInstance.put(`managers/${selectedManaStaff.managerId}`, updatedData);
      toast.success("Cập nhật nhân viên thành công!");
      fetchManaStaff();
      handleEditCancel();
    } catch (error) {
      console.error("❌ API trả về lỗi:", error.response?.data || error.message);
      toast.error("Lỗi khi cập nhật nhân viên!");
    }
  }

  // Xóa nhân viên
  async function deleteStaff(staff) {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa nhân viên này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`managers/${staff.managerId}`);
          toast.success("Xóa nhân viên thành công!");
          fetchManaStaff();
        } catch (error) {
          toast.error("Xóa nhân viên thất bại!");
        }
      },
    });
  }

  const columns = [
    {
      title: "Tên Cửa Hàng",
      dataIndex: "storeId",
      // dataIndex: (record) => storeNames[record.storeId] || "Đang tải...",
      width: 130,
    },
    {
      title: "Mã Quản Lý",
      dataIndex: "managerId",
      width: 130,
    },
    {
      title: "Tên Nhân Viên",
      render: (record) => `${record.firstName} ${record.lastName}`,
      width: 130,
    },
    {
      title: "Gmail",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
      width: 150,
    },
    {
      title: "Hành Động",
      render: (record) => (
        <>
          <Button onClick={() => deleteStaff(record)}>Xóa</Button>
          <Button icon={<UploadOutlined />} onClick={() => showEditModal(record)}>
            Chỉnh sửa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.centeredContainer}>
      <Table
        bordered
        columns={columns}
        dataSource={manaStaffList}
        scroll={{
          x: "max-content",
        }}
        pagination={{ pageSize: 5 }}
        style={{ width: "90%", maxWidth: "1200px" }}
      />

      <Button type="primary" onClick={showAddModal}>
        Thêm Nhân Viên
      </Button>

      {/* Modal Thêm Nhân Viên */}
      <Modal title="Thêm Nhân Viên" open={isAddModalOpen} onCancel={handleAddCancel} footer={null}>
        <Form form={form} onFinish={AddStaff}>
          <Form.Item label="Họ" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gmail" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số Điện Thoại" name="phoneNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Thêm nhân viên mới
          </Button>
        </Form>
      </Modal>

      {/* Modal Chỉnh Sửa Nhân Viên */}
      <Modal title="Chỉnh Sửa Nhân Viên" open={isEditModalOpen} onCancel={handleEditCancel} footer={null}>
        <Form form={formUpdate} onFinish={updateManaStaff}>
          <Form.Item label="Họ" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gmail" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số Điện Thoại" name="phoneNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Cập Nhật Nhân Viên
          </Button>
        </Form>
      </Modal>
      </div>
    </div>
  );
};

export default ManaStaff;
