import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../axios/Axios";
import { UploadOutlined } from "@ant-design/icons";

const TechMana = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [techStaffList, setTechStaffList] = useState([]);
  const [selectedTechStaff, setSelectedTechStaff] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị tìm kiếm
  const [filteredTechList, setFilteredTechList] = useState([]); // Danh sách sau khi lọc
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

  async function fetchTechStaff() {
    try {
      const response = await axiosInstance.get("technicians");
      console.log("API response:", response);

      const data = response?.data?.technicians;

      if (Array.isArray(data)) {
        setTechStaffList(data);
      } else {
        console.warn("Dữ liệu không đúng dạng mảng:", data);
        setTechStaffList([]);
      }

    } catch (error) {
      console.error("Lỗi fetch store:", error);
      setTechStaffList([]);
    }
  }

  useEffect(() => {
    fetchTechStaff();
  }, []);

  useEffect(() => {
    const filteredData = techStaffList.filter((staff) => {
      const technicianId = staff.technicianId ? String(staff.technicianId).toLowerCase() : "";
      const firstName = staff.firstName ? staff.firstName.toLowerCase() : "";
      const lastName = staff.lastName ? staff.lastName.toLowerCase() : "";
      const fullName = `${firstName} ${lastName}`;
      const email = staff.email ? staff.email.toLowerCase() : "";
      const phoneNumber = staff.phoneNumber ? staff.phoneNumber.toLowerCase() : "";
  
      return (
        technicianId.includes(searchTerm.toLowerCase()) ||
        firstName.includes(searchTerm.toLowerCase()) ||
        lastName.includes(searchTerm.toLowerCase()) ||
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        phoneNumber.includes(searchTerm.toLowerCase())
      );
    });
  
    setFilteredTechList(filteredData);
  }, [searchTerm, techStaffList]);

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
  function handleClickSubmit() {
    form.submit();
    setIsModalOpen(false);
    fetchTechStaff();
  }

  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };

  // async function updateTechStaff(techStaff) {
  //   try {
  //     const updatedValues = {
  //       ...newData,
  //     };

  //     await axiosInstance.put(`techStaff/${techStaff.id}` , updatedValues);

  //     toast.success("Cập nhật nhân viên thành công");

  //     // Cập nhật danh sách nhân viên hiện tại
  //     setTechStaffList((prevList) =>
  //       prevList.map((item) =>
  //         item.id === techStaff.id ? { ...item, ...updatedValues } : item
  //       )
  //     );

  //     // Đóng modal sau khi cập nhật thành công
  //     setIsModalOpen(false);

  //     // Nếu cần, fetch lại data chính xác từ server
  //     fetchTechStaff();

  //   } catch (error) {
  //     toast.error("Có lỗi khi cập nhật nhân viên");
  //     console.log(error);
  //   }
  // }

  async function updateTechStaff(values) {
    try {
      const payload = {
        
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
        email: values.email,

      };

      console.log("Payload cập nhật:", payload);

      const response = await axiosInstance.put(`technicians/${payload.technicianId}`, payload);
      console.log("Phản hồi từ API:", response.data);

      toast.success("Cập nhật nhân viên thành công");

      fetchTechStaff(); // Load lại danh sách
      formUpdate.resetFields();
      setTechStaffList(null);
    } catch (error) {
      toast.error("Đã có lỗi khi cập nhật nhân viên");
      console.log(error);
    }
  }
  const columns = [
    {
      title: "Mã Nhân Viên",
      dataIndex: "technicianId",

    },
    {
      title: "Tên Nhân Viên",
      dataIndex: "firstName",
      sorter: (a, b) => (a.firstName + " " + a.lastName).localeCompare(b.firstName + " " + b.lastName),
      render: (text, record) => `${record.firstName} ${record.lastName}`
    },
    {
      title: "Gmail",
      width: 100,
      dataIndex: "email",
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phoneNumber",

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
                  setSelectedTechStaff(record); // Chọn nhân viên hiện tại
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
                initialValues={selectedTechStaff}
                form={formUpdate}
                onValuesChange={(changedValues, allValues) => {
                  setNewData(allValues);
                }}
                onFinish={() => {
                  updateTechStaff(selectedTechStaff);
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
                      name="technicianId"
                      rules={[
                        {
                          required: true,
                          message: "Nhập mã nhân viên",
                        },
                      ]}
                    ></Form.Item>
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
                    <Form.Item
                      className="label-form"
                      label="Số Điện Thoại"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          type: "phoneNumber",
                          message: "Nhập số điện thoại hợp lệ",
                        },
                      ]}
                    >
                      <Input type="phoneNumber" required />
                    </Form.Item>



                    {/* Ngày thêm nhân viên */}
                    {/* <Form.Item
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
                    </Form.Item> */}

                    {/* Vai trò */}
                    {/* <Form.Item
                      className="label-form"
                      label="Vai Trò"
                      name="role"
                      initialValue="TechStaff"
                    >
                      <Input value="Nhân viên Kỹ thuật" disabled />
                    </Form.Item> */}
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
        technicianId: values.technicianId,
        firstName: values.firstName, 
        lastName: values.lastName, 
        phoneNumber: values.phoneNumber,
        email: values.email,
      };

      // Gửi yêu cầu tạo nhân viên lên API
      const response = await axiosInstance.post("https://coffeeshop.ngrok.app/api/technicians", payload);

      console.log("Phản hồi từ API:", response);
      
          // Kiểm tra phản hồi từ API
          if (response.status !== 201 && response.status !== 200) {
            throw new Error("Thêm nhân viên thất bại");
          }
      
          // Xử lý sau khi thêm thành công
          toast.success("Thêm nhân viên thành công");
      
          // Fetch lại danh sách nhân viên
         fetchTechStaff();
      
          // Reset form và đóng modal
          form.resetFields();
          setIsModalOpen(false);
        } catch (error) {
          toast.error("Đã có lỗi khi thêm nhân viên");
          console.error("Lỗi khi thêm nhân viên:", error.response?.data || error.message);
        }
      }

  // Hàm xóa nhân viên
  async function deleteStaff(staffTech) {
      try {
        Modal.confirm({
          title: "Bạn có chắc muốn xóa nhân viên này?",
          okText: "Đồng ý",
          cancelText: "Hủy",
          onOk: async () => {
            console.log("Đang xóa nhân viên có id:", staffTech.technicianId);
  
            if (!staffTech.technicianId) {
              toast.error("ID nhân viên không tồn tại");
              return;
            }
  
            await axiosInstance.delete(`/technicians/${staffTech.technicianId}`);
            toast.success("Xóa nhân viên thành công");
            setTechStaffList((prev) => prev.filter((item) => item.technicianId !== staffTech.technicianId));
            fetchTechStaff();
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  


  return (
    <div>
      <div className={styles.centeredContainer}>
        <Input
          placeholder="Tìm kiếm nhân viên..."
          style={{ width: "30%", marginBottom: 20 }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Table
          bordered
          columns={columns}
          dataSource={filteredTechList}
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

            <Button htmlType="submit" className="form-button">
              Thêm nhân viên mới
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );

};

export default TechMana;

// import React, { useEffect, useState } from "react";
// import { Button, DatePicker, Form, Input, Modal, Table } from "antd";
// import { SearchOutlined } from "@ant-design/icons";
// import { useForm } from "antd/es/form/Form";
// import { toast } from "react-toastify";
// import { axiosInstance } from "../../../axios/Axios";

// const TechMana = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [techStaffList, setTechStaffList] = useState([]);
//   const [searchText, setSearchText] = useState("");
//   const [form] = useForm();

//   async function fetchTechStaff() {
//     try {
//       const response = await axiosInstance.get("technician");
//       const data = response?.data?.technicians;
//       setTechStaffList(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Lỗi fetch store:", error);
//       setTechStaffList([]);
//     }
//   }

//   useEffect(() => {
//     fetchTechStaff();
//   }, []);

//   const handleSearch = (e) => {
//     setSearchText(e.target.value);
//   };

//   const filteredData = techStaffList.filter((staff) =>
//     staff.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
//     staff.technicianId.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const columns = [
// {
//   title: "Mã Nhân Viên",
//   dataIndex: "technicianId",
//   sorter: (a, b) => a.technicianId.localeCompare(b.technicianId),
// },
// {
//   title: "Tên Nhân Viên",
//   dataIndex: "firstName",
//   sorter: (a, b) => a.firstName.localeCompare(b.firstName),
// },
//     {
//       title: "Gmail",
//       dataIndex: "email",
//     },
//     {
//       title: "Chi Tiết",
//       render: () => <a>Xem thêm</a>,
//     },
//     {
//       title: "Hành Động",
//       render: (record) => <Button onClick={() => console.log("Edit", record)}>Chỉnh sửa</Button>,
//     },
//   ];

//   return (
//     <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
//       <Input
//         placeholder="Tìm kiếm nhân viên..."
//         prefix={<SearchOutlined />}
//         value={searchText}
//         onChange={handleSearch}
//         style={{ width: 300, marginBottom: 16 }}
//       />
//       <Table bordered columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} style={{ width: "90%", maxWidth: "1200px" }} />
//       <Button type="primary" onClick={() => setIsModalOpen(true)}>
//         Tạo thông tin nhân viên mới
//       </Button>
//       <Modal title="Thêm nhân viên" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
//         <Form form={form} onFinish={() => {}}>
//           <Form.Item label="Mã Nhân Viên" name="mid" rules={[{ required: true, message: "Nhập mã nhân viên" }]}> <Input /> </Form.Item>
//           <Form.Item label="Tên Nhân Viên" name="name" rules={[{ required: true, message: "Nhập tên nhân viên" }]}> <Input /> </Form.Item>
//           <Form.Item label="Gmail" name="gmail" rules={[{ required: true, type: "email", message: "Nhập Gmail hợp lệ" }]}> <Input /> </Form.Item>
//           <Form.Item name="adate" label="Ngày thêm nhân viên" rules={[{ required: true, message: "Chọn ngày thêm nhân viên" }]}> <DatePicker style={{ width: "100%" }} /> </Form.Item>
//           <Form.Item label="Vai Trò" name="role" initialValue="techStaff"> <Input value="Kỹ thuật viên" disabled /> </Form.Item>
//           <Button htmlType="submit">Thêm nhân viên mới</Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default TechMana;


