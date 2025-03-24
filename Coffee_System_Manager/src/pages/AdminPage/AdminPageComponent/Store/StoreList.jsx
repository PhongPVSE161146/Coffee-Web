import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Table, Upload } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";
import { SearchOutlined } from "@ant-design/icons";

const StoreList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUpdate] = useForm();
  const [storeList, setStoreList] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [newData, setNewData] = useState("");
  const [img, setImg] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [form] = useForm();
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
  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };
  function hanldeClickSubmit() {
    form.submit();
    setIsModalOpen(false);
    // fetchAccount();
  }
  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
    const filteredData = storeList.filter((product) =>
      product.productName.toLowerCase().includes(lowerValue) ||
      product.productId.toLowerCase().includes(lowerValue) ||
      product.categoryId.toLowerCase().includes(lowerValue) ||
      product.price.toString().includes(lowerValue)  // Chuyển price thành chuỗi để so sánh
    );
  
    setFilteredList(filteredData);
  };
  async function fetchStore() {
    try {
      const response = await axiosInstance.get("store");
      console.log("API response:", response);

      const data = response?.data?.stores;

      if (Array.isArray(data)) {
        setStoreList(data);
      } else {
        console.warn("Dữ liệu không đúng dạng mảng:", data);
        setStoreList([]);
      }

    } catch (error) {
      console.error("Lỗi fetch store:", error);
      setStoreList([]);
    }
  }


  useEffect(() => {
    fetchStore();
  }, []);

  async function AddStore(values) {
    try {
      console.log("Dữ liệu từ form gửi lên:", values);
      const payload = {
        storeId: values.storeId,
        storeName: values.storeName,
        address: values.address,
      };

      if (!img) {
        toast.error("Vui lòng chọn ảnh trước khi thêm cửa hàng");
        return;
      }

      const imgURL = await uploadFile(img);
      payload.imgURL = imgURL;

      await axiosInstance.post("store", payload);

      toast.success("Thêm máy thành công");

      // fetchStore();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Đã có lỗi khi thêm máy");
      console.log(error);
    }
    
  }


  async function updateStore(store) {
    try {
      const updatedValues = {
        ...newData,
      };
  
      if (img) {
        const imgURL = await uploadFile(img);
        updatedValues.imgURL = imgURL;
      }
  
      await axiosInstance.put(`store/${store.id}`, updatedValues);
  
      toast.success("Cập nhật máy thành công");
  
      setStoreList((prevList) =>
        prevList.map((item) =>
          item.id === store.id ? { ...item, ...updatedValues } : item
        )
      );
  
      setIsModalUpdateOpen(false); // nên dùng update modal
    } catch (error) {
      toast.error("Có lỗi khi cập nhật máy");
      console.log(error);
    }
  }
  

  async function deleteStore(store) {
    try {
      Modal.confirm({
        title: "Bạn có chắc muốn xóa sản phẩm này?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await axiosInstance.delete(`store/${store.id}`); // API xóa theo ID máy
          toast.success("Xóa sản phẩm thành công");

          // Cập nhật lại state danh sách máy (giả sử state là machineList)
          setStoreList((prev) => prev.filter((item) => item.id !== store.id));

          // Fetch lại danh sách máy (nếu cần)
          fetchStore();
        },
      });
    } catch (error) {
      // toast.error("Đã có lỗi trong lúc xóa máy");
      console.log(error);
    }
  }
  const columns = [
        { 
          title: "Mã Cửa Hàng", 
          dataIndex: "storeId", 
          sorter: (a, b) => a.storeId.localeCompare(b.storeId) 
        },
        { 
          title: "Tên Cửa Hàng", 
          dataIndex: "storeName", 
          sorter: (a, b) => a.storeName.localeCompare(b.storeName) 
        },
        { 
          title: "Địa Chỉ", 
          dataIndex: "storeLocation" 
        },
    {
      title: "Hình Ảnh ",
      dataIndex: "imgURL",
      key: "imgURL",
      render: (value) => <Image src={value} style={{ width: 80 }} />,
    },
    {
      title: "Hành Động",
      render: (record) => {
        return (
          <>
            <div className="action-button">
              {/* Nút Xóa */}
              <Button
                onClick={() => deleteStore(record)}
                className="delete-button"
              >
                Xóa
              </Button>

              {/* Nút Chỉnh sửa */}
              <Button
                icon={<UploadOutlined />}
                className="admin-upload-button update-button"
                onClick={() => {
                  setSelectedStore(record); // Chọn máy hiện tại
                  formUpdate.setFieldsValue(record); // Đổ data vào form
                  setIsModalOpen(true); // Mở modal chỉnh sửa
                }}
              >
                Chỉnh sửa
              </Button>
            </div>

            {/* Modal chỉnh sửa máy */}
            <Modal
              className="modal-add-form"
              footer={false}
              title="Chỉnh Sửa Máy"
              open={isModalUpdateOpen}
              onOk={handleUpdateOk}
              onCancel={handleUpdateCancel}
            >
              <Form
                initialValues={selectedStore}
                form={formUpdate}
                onValuesChange={(changedValues, allValues) => {
                  setNewData(allValues);
                }}
                onFinish={() => {
                  updateStore(selectedStore);
                }}
                id="form-update-machine"
                className="form-main"
              >
                <div className="form-content-main">
                  <div className="form-content">
                    <Form.Item
                      className="label-form"
                      label="Tên Cửa Hàng"
                      name="storeName"
                      rules={[
                        {
                          required: true,
                          message: "Nhập tên cửa hàng",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>
                    <Form.Item
                      className="label-form"
                      label="Địa chỉ"
                      name="storeAddress"
                      rules={[
                        {
                          required: true,
                          message: "Nhập địa chỉ cửa hàng",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>


                  </div>
                </div>

                {/* Nút xác nhận chỉnh sửa */}
                <Button
                  onClick={() => handleClickUpdateSubmit()}
                  className="form-button"
                >
                  Cập Nhật Máy
                </Button>
              </Form>
            </Modal>
          </>
        );
      },
    },
  ];

  const dataSource = [
    {
      key: "1",
      storeId: "CH001",
      storeName: "Cửa Hàng A",
      storeLocation: "123 Đường ABC, Quận 1, TP.HCM",
      imgURL: "https://via.placeholder.com/80",
    },
    {
      key: "2",
      storeId: "CH002",
      storeName: "Cửa Hàng B",
      storeLocation: "456 Đường XYZ, Quận 2, TP.HCM",
      imgURL: "https://via.placeholder.com/80",
    },
    {
      key: "3",
      storeId: "CH003",
      storeName: "Cửa Hàng C",
      storeLocation: "789 Đường DEF, Quận 3, TP.HCM",
      imgURL: "https://via.placeholder.com/80",
    },
    {
      key: "4",
      storeId: "CH004",
      storeName: "Cửa Hàng D",
      storeLocation: "101 Đường GHI, Quận 4, TP.HCM",
      imgURL: "https://via.placeholder.com/80",
    },
  ];
  

  const { styles } = useStyle();
  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      
    {/* Thanh tìm kiếm cố định NGAY DƯỚI HEADER */}
    <div 
      style={{
        position: "sticky",
        top: "60px", // Thay đổi nếu Header cao hơn 60px
        zIndex: 998, // Header nên có z-index > 998
        backgroundColor: "white",
        padding: "10px 0",
        width: "100%",
        textAlign: "center",
        boxShadow: "0px 1px 3px rgba(0,0,0,0.05)", 
      }}
    >
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: "50%", minWidth: "300px", marginBottom: 16 }}
      />
    </div>

    {/* Nội dung bảng */}
    <div className={styles.centeredContainer}>
      <Table
        bordered
        columns={columns}
        dataSource={dataSource}
        scroll={{
          x: 'max-content',
        }}
        pagination={{ pageSize: 5 }}
        style={{ width: "100%", maxWidth: "1200px", marginBottom: "20px" }}
      />
    
        <Button type="primary" onClick={showModal}>
          Tạo thông tin cửa hàng mới
        </Button>
        <Modal
          title="Tạo Thông Tin Cửa Hàng"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 20 }}
            style={{ width: "100%" }}
            form={form}
            onFinish={AddStore}
            id="form"
            className=""
          >
            <Form.Item
              required
              label="Mã Cửa Hàng"
              name="storeId"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mã cửa hàng",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Tên Cửa Hàng"
              name="storeName"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên cửa hàng",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Địa Chỉ"
              name="storeLocation"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập địa chỉ cửa hàng",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item className="label-form" label="Hình Ảnh " name="imgURL">
              <Upload
                fileList={img ? [img] : []}
                beforeUpload={(file) => {
                  setImg(file);
                  return false;
                }}
                onRemove={() => setImg(null)}
              >
                <Button icon={<UploadOutlined />}>Tải Hình Ảnh</Button>
              </Upload>{" "}
            </Form.Item>
            <Button onClick={hanldeClickSubmit} className="form-button ">
              Thêm Cửa Hàng Mới
            </Button>
          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default StoreList;

// import React, { useEffect, useState } from "react";
// import { Button, Form, Input, Modal, Table, Upload } from "antd";
// import { createStyles } from 'antd-style';
// import { useForm } from "antd/es/form/Form";
// import { axiosInstance } from "../../../../axios/Axios";
// import { toast } from "react-toastify";
// import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
// import uploadFile from "../../../../utils/uploadFile";

// const StoreList = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formUpdate] = useForm();
//   const [storeList, setStoreList] = useState([]);
//   const [selectedStore, setSelectedStore] = useState(null);
//   const [newData, setNewData] = useState(null);
//   const [img, setImg] = useState(null);
//   const [searchText, setSearchText] = useState("");
//   const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
//   const [form] = useForm();

//   async function fetchStore() {
//     try {
//       const response = await axiosInstance.get("store");
//       const data = response?.data?.stores;
//       setStoreList(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Lỗi fetch store:", error);
//       setStoreList([]);
//     }
//   }

//   useEffect(() => {
//     fetchStore();
//   }, []);

//   const handleSearch = (value) => {
//     setSearchText(value);
//   };

//   const filteredData = storeList.filter((store) =>
//     store.storeName.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const columns = [
//     { 
//       title: "Mã Cửa Hàng", 
//       dataIndex: "storeId", 
//       sorter: (a, b) => a.storeId.localeCompare(b.storeId) 
//     },
//     { 
//       title: "Tên Cửa Hàng", 
//       dataIndex: "storeName", 
//       sorter: (a, b) => a.storeName.localeCompare(b.storeName) 
//     },
//     { 
//       title: "Địa Chỉ", 
//       dataIndex: "storeLocation" 
//     },
//     {
//       title: "Hành Động",
//       render: (record) => (
//         <>
//           <Button onClick={() => deleteStore(record)}>Xóa</Button>
//           <Button onClick={() => {
//             setSelectedStore(record);
//             formUpdate.setFieldsValue(record);
//             setIsModalUpdateOpen(true);
//           }}>Chỉnh sửa</Button>
//         </>
//       ),
//     },
//   ];

//   async function deleteStore(store) {
//     Modal.confirm({
//       title: "Bạn có chắc muốn xóa cửa hàng này?",
//       okText: "Đồng ý",
//       cancelText: "Hủy",
//       onOk: async () => {
//         await axiosInstance.delete(`Store/${store.id}`);
//         toast.success("Xóa cửa hàng thành công");
//         fetchStore();
//       },
//     });
//   }

//   async function AddStore(values) {
//     try {
//       const payload = { ...values };
//       if (img) {
//         const imgURL = await uploadFile(img);
//         payload.imgURL = imgURL;
//       }
//       await axiosInstance.post("store", payload);
//       toast.success("Thêm cửa hàng thành công");
//       fetchStore();
//       form.resetFields();
//       setIsModalOpen(false);
//     } catch (error) {
//       toast.error("Đã có lỗi xảy ra");
//     }
//   }

//   return (
//     <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
//       <Input
//         placeholder="Tìm kiếm cửa hàng..."
//         prefix={<SearchOutlined />}
//         value={searchText}
//         onChange={(e) => handleSearch(e.target.value)}
//         style={{ width: 300, marginBottom: 16 }}
//       />
//       <Table bordered columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} style={{ width: "90%", maxWidth: "1200px" }} />
//       <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm Cửa Hàng</Button>
//       <Modal title="Tạo Cửa Hàng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
//         <Form form={form} onFinish={AddStore}>
//           <Form.Item label="Mã Cửa Hàng" name="storeId" rules={[{ required: true, message: "Nhập mã cửa hàng" }]}> <Input /> </Form.Item>
//           <Form.Item label="Tên Cửa Hàng" name="storeName" rules={[{ required: true, message: "Nhập tên cửa hàng" }]}> <Input /> </Form.Item>
//           <Form.Item label="Địa Chỉ" name="storeLocation" rules={[{ required: true, message: "Nhập địa chỉ" }]}> <Input /> </Form.Item>
//           <Form.Item label="Hình Ảnh" name="imgURL"> <Upload beforeUpload={(file) => { setImg(file); return false; }} onRemove={() => setImg(null)}> <Button icon={<UploadOutlined />}>Tải Hình Ảnh</Button> </Upload> </Form.Item>
//           <Button htmlType="submit">Thêm Cửa Hàng</Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default StoreList;