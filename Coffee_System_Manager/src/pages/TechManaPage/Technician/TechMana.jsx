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
          const response = await axiosInstance.get("technician");
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

useEffect (() => {
    fetchTechStaff();
  }, []);

  useEffect(() => {
    const filteredData = techStaffList.filter((techStaff) => {
      const technicianId = techStaff.technicianId ? String(techStaff.technicianId).toLowerCase() : "";
      const firstName = techStaff.firstName ? techStaff.firstName.toLowerCase() : "";
      return technicianId.includes(searchTerm.toLowerCase()) || firstName.includes(searchTerm.toLowerCase());
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

  async function updateTechStaff(techStaff) {
    try {
      const updatedValues = {
        ...newData,
      };
  
      await axiosInstance.put(`techStaff/${techStaff.id}` , updatedValues);
  
      toast.success("Cập nhật nhân viên thành công");
  
      // Cập nhật danh sách nhân viên hiện tại
      setTechStaffList((prevList) =>
        prevList.map((item) =>
          item.id === techStaff.id ? { ...item, ...updatedValues } : item
        )
      );
  
      // Đóng modal sau khi cập nhật thành công
      setIsModalOpen(false);
  
      // Nếu cần, fetch lại data chính xác từ server
      fetchTechStaff();

    } catch (error) {
      toast.error("Có lỗi khi cập nhật nhân viên");
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
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
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
                    >
                      <Input type="text" required />
                    </Form.Item>
  
                    {/* Tên nhân viên */}
                    <Form.Item
                      className="label-form"
                      label="Tên Nhân Viên"
                      name="firstName"
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
      role: "techStaff", // Vai trò nhân viên
    };

    // Gửi yêu cầu tạo nhân viên lên API
    await axiosInstance.post("staff", payload);

    // Xử lý sau khi thêm thành công
    toast.success("Thêm nhân viên thành công");

    // Fetch lại danh sách nhân viên
    fetchTechStaff();

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
        setTechStaffList((prev) => prev.filter((item) => item.id !== staff.id));

        // Fetch lại danh sách nhân viên nếu cần
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
            label="Vai Trò"
            name="role"
            initialValue="techStaff" // Đặt giá trị mặc định
          >
            <Input value="Kỹ thuật viên" disabled /> {/* Chỉ hiển thị, không cho chọn */}
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


