import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";

const StaffMana = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [staffManaList, setStaffManaList] = useState("");
  const [selectedStaffMana, setSelectedStaffMana] = useState("");
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

async function fetchStaffMana() {
  try {
        const response = await axiosInstance.get("staffs");
        console.log("API response:", response);
  
        const data = response?.data?.staffs;
  
        if (Array.isArray(data)) {
          setStaffManaList(data);
        } else {
          console.warn("Dữ liệu không đúng dạng mảng:", data);
          setStaffManaList([]);
        }
  
      } catch (error) {
        console.error("Lỗi fetch store:", error);
        setStaffManaList([]);
      }
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
  fetchStaffMana();
}

const handleClickUpdateSubmit = () => {
  formUpdate.submit();
};

useEffect(() => {
  fetchStaffMana();
  }, []);

async function updateStaffMana(staff) {
  try {
    const updatedValues = {
      ...newData,
    };

    await axiosInstance.put(`staffMana/${staff.id}`, updatedValues);

    toast.success("Cập nhật nhân viên thành công");

    // Cập nhật danh sách nhân viên hiện tại
    setStaffManaList((prevList) =>
      prevList.map((item) =>
        item.id === staff.id ? { ...item, ...updatedValues } : item
      )
    );

    // Đóng modal sau khi cập nhật thành công
    setIsModalOpen(false);    
    // fetchAccount();

    // Nếu cần, fetch lại data chính xác từ server
    fetchStaffMana();
  } catch (error) {
    toast.error("Có lỗi khi cập nhật nhân viên");
    console.log(error);
  }
}  
  

const columns = [
  {
    title: "Mã Nhân Viên",
    width: 100,
    dataIndex: "staffId",
    fixed: "left",
  },
  {
    title: "Tên Nhân Viên",
    width: 100,
    dataIndex: "firstName"+" "+"lastName",
  },
  {
    title: "Gmail",
    width: 100,
    dataIndex: "email",
  },    
    {
      title: "Chi Tiết",
      width: 90,
      render: () => <a>Xem thêm</a>,
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
                  setSelectedStaffMana(record); // Chọn nhân viên hiện tại
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
                initialValues={selectedStaffMana}
                form={formUpdate}
                onValuesChange={(changedValues, allValues) => {
                  setNewData(allValues);
                }}
                onFinish={() => {
                  updateStaffMana(selectedStaffMana);
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
                      name="staffId"
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
                      name="email"
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
      mid: '1',
      name: 'Olivia',
      gmail: 'olivia456',
      age: 32,
      address: 'New York Park',
      adate: '01/01/2025',
    },
    {
      mid: '2',
      name: 'Ethan',
      gmail: 'ethan123',
      age: 40,
      address: 'London Park',
      adate: '01/01/2025',
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
        role: values.role, // Vai trò nhân viên
      };
  
      // Gửi yêu cầu tạo nhân viên lên API
      await axiosInstance.post("staff", payload);
  
      // Xử lý sau khi thêm thành công
      toast.success("Thêm nhân viên thành công");
  
      // Fetch lại danh sách nhân viên
      fetchStaffMana();
  
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
          setStaffManaList((prev) => prev.filter((item) => item.id !== staff.id));
  
          // Fetch lại danh sách nhân viên nếu cần
          fetchStaffMana();
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
         dataSource={staffs}
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
             name="adate"
             label="Ngày thêm nhân viên"
             rules={[{ required: true, message: "Chọn ngày thêm nhân viên" }]}
           >
             <DatePicker
               placeholder="Ngày Thêm Nhân Viên"
               style={{ width: "100%" }}
             />
           </Form.Item>
           <Form.Item
             required
             label="Vai trò"
             name="role"
             rules={[{ required: true, message: "Chọn vai trò của nhân viên" }]}
           >
             <Select placeholder="Chọn vai trò">
               <Option value="SALES">Nhân viên bán hàng</Option>
               <Option value="DELIVERY">Nhân viên giao hàng</Option>
               <Option value="MANAGER">Quản lý</Option>
             </Select>
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

export default StaffMana;