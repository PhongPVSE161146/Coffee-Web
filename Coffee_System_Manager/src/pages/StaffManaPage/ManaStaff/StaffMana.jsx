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
  const [staffManaList, setStaffManaList] = useState([]);
  const [selectedStaffMana, setSelectedStaffMana] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
  const [filteredStaffList, setFilteredStaffList] = useState([]); // Danh sách sau khi lọc

  const [form] = useForm();
  const [formUpdate] = useForm();

  const [email, setEmail] = useState(sessionStorage.getItem("email") || "");
  
    useEffect(() => {
      const storedEmail = sessionStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }, []);
    
  
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

useEffect(() => {
  fetchStoreId(); // Lấy storeId trước
}, []);

async function fetchStoreId() {
  try {
    const response = await axiosInstance.get("https://coffeeshop.ngrok.app/api/managers");
    console.log("Danh sách managers:", response.data);

    const managers = response?.data?.managers; // Kiểm tra key trả về từ API
    if (!Array.isArray(managers)) {
      console.warn("Dữ liệu không phải mảng:", managers);
      return;
    }

    // Tìm manager có email khớp với sessionStorage
    const manager = managers.find((m) => m.email === email);
    if (!manager) {
      console.warn("Không tìm thấy manager có email khớp:", email);
      return;
    }

    console.log("Manager tìm thấy:", manager);
    const storeId = manager.storeId;
    
    if (storeId) {
      fetchStaffMana(storeId); // Gọi API nhân viên với storeId
    }
  } catch (error) {
    console.error("Lỗi fetch managers:", error);
  }
}

async function fetchStaffMana(storeId) {
  try {
    const response = await axiosInstance.get(`https://coffeeshop.ngrok.app/api/staffs?storeId=${storeId}`);
    console.log("Danh sách nhân viên:", response.data);

    const data = response?.data?.staff; // Kiểm tra key trả về từ API
    if (Array.isArray(data)) {
      setStaffManaList(data);
    } else {
      console.warn("Dữ liệu không phải mảng:", data);
      setStaffManaList([]);
    }
  } catch (error) {
    console.error("Lỗi fetch staffs:", error);
    setStaffManaList([]);
  }
}


  useEffect(() => {
    const filteredData = staffManaList.filter((staff) => {
      const staffId = staff.staffId ? String(staff.staffId).toLowerCase() : "";
      const firstName = staff.firstName ? staff.firstName.toLowerCase() : "";
      const lastName = staff.lastName ? staff.lastName.toLowerCase() : "";
      const fullName = `${firstName} ${lastName}`;
      const email = staff.email ? staff.email.toLowerCase() : "";
      const phoneNumber = staff.phoneNumber ? staff.phoneNumber.toLowerCase() : "";
  
      return (
        staffId.includes(searchTerm.toLowerCase()) || 
        firstName.includes(searchTerm.toLowerCase()) ||
        lastName.includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase())||
        email.includes(searchTerm.toLowerCase()) ||
        phoneNumber.includes(searchTerm.toLowerCase())
      );
    });
  
    setFilteredStaffList(filteredData);
  }, [searchTerm, staffManaList]);

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
async function updateStaffMana(values) {
  try {
    const payload = {
     
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };
    console.log("Payload cập nhật:", payload);

    const response = await axiosInstance.put(`staffs/${payload.staffId}`, payload);
    console.log("Phản hồi từ API:", response.data);

    toast.success("Cập nhật nhân viên thành công");

    fetchStaffMana(); // Load lại danh sách
    formUpdate.resetFields();
    setStaffManaList(null);
  } catch (error) {
    toast.error("Đã có lỗi khi cập nhật nhân viên");
    console.log(error);
  }
}
  

