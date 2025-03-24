import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Image, Input, Modal, Select, Table, Upload } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";
import { SearchOutlined } from "@ant-design/icons";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [formUpdate] = useForm();
  const [productList, setProductList] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newData, setNewData] = useState("");
  const [img, setImg] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState([]);
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

  async function fetchProduct() {
    try {
      const response = await axiosInstance.get("product");
      console.log("API response:", response);

      const data = response?.data?.products;

      if (Array.isArray(data)) {
        setProductList(data);
      } else {
        console.warn("Dữ liệu không đúng dạng mảng:", data);
        setProductList([]);
      }

    } catch (error) {
      console.error("Lỗi fetch store:", error);
      setProductList([]);
    }
  }


  useEffect(() => {
    fetchProduct();
  }, []);


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
    fetchProduct();
  }
  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
  
    const filteredData = productList.filter((product) =>
      product.productName.toLowerCase().includes(lowerValue) ||
      product.productId.toLowerCase().includes(lowerValue) ||
      product.categoryId.toLowerCase().includes(lowerValue) ||
      product.price.toString().includes(lowerValue)  // Chuyển price thành chuỗi để so sánh
    );
  
    setFilteredList(filteredData);
  };
  

  async function AddProduct(values) {
    try {
      // Xử lý dữ liệu từ form (values)
      const payload = {
        productId: values.productId, // Mã sản phẩm
        productName: values.productName,      // Tên sản phẩm
        price: values.price, // Sản phẩm (danh sách sản phẩm đã chọn)
        categoryId: values.categoryId,
      };

      // Nếu có hình ảnh thì bạn có thể thêm bước upload ảnh ở đây (giống AddDiamond)
      const imgURL = await uploadFile(img);
      payload.imgURL = imgURL;

      // Gửi dữ liệu lên API
      await axiosInstance.post("Product", payload);

      // Xử lý sau khi thêm thành công
      toast.success("Thêm sản phẩm thành công");


      fetchProduct();

      form.resetFields();
      setIsModalOpen(false); // Đóng modal ThêmThêm sản phẩm
    } catch (error) {
      toast.error("Đã có lỗi khi thêm sản phẩm");
      console.log(error);
    }
  }


  async function updateProduct(product) {
    try {
      const updatedValues = {
        ...newData,
      };

      await axiosInstance.put(`Produc/${product.id}`, updatedValues);

      toast.success("Cập nhật sản phẩm thành công");

      // Cập nhật danh sách sản phẩm hiện tại
      setProductList((prevList) =>
        prevList.map((item) =>
          item.id === product.id ? { ...item, ...updatedValues } : item
        )
      );

      // Đóng modal sau khi cập nhật thành công
      setIsModalOpen(false);

      // Nếu cần, fetch lại data chính xác từ server
      fetchProduct();
    } catch (error) {
      toast.error("Có lỗi khi cập nhật sản phẩm");
      console.log(error);
    }
  }

  async function deleteProduct(product) {
    try {
      Modal.confirm({
        title: "Bạn có chắc muốn xóa sản phẩm này?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          console.log("Đang xóa product có id:", product.productId);

          if (!product.productId) {
            toast.error("ID sản phẩm không tồn tại");
            return;
          }

          await axiosInstance.delete(`/product/${product.productId}`);
          toast.success("Xóa sản phẩm thành công");
          setProductList((prev) => prev.filter((item) => item.id !== product.productId));
          fetchProduct();
        },

      });
    } catch (error) {
      // toast.error("Đã có lỗi trong lúc xóa sản phẩm");
      console.log(error);
    }
  }

  const columns = [
    {
      title: "Hình Ảnh ",
      dataIndex: "imgURL",
      key: "imgURL",
      render: (value) => <Image src={value} style={{ width: 80 }} />,
    },
    {
      title: 'Mã sản phẩm',
      width: 100,
      dataIndex: 'productId',
      fixed: 'left',
      sorter: (a, b) => a.productId.localeCompare(b.productId)
    },
    {
      title: 'Tên sản phẩm',
      width: 100,
      dataIndex: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName) 
    },
    {
      title: 'Loại sản phẩm',
      width: 100,
      dataIndex: 'categoryId',
      align: "center",
      sorter: (a, b) => a.categoryId.localeCompare(b.categoryId) 
    },
    {
      title: 'Giá sản phẩm',
      width: 100,
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Hành Động",
      render: (record) => {
        return (
          <>
            <div className="action-button">
              {/* Nút Xóa */}
              <Button
                onClick={() => deleteProduct(record)}
                className="delete-button"
              >
                Xóa
              </Button>

              {/* Nút Chỉnh sửa */}
              <Button
                icon={<UploadOutlined />}
                className="admin-upload-button update-button"
                onClick={() => {
                  setSelectedProduct(record); // Chọn sản phẩm hiện tại
                  formUpdate.setFieldsValue(record); // Đổ data vào form
                  setIsModalOpen(true); // Mở modal chỉnh sửa
                }}
              >
                Chỉnh sửa
              </Button>
            </div>

            {/* Modal chỉnh sửa sản phẩm */}
            <Modal
              title="Chỉnh sửa sản phẩm"
              open={isModalUpdateOpen}
              onOk={handleUpdateOk}
              onCancel={handleUpdateCancel}
              footer={null}
            >
              <Form
                layout="horizontal"
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 20 }}
                style={{ width: "100%" }}
                form={form}
                // onFinish={RegisterAccount}
                id="form"
                className=""
              >
                <Form.Item
                  required
                  label="Mã sản phẩm"
                  name="productId"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập mã sản phẩm",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  required
                  label="Tên sản phẩm"
                  name="productName"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập tên sản phẩm",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Form.Item
                  className="label-form"
                  label="Loại Sản Phẩm"
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: "Chọn Loại Sản Phẩm",
                    },
                  ]}
                >
                  <Select
                    className="select-input"
                    placeholder="chọn Loại Sản Phẩm"
                  >
                    <Select.Option value="ROUND">Cappuchino</Select.Option>
                    <Select.Option value="OVAL">Mocha</Select.Option>
                    <Select.Option value="CUSHION">Latte</Select.Option>
                    <Select.Option value="PEAR">Americano</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="doap"
                  label="Ngày thêm sản phẩm"
                  rules={[{ required: true, message: "Chọn ngày thêm sản phẩm" }]}
                >
                  <DatePicker
                    placeholder="Ngày Thêm Sản Phẩm"
                    style={{ width: "100%" }}
                  // format={dateFormat}
                  />
                </Form.Item>
                <Form.Item
                  required
                  label="Giá sản phẩm"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "Hãy nhập giá tiền",
                    },
                  ]}
                >
                  <Input required />
                </Form.Item>
                <Button onClick={handleClickUpdateSubmit} className="form-button ">
                  Cập Nhật Sản Phẩm
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
      imgURL: "https://via.placeholder.com/80",
      productId: "SP001",
      productName: "Cappuccino",
      categoryId: "Coffee",
      price: 50000,
      doap: "2024-03-20",
    },
    {
      key: "2",
      imgURL: "https://via.placeholder.com/80",
      productId: "SP002",
      productName: "Mocha",
      categoryId: "Coffee",
      price: 55000,
      doap: "2024-03-18",
    },
    {
      key: "3",
      imgURL: "https://via.placeholder.com/80",
      productId: "SP003",
      productName: "Latte",
      categoryId: "Coffee",
      price: 52000,
      doap: "2024-03-15",
    },
    {
      key: "4",
      imgURL: "https://via.placeholder.com/80",
      productId: "SP004",
      productName: "Americano",
      categoryId: "Coffee",
      price: 45000,
      doap: "2024-03-10",
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
          Thêm sản phẩm mới
        </Button>

        <Modal
          title="Thêm sản phẩm"
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
            // onFinish={RegisterAccount}
            id="form"
            className=""
          >
            <Form.Item
              required
              label="Mã sản phẩm"
              name="productId"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mã sản phẩm",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên sản phẩm",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              className="label-form"
              label="Loại Sản Phẩm"
              name="type"
              rules={[
                {
                  required: true,
                  message: "Chọn Loại Sản Phẩm",
                },
              ]}
            >
              <Select
                className="select-input"
                placeholder="chọn Loại Sản Phẩm"
              >
                <Select.Option value="ROUND">Cappuchino</Select.Option>
                <Select.Option value="OVAL">Mocha</Select.Option>
                <Select.Option value="CUSHION">Latte</Select.Option>
                <Select.Option value="PEAR">Americano</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              required
              label="Giá sản phẩm"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập giá tiền",
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
              Thêm sản phẩm mới
            </Button>
          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default ProductList;