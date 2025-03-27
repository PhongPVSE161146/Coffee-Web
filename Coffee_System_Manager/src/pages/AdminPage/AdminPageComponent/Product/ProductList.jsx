import React, { useEffect, useState } from "react";
import { Button, Col, Form, Image, Input, Modal, Row, Select, Table, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";

const ProductList = () => {
  const [form] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [productList, setProductList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [updateFileList, setUpdateFileList] = useState([]);   

  // Fetch data functions
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("products");
      setProductList(response.data?.products || []);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("categories");
      setCategories(response.data?.categories || []);
    } catch (error) {
      toast.error("Không thể tải danh mục");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Upload handlers
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Chỉ được tải lên file ảnh!');
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  // CRUD operations
  const handleAddProduct = async (values) => {
    try {
      const formData = new FormData();
      formData.append('ProductCode', values.productCode);
      formData.append('ProductName', values.productName);
      formData.append('Price', values.price);
      formData.append('CategoryId', values.categoryId);
      formData.append('Status', 1);
      formData.append('StockQuantity', 100);

      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      const response = await axiosInstance.post("products", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success("Thêm sản phẩm thành công");
      fetchProducts();
      setIsCreateModalOpen(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Thêm sản phẩm thất bại");
    }
  };

  const handleUpdateProduct = async (values) => {
    try {
      const formData = new FormData();

      // 1. Thêm các trường dữ liệu cơ bản
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('productId', selectedProduct.productId);

      // 2. Xử lý ảnh upload - CẢI TIẾN QUAN TRỌNG
      if (updateFileList[0]?.originFileObj) {
        formData.append('image', updateFileList[0].originFileObj);
      } else if (selectedProduct?.path) {
        // Gửi cả path ảnh cũ để backup
        formData.append('existingImagePath', selectedProduct.path);
      }

      // 3. Debug chi tiết
      console.log('--- FormData Content ---');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }

      // 4. Gửi request với timeout dài hơn cho file lớn
      const response = await axiosInstance.put(
        `products/${selectedProduct.productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 giây
        }
      );

      // 5. Kiểm tra phản hồi từ server
      console.log('Server response:', response.data);

      if (response.data.success) {
        toast.success("Cập nhật sản phẩm thành công");
        fetchProducts();
        setSelectedProduct(null);
        formUpdate.resetFields();
        setUpdateFileList([]);
      } else {
        throw new Error(response.data.message || "Cập nhật thất bại");
      }

    } catch (error) {
      console.error("Chi tiết lỗi:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Cập nhật sản phẩm thất bại"
      );
    }
  };

  const handleDeleteProduct = async (product) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa ${product.productName}?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`products/${product.productId}`);
          toast.success("Xóa sản phẩm thành công");
          fetchProducts();
        } catch (error) {
          toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
        }
      },
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
      width: 120,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'path',
      render: (path) => {
        // Xử lý bỏ phần /ProductImages nếu có
        return (
          <Image
            src={path ? `https://coffeeshop.ngrok.app/api/products/image${path}` : 'https://via.placeholder.com/80'}
            width={80}
            height={80}
            style={{ objectFit: 'cover' }}
          />
        );
      },
      width: 120,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryId',
      render: (id) => categories.find(c => c.categoryId === id)?.categoryName || 'Không xác định',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price) => price?.toLocaleString() + 'đ',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => status === 1 ? 'Hoạt động' : 'Ngừng hoạt động',
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => {
            setSelectedProduct(record);
            formUpdate.setFieldsValue(record);
            setUpdateFileList(record.path ? [{
              uid: '-1',
              name: 'current-image',
              status: 'done',
              url: `https://coffeeshop.ngrok.app/api/products/image${record.path}`
            }] : []);
          }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDeleteProduct(record)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>


      <Table
        columns={columns}
        dataSource={productList}
        loading={loading}
        rowKey="productId"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1300 }}
      />
      <Button
        type="primary"
        onClick={() => setIsCreateModalOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm sản phẩm mới
      </Button>
      {/* Create Modal */}
      <Modal
        title="Thêm sản phẩm mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={800}
      >
        <Form form={form} onFinish={handleAddProduct} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productCode"
                label="Mã sản phẩm"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="Tên sản phẩm"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Select style={{ width: '100%' }}>
                  {categories.map(c => (
                    <Select.Option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input type="number" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Hình ảnh sản phẩm" labelCol={{ span: 24 }}>
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={(file) => {
                // Ngăn không cho tự động upload
                return false;
              }}
              onChange={({ fileList: newFileList }) => {
                // Chỉ giữ lại file mới nhất
                setFileList(newFileList.slice(-1));
              }}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length < 1 && '+ Tải lên'}x
            </Upload>
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </Form>
      </Modal>

      {/* Update Modal */}
      <Modal
        title="Chỉnh sửa sản phẩm"
        open={!!selectedProduct}
        onCancel={() => setSelectedProduct(null)}
        footer={null}
        width={800}
      >
        <Form form={formUpdate} onFinish={handleUpdateProduct} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="productCode"
                label="Mã sản phẩm"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="productName"
                label="Tên sản phẩm"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="Danh mục"
                rules={[{ required: true }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Select style={{ width: '100%' }}>
                  {categories.map(c => (
                    <Select.Option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, type: 'number' }]}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input type="number" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Hình ảnh sản phẩm" labelCol={{ span: 24 }}>
            <Upload
              listType="picture-card"
              fileList={updateFileList}
              beforeUpload={(file) => {
                // Ngăn không cho tự động upload
                return false;
              }}
              onChange={({ fileList: newFileList }) => {
                // Chỉ giữ lại file mới nhất
                setUpdateFileList(newFileList.slice(-1));
              }}
              maxCount={1}
              accept="image/*"
            >
              {updateFileList.length < 1 && '+ Tải lên'}
            </Upload>
            {selectedProduct?.path && updateFileList.length === 0 && (() => {
              const cleanPath = selectedProduct.path.replace('/ProductImages', '').replace(/^\/+/, '');
              return (
                <Image
                  src={`https://coffeeshop.ngrok.app/api/products/image/${cleanPath}`}
                  width={100}
                  style={{ marginTop: 10 }}
                  preview={false}
                />
              );
            })()}
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;