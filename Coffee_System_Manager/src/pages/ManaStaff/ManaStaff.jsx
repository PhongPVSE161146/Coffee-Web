import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../axios/Axios";
import { UploadOutlined } from "@ant-design/icons";

const ManaStaff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [newData, setNewData] = useState("");
    const [manaStaffList, setManaStaffList] = useState("");
    const [selectedManaStaff, setSelectedManaStaff] = useState("");
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [form] = useForm();
    const [formUpdate] = useForm();
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

  async function fetchManaStaff() {
    const response = await axiosInstance.get("Staff");

    // Lọc danh sách nhân viên có role là "manaStaff"
    const filteredManaStaff = response.data.filter((staff) => staff.role === "manaStaff");

    setManaStaffList(filteredManaStaff);
}

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleUpdateOk = () => {
    setIsModalUpdateOpen(false);
  };
  const handleUpdateCancel = () => {
    setIsModalUpdateOpen(false);
  };
  function hanldeClickSubmit() {
    form.submit();
    setIsModalOpen(false);
    fetchManaStaff();
  }

  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };
  
  async function updateManaStaff(manaStaff) {
    try {
      const updatedValues = {
        ...newData,
      };
  
      await axiosInstance.put(`manaStaff/${manaStaff.id}`, updatedValues);
  
      toast.success("Cập nhật nhân viên thành công");
  
      // Cập nhật danh sách nhân viên hiện tại
      setManaStaffList((prevList) =>
        prevList.map((item) =>
          item.id === manaStaff.id ? { ...item, ...updatedValues } : item
        )
      );
  
      // Đóng modal sau khi cập nhật thành công
      setIsModalOpen(false);
  
      // Nếu cần, fetch lại data chính xác từ server
      fetchManaStaff();
    } catch (error) {
      toast.error("Có lỗi khi cập nhật nhân viên");
      console.log(error);
    }
  }  

  const columns = [
    {
      title: 'Tên Cửa Hàng',
      width: 130,
      dataIndex: 'storeName',
    },
    {
      title: "Mã Nhân Viên",
      width: 130,
      dataIndex: "mid",
      fixed: "left",
    },
    {
      title: "Tên Nhân Viên",
      width: 130,
      dataIndex: "name",
    },
    {
      title: "Gmail",
      width: 100,
      dataIndex: "gmail",
    },
    {
      title: "Hành Động",
      render: (record) => {
        return (
          <>
            <div className="action-button">
              {/* Nút Xóa */}
              <Button
                onClick={() => deleteStaff(record)}
                className="delete-button"
              >
                Xóa
              </Button>
  
              {/* Nút Chỉnh sửa */}
              <Button
                icon={<UploadOutlined />}
                className="admin-upload-button update-button"
                onClick={() => {
                  setSelectedManaStaff(record); // Chọn nhân viên hiện tại
                  formUpdate.setFieldsValue(record); // Đổ data vào form
                  setIsModalOpen(true); // Mở modal chỉnh sửa
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
  
            {/* Modal chỉnh sửa nhân viên */}
            <Modal
              className="modal-add-form"
              footer={false}
              title="Chỉnh Sửa Nhân Viên"
              open={isModalOpen}
              onOk={handleUpdateOk}
              onCancel={handleUpdateCancel}
            >
              <Form
                initialValues={selectedManaStaff}
                form={formUpdate}
                onValuesChange={(changedValues, allValues) => {
                  setNewData(allValues);
                }}
                onFinish={() => {
                  updateManaStaff(selectedManaStaff);
                }}
                id="form-update-staff"
                className="form-main"
              >
                <div className="form-content-main">
                  <div className="form-content">
                    {/* Mã nhân viên */}
                    <Form.Item
                      className="label-form"
                      label="Mã Nhân Viên"
                      name="mid"
                      rules={[
                        {
                          required: true,
                          message: "Nhập mã nhân viên",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>
  
                    {/* Tên nhân viên */}
                    <Form.Item
                      className="label-form"
                      label="Tên Nhân Viên"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Nhập tên nhân viên",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>
  
                    {/* Gmail */}
                    <Form.Item
                      className="label-form"
                      label="Gmail"
                      name="gmail"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Nhập Gmail hợp lệ",
                        },
                      ]}
                    >
                      <Input type="email" required />
                    </Form.Item>
  
                    {/* Ngày thêm nhân viên */}
                    <Form.Item
                      className="label-form"
                      label="Ngày Thêm"
                      name="adate"
                      rules={[
                        {
                          required: true,
                          message: "Chọn ngày thêm nhân viên",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Ngày Thêm"
                      />
                    </Form.Item>
  
                    {/* Vai trò */}
                    <Form.Item
                      className="label-form"
                      label="Vai Trò"
                      name="role"
                      initialValue="manageStore"
                    >
                      <Input value="Quản lý Cửa Hàng" disabled />
                    </Form.Item>
                  </div>
                </div>
  
                {/* Nút xác nhận chỉnh sửa */}
                <Button
                  onClick={() => handleClickUpdateSubmit()}
                  className="form-button"
                >
                  Cập Nhật Nhân Viên
                </Button>
              </Form>
            </Modal>
          </>
        );
      },
    },
  ];
  

  const data = [
    {
      key: 1,
      storeName: "Cửa Hàng A",
      mid: "NV001",
      name: "Nguyễn Văn A",
      gmail: "nguyenvana@example.com",
    },
    {
      key: 2,
      storeName: "Cửa Hàng B",
      mid: "NV002",
      name: "Trần Thị B",
      gmail: "tranthib@example.com",
    },
    {
      key: 3,
      storeName: "Cửa Hàng A",
      mid: "NV003",
      name: "Lê Văn C",
      gmail: "levanc@example.com",
    },
    {
      key: 4,
      storeName: "Cửa Hàng C",
      mid: "NV004",
      name: "Phạm Minh D",
      gmail: "phamminhd@example.com",
    },
    {
      key: 5,
      storeName: "Cửa Hàng D",
      mid: "NV005",
      name: "Hoàng Thị E",
      gmail: "hoangthie@example.com",
    },
    {
      key: 6,
      storeName: "Cửa Hàng B",
      mid: "NV006",
      name: "Đặng Văn F",
      gmail: "dangvanf@example.com",
    },
    {
      key: 7,
      storeName: "Cửa Hàng C",
      mid: "NV007",
      name: "Bùi Văn G",
      gmail: "buivang@example.com",
    },
  ];
  
  const { styles } = useStyle();

// Hàm thêm nhân viên mới
async function AddStaff(values) {
  try {
    // Chuẩn bị dữ liệu gửi lên server
    const payload = {
      mid: values.mid, // Mã nhân viên
      name: values.name, // Tên nhân viên
      gmail: values.gmail, // Gmail
      adate: values.adate.format("YYYY-MM-DD"), // Ngày thêm nhân viên (định dạng lại)
      role: "manageStore", // Vai trò nhân viên
    };

    // Gửi yêu cầu tạo nhân viên lên API
    await axiosInstance.post("staff", payload);

    // Xử lý sau khi thêm thành công
    toast.success("Thêm nhân viên thành công");

    // Fetch lại danh sách nhân viên
    fetchManaStaff();

    // Reset form và đóng modal
    form.resetFields();
    setIsModalOpen(false);
  } catch (error) {
    toast.error("Đã có lỗi khi thêm nhân viên");
    console.log(error);
  }
}

// Hàm xóa nhân viên
async function deleteStaff(staff) {
  try {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa nhân viên này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        await axiosInstance.delete(`staff/${staff.id}`); // API xóa theo ID nhân viên
        toast.success("Xóa nhân viên thành công");

        // Cập nhật lại danh sách nhân viên sau khi xóa
        setManaStaffList((prev) => prev.filter((item) => item.id !== staff.id));

        // Fetch lại danh sách nhân viên nếu cần
        fetchManaStaff();
      },
    });
  } catch (error) {
    console.log(error);
  }
}

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
      <Button type="primary" onClick={showModal}>
        Tạo thông tin nhân viên mới
      </Button>
      <Modal
        title="Thêm nhân viên"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          layout="horizontal"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 20 }}
          style={{ width: "100%" }}
          form={form}
          onFinish={AddStaff}
          id="form"
        >
          <Form.Item
            required
            label="Mã Nhân Viên"
            name="mid"
            rules={[
              {
                required: true,
                message: "Hãy nhập mã nhân viên",
              },
            ]}
          >
            <Input required />
          </Form.Item>
          <Form.Item
            required
            label="Tên Nhân Viên"
            name="name"
            rules={[
              {
                required: true,
                message: "Hãy nhập tên nhân viên",
              },
            ]}
          >
            <Input required />
          </Form.Item>
          <Form.Item
            required
            label="Gmail"
            name="gmail"
            rules={[
              {
                required: true,
                message: "Hãy nhập gmail nhân viên",
              },
            ]}
          >
            <Input required />
          </Form.Item>
          <Form.Item
            label="Vai Trò"
            name="role"
            initialValue="manageStore" // Đặt giá trị mặc định
          >
            <Input value="Quản lý Cửa Hàng" disabled /> {/* Chỉ hiển thị, không cho chọn */}
          </Form.Item>


          <Button htmlType="submit" className="form-button">
            Thêm nhân viên mới
          </Button>
        </Form>
      </Modal>
    </div>
  </div>
);

};

export default ManaStaff;