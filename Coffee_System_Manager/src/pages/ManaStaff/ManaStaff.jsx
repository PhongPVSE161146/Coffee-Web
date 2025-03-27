import React, { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Table, Select  } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/Axios";
import { createStyles } from 'antd-style';

const ManaStaff = () => {
  const [manaStaffList, setManaStaffList] = useState([]);
  const [selectedManaStaff, setSelectedManaStaff] = useState(null);
  const [storeMap, setStoreMap] = useState({});
  const [storeList, setStoreList] = useState([]);

  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [searchText, setSearchText] = useState("");

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
    fetchStores(); // Gọi API lấy danh sách cửa hàng
  }, []);
  
  async function fetchStores() {
    try {
      const response = await axiosInstance.get("https://coffeeshop.ngrok.app/api/stores");
      console.log("📌 Dữ liệu cửa hàng từ API:", response.data);
      
      const data = response.data?.stores || [];  // Lấy mảng stores từ API
      setStoreList(data); // Cập nhật storeList đúng cách
  
      console.log("📌 Danh sách cửa hàng sau khi setStoreList:", data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách cửa hàng:", error);
      setStoreList([]);
    }
  }

  async function fetchManaStaff() {
    try {
      const response = await axiosInstance.get(
        "https://coffeeshop.ngrok.app/api/managers?sortBy=ManagerId&isAscending=true&page=1&pageSize=10"
      );
      const managers = response.data?.managers || [];
  
      setManaStaffList(managers);
      setFilteredStaffList(managers);
  
      // Gọi API lấy store cho từng nhân viên (không loại bỏ storeId trùng)
      fetchStoreNames(managers.map((m) => m.storeId));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", error);
    }
  }
  
  async function fetchStoreNames(storeIds) {
    try {
      const storeData = { ...storeMap }; // Giữ lại dữ liệu cũ để tránh mất dữ liệu trước đó
  
      for (const storeId of storeIds) {
        const response = await axiosInstance.get(
          `https://coffeeshop.ngrok.app/api/stores/${storeId}`
        );
        storeData[storeId] = response.data?.storeName || "Không xác định";
      }
  
      setStoreMap(storeData); // Cập nhật storeMap với storeName chính xác
    } catch (error) {
      console.error("❌ Lỗi khi lấy tên cửa hàng:", error);
    }
  }

  // Hàm tìm kiếm theo tất cả thông tin
  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = manaStaffList.filter((staff) => {
      const fullName = `${staff.firstName} ${staff.lastName}`;
      const storeName = storeMap[staff.storeId] || "Không xác định";

      return (
        fullName.toLowerCase().includes(value.toLowerCase()) || // Tìm theo tên
        staff.managerId.toString().includes(value) || // Tìm theo mã quản lý
        staff.email.toLowerCase().includes(value.toLowerCase()) || // Tìm theo email
        staff.phoneNumber.includes(value) || // Tìm theo số điện thoại
        storeName.toLowerCase().includes(value.toLowerCase()) // Tìm theo tên cửa hàng
      );
    });

    setFilteredStaffList(filteredData);
  };

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
        storeId: values.storeId, // Lưu storeId
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
      render: (storeId) => storeMap[storeId] || "Đang tải...",
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
        {/* Thanh tìm kiếm */}
      <Input.Search
        placeholder="Nhập từ khóa tìm kiếm..."
        enterButton={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: "50%" }}
      />

      <Table
        bordered
        columns={columns}
        dataSource={filteredStaffList}
        scroll={{
          x: "max-content",
        }}
        pagination={{ pageSize: 5 }}
        style={{ width: "90%", maxWidth: "1200px" }}
      />

      <Button type="primary" onClick={showAddModal}>
        Thêm Quản Lý
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
          <Form.Item label="Số Điện Thoại" name="phoneNumber" rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có đúng 10 chữ số" }
                  ]}>
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item label="Cửa Hàng" name="storeId" rules={[{ required: true }]}>
            <Select placeholder="Chọn cửa hàng" loading={!storeList.length}>
              {storeList.map((store) => (
                <Select.Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Thêm quản lý mới
          </Button>
        </Form>
      </Modal>

      {/* Modal Chỉnh Sửa Nhân Viên */}
      <Modal title="Chỉnh Sửa Nhân Viên" open={isEditModalOpen} onCancel={handleEditCancel} footer={null}>
        <Form
          form={formUpdate}
          onFinish={updateManaStaff}
          onValuesChange={(changedValues, allValues) => {
            if (changedValues.email) {
              const username = changedValues.email.split("@")[0]; // Lấy phần trước @
              formUpdate.setFieldsValue({ username });
            }
          }}
        >
          <Form.Item label="Mã Quản Lý" name="managerId">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Tên đăng nhập" name="username">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Họ" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gmail" name="email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số Điện Thoại" name="phoneNumber" rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    { pattern: /^[0-9]{10}$/, message: "Số điện thoại phải có đúng 10 chữ số" }
                  ]}>
            <Input maxLength={10} />
          </Form.Item>
          <Form.Item label="Cửa Hàng" name="storeId" rules={[{ required: true }]}>
            <Select>
              {storeList.map((store) => (
                <Select.Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Cập Nhật Quản Lý
          </Button>
        </Form>
      </Modal>

      </div>
    </div>
  );
};

export default ManaStaff;
