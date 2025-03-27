import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Table, Select } from "antd";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/Axios";
import { createStyles } from "antd-style";

const ManaStaff = () => {
  const [manaStaffList, setManaStaffList] = useState([]);
  const [filteredStaffList, setFilteredStaffList] = useState([]);
  const [selectedManaStaff, setSelectedManaStaff] = useState(null);
  const [storeMap, setStoreMap] = useState({});
  const [storeList, setStoreList] = useState([]);
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
      height: 100vh;
      width: 100%;
      flex-direction: column;
    `,
  }));

  const { styles } = useStyle();

  useEffect(() => {
    fetchManaStaff();
    fetchStores();
  }, []);

  async function fetchStores() {
    try {
      const response = await axiosInstance.get("stores");
      const data = response.data?.stores || [];
      setStoreList(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách cửa hàng:", error);
      setStoreList([]);
    }
  }

  async function fetchManaStaff() {
    try {
      const response = await axiosInstance.get("managers");
      const managers = response.data?.managers || [];

      setManaStaffList(managers);
      setFilteredStaffList(managers);

      fetchStoreNames(managers.map((m) => m.storeId));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách nhân viên:", error);
    }
  }

  async function fetchStoreNames(storeIds) {
    if (!storeIds || storeIds.length === 0) return;

    try {
      const storeData = { ...storeMap };

      for (const storeId of storeIds) {
        if (!storeMap[storeId]) {
          const response = await axiosInstance.get(`stores/${storeId}`);
          storeData[storeId] = response.data?.storeName || "Không xác định";
        }
      }

      setStoreMap(storeData);
    } catch (error) {
      console.error("❌ Lỗi khi lấy tên cửa hàng:", error);
    }
  }

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = manaStaffList.filter((staff) => {
      const fullName = `${staff.firstName} ${staff.lastName}`;
      const storeName = storeMap[staff.storeId] || "Không xác định";

      return (
        fullName.toLowerCase().includes(value.toLowerCase()) ||
        staff.managerId.toString().includes(value) ||
        staff.email.toLowerCase().includes(value.toLowerCase()) ||
        staff.phoneNumber.includes(value) ||
        storeName.toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredStaffList(filteredData);
  };

  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const showEditModal = (staff) => {
    setSelectedManaStaff(staff);
    setIsEditModalOpen(true);
    formUpdate.setFieldsValue(staff);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    formUpdate.resetFields();
  };

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
        storeId: values.storeId,
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

  async function updateManaStaff(values) {
    if (!selectedManaStaff?.managerId) {
      toast.error("Không tìm thấy ID nhân viên!");
      return;
    }

    const updatedData = {
      ...values,
      managerId: selectedManaStaff.managerId,
      username: values.email.split("@")[0],
    };

    try {
      await axiosInstance.put(`/api/managers/${selectedManaStaff.managerId}`, updatedData);
      toast.success("Cập nhật nhân viên thành công!");
      fetchManaStaff();
      handleEditCancel();
    } catch (error) {
      toast.error("Lỗi khi cập nhật nhân viên!");
    }
  }

  async function deleteStaff(staff) {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa nhân viên này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`/api/managers/${staff.managerId}`);
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
    },
    {
      title: "Mã Quản Lý",
      dataIndex: "managerId",
    },
    {
      title: "Tên Nhân Viên",
      render: (record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Gmail",
      dataIndex: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Hành Động",
      render: (record) => (
        <>
          <Button onClick={() => deleteStaff(record)}>Xóa</Button>
          <Button icon={<UploadOutlined />} onClick={() => showEditModal(record)}>Chỉnh sửa</Button>
        </>
      ),
    },
  ];

  return (
    <div className={styles.centeredContainer} style={{ padding: 24 }}>
      <Input.Search placeholder="Nhập từ khóa tìm kiếm..." enterButton={<SearchOutlined />} value={searchText} onChange={(e) => handleSearch(e.target.value)} />

      <Table columns={columns}
              dataSource={filteredStaffList}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 1000 }}
              style={{ width: '100%' }} />

      <Button type="primary" onClick={showAddModal}>Thêm Quản Lý</Button>

      <Modal title="Thêm Nhân Viên" open={isAddModalOpen} onCancel={handleAddCancel} footer={null}>
        <Form form={form} onFinish={AddStaff}              
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}>
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
          <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
            <Button type="primary" htmlType="submit">
              Thêm Quản lý mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Update Staff Modal */}
      <Modal
        title="Cập nhật thông tin nhân viên"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        footer={null}
        width={700}
      >
        <Form
          form={formUpdate}
          onFinish={updateManaStaff}
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

export default ManaStaff;