const columns = [

    { 
      title: "Mã Nhân Viên", 
      dataIndex: "staffId", 
     
    },
    {
      title: "Tên Nhân Viên",
      render: (record) => `${record.firstName} ${record.lastName}`,
      width: 130,
    },
    { 
      title: "Số Điện Thoại", 
      dataIndex: "phoneNumber", 
     
    },
    { 
      title: "Gmail", 
      dataIndex: "email" 
    }, 
    // {
    //   title: "Chi Tiết",
    //   width: 90,
    //   render: () => <a>Xem thêm</a>,
    // },
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
                    
                    {/* Họ nhân viên */}
                    <Form.Item
                      className="label-form"
                      label="Họ Nhân Viên"
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Nhập họ nhân viên",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>
                    {/* Tên nhân viên */}
                    <Form.Item
                      className="label-form"
                      label="Tên Nhân Viên"
                      name="lastName"
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
  
  const { styles } = useStyle();

  // Hàm thêm nhân viên mới
  async function AddStaff(values) {
  try {
    // Kiểm tra dữ liệu đầu vào
    console.log("Dữ liệu nhập vào:", values);


    // Chuẩn bị dữ liệu gửi lên server
    const payload = {
      firstName: values.firstName, // họ
      lastName: values.lastName,   // ten
      email: values.email,
      phoneNumber: values.phoneNumber, 
    }
    console.log("Payload gửi lên API:", payload);

    // Gửi yêu cầu tạo nhân viên lên API
    const response = await axiosInstance.post("https://coffeeshop.ngrok.app/api/staffs", payload);

    console.log("Phản hồi từ API:", response);

    // Kiểm tra phản hồi từ API
    if (response.status !== 201 && response.status !== 200) {
      throw new Error("Thêm nhân viên thất bại");
    }

    // Xử lý sau khi thêm thành công
    toast.success("Thêm nhân viên thành công");

    // Fetch lại danh sách nhân viên
   fetchStaffMana();

    // Reset form và đóng modal
    form.resetFields();
    setIsModalOpen(false);
  } catch (error) {
    toast.error("Đã có lỗi khi thêm nhân viên");
    console.error("Lỗi khi thêm nhân viên:", error.response?.data || error.message);
  }
}
  // Hàm xóa nhân viên
  async function deleteStaff(staff) {
    try {
      Modal.confirm({
        title: "Bạn có chắc muốn xóa nhân viênnày?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          console.log("Đang xóa nhân viên có id:", staff.staffId);

          if (!staff.staffId) {
            toast.error("ID nhân viên không tồn tại");
            return;
          }

          await axiosInstance.delete(`/staffs/${staff.staffId}`);
          toast.success("Xóa nhân viên thành công");
          setStaffManaList((prev) => prev.filter((item) => item.staffId !== staff.staffId));
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
      {/* Thanh tìm kiếm */}
<Input
  placeholder="Tìm kiếm nhân viên..."
  style={{ width: "30%", marginBottom: 20 }}
  onChange={(e) => setSearchTerm(e.target.value)}
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
             label="Họ Nhân Viên"
             name="firstName"
             rules={[
               {
                 required: true,
                 message: "Hãy nhập họ nhân viên",
               },
             ]}
           >
             <Input required />
           </Form.Item>
           <Form.Item
             required
             label="Tên Nhân Viên"
             name="lastName"
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
             label="Số Điện Thoại"
             name="phoneNumber"
             rules={[
               {
                 required: true,
                 message: "Hãy nhập số điện thoại nhân viên",
               },
             ]}
           >
             <Input required />
           </Form.Item>
           <Form.Item
             required
             label="Gmail"
             name="email"
             rules={[
               {
                 required: true,
                 message: "Hãy nhập gmail nhân viên",
               },
             ]}
           >
             <Input required />
           </Form.Item>
           
 
           {/* <Button htmlType="submit" className="form-button">
             Thêm nhân viên mới
           </Button> */}
         </Form>
       </Modal>
     </div>
   </div>
 );
 
 };

export default StaffMana;
