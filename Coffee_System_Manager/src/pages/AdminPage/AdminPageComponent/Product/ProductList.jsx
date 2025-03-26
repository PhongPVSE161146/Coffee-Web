import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Image, Input, Modal, Select, Table, Upload } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";

const ProductList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [formUpdate] = useForm();
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [newData, setNewData] = useState("");
  const [img, setImg] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
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
  async function fetchCategory() {
    try {
      const response = await axiosInstance.get("category");
      console.log("API response:", response);

      const data = response?.data?.categories;

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.warn("Dữ liệu không đúng dạng mảng:", data);
        setCategories([]);
      }

    } catch (error) {
      console.error("Lỗi fetch category:", error);
      setCategories([]);
    }
  }

  useEffect(() => {
    fetchProduct();
    fetchCategory();
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

  async function AddProduct(values) {
    try {
      // Xử lý dữ liệu từ form (values)
      const payload = {
        productId: values.productId, // Mã máy
        productName: values.productName,      // Tên máy
        price: values.price, // Sản phẩm (danh sách sản phẩm đã chọn)
      };

      // Nếu có hình ảnh thì bạn có thể thêm bước upload ảnh ở đây (giống AddDiamond)
      // const imgURL = await uploadFile(img);
      // payload.imgURL = imgURL;

      // Gửi dữ liệu lên API
      await axiosInstance.post("product", payload);

      // Xử lý sau khi thêm thành công
      toast.success("Thêm máy thành công");


      fetchProduct();

      form.resetFields();
      setIsModalOpen(false); // Đóng modal tạo máy
    } catch (error) {
      toast.error("Đã có lỗi khi thêm máy");
      console.log(error);
    }
  }


  async function updateProduct(product) {
    try {
      const updatedValues = {
        ...newData,
      };

      await axiosInstance.put(`product/${product.id}`, updatedValues);

      toast.success("Cập nhật máy thành công");

      // Cập nhật danh sách máy hiện tại
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
      toast.error("Có lỗi khi cập nhật máy");
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
      // toast.error("Đã có lỗi trong lúc xóa máy");
      console.log(error);
    }
  }

  const columns = [
    {
      title: 'Mã sản phẩm',
      width: 120,
      dataIndex: 'productCode',
      fixed: 'left',
    },
    {
      title: "Hình Ảnh ",
      dataIndex: "imgURL",
      key: "imgURL",
      render: (value) => <Image src={value} style={{ width: 80 }} />,
    },
    {
      title: 'Tên sản phẩm',
      width: 130,
      dataIndex: 'productName',
    },
    {
      title: 'Loại sản phẩm',
      width: 130,
      dataIndex: 'categoryId',
    },
    {
      title: 'Giá sản phẩm',
      width: 130,
      dataIndex: 'price',
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
                  setSelectedProduct(record);
                  formUpdate.setFieldsValue(record);
                  setIsModalUpdateOpen(true); 
                }}
              >
                Chỉnh sửa
              </Button>
            </div>

            {/* Modal chỉnh sửa máy */}
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
                  name="categoryId" // nên là id để dễ xử lý backend
                  rules={[
                    {
                      required: true,
                      message: "Chọn Loại Sản Phẩm",
                    },
                  ]}
                >
                  <Select
                    className="select-input"
                    placeholder="Chọn Loại Sản Phẩm"
                  >
                    {categories.map((category) => (
                      <Select.Option
                        key={category.categoryId} // unique key
                        value={category.categoryId} // backend nhận id
                      >
                        {category.categoryName}
                      </Select.Option>
                    ))}
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




  const { styles } = useStyle();
  return (
    <div>
      <div className={styles.centeredContainer}>
        <Table
          bordered
          columns={columns}
          dataSource={productList}
          scroll={{
            x: 'max-content',
          }}
          pagination={{ pageSize: 5 }}
          style={{ width: "90%", maxWidth: "1200px" }}
        />
        <Button type="primary" onClick={showModal}>
          Tạo thông tin sản phẩm mới
        </Button>
        <Modal
          title="Tạo máy"
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
            onFinish={AddProduct}
            id="form"
            className=""
          >
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
              name="categoryId" // nên là id để dễ xử lý backend
              rules={[
                {
                  required: true,
                  message: "Chọn Loại Sản Phẩm",
                },
              ]}
            >
              <Select
                className="select-input"
                placeholder="Chọn Loại Sản Phẩm"
              >
                {categories.map((category) => (
                  <Select.Option
                    key={category.categoryId} // unique key
                    value={category.categoryId} // backend nhận id
                  >
                    {category.categoryName}
                  </Select.Option>
                ))}
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
            {/* <Form.Item className="label-form" label="Hình Ảnh " name="imgURL">
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
            </Form.Item> */}


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