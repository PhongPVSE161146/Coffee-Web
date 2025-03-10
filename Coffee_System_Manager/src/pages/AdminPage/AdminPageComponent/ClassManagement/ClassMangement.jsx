import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";

const ClassMangement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  function hanldeClickSubmit() {
    form.submit();
    setIsModalOpen(false);
    // fetchAccount();
  }
  const columns = [
    {
      title: 'Mã máy',
      width: 100,
      dataIndex: 'mid',
      fixed: 'left',
    },
    {
      title: 'Tên máy',
      width: 100,
      dataIndex: 'name',
    },
    {
      title: 'Ngày thêm máy',
      dataIndex: 'adate',
      key: '1',
      width: 100,
    },
    {
      title: 'Sản phẩm',
      width: 90,
      render: () => <a>Xem thêm</a>,
    },
    {
      width: 90,
      render: () => <a>Chỉnh sửa</a>,
    },
    {

      width: 90,
      render: () => <a>Xóa</a>,
    },
    {
      title: 'Trạng thái',
      width: 90,
      render: () => <a>Sửa</a>,
    },
  ];

  const data = [
    {
      mid: '1',
      name: 'Olivia',
      age: 32,
      address: 'New York Park',
      adate: '01/01/2025',
    },
    {
      mid: '2',
      name: 'Ethan',
      age: 40,
      address: 'London Park',
      adate: '01/01/2025',
    },
  ];
  const { styles } = useStyle();
  return (
    <div>
      <div className={styles.centeredContainer}>
        <Table
          bordered
          columns={columns}
          dataSource={data}
          scroll={{
            x: 'max-content',
          }}
          pagination={{ pageSize: 5 }}
          style={{ width: "90%", maxWidth: "1200px" }}
        />
        <Button type="primary" onClick={showModal}>
          Tạo thông tin máy mới
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
            // onFinish={RegisterAccount}
            id="form"
            className=""
          >
            <Form.Item
              required
              label="Mã máy"
              name="firstname"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mã máy",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Tên máy"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên máy",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              name="doa"
              label="Ngày thêm máy"
              rules={[{ required: true, message: "Chọn ngày thêm máy" }]}
            >
              <DatePicker
                placeholder="Ngày Thêm Máy"
                style={{ width: "100%" }}
              // format={dateFormat}
              />
            </Form.Item>
            <Form.Item
              required
              label="Sản phẩm"
              name="mproduct"
              rules={[{ required: true, message: "Thêm sản phẩm của máy" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn Sản Phẩm"
                onChange={(value) => {
                  // Loại bỏ giá trị bị trùng (nếu có)
                  const uniqueValues = [...new Set(value)];
                  form.setFieldsValue({ mproduct: uniqueValues });
                }}
                tagRender={(props) => {
                  const { label, closable, onClose } = props;
                  return (
                    <span
                      style={{
                        fontWeight: "bold", // Làm đậm chữ
                        padding: "4px 8px",
                        borderRadius: "4px",
                        display: "inline-flex",
                        alignItems: "center",
                        margin: "2px",
                        border: "1px solid #d9d9d9", // Giữ viền mặc định của Antd
                        background: "#f5f5f5", // Màu nền nhẹ
                      }}
                    >
                      {label}
                      {closable && (
                        <span
                          onClick={onClose}
                          style={{
                            marginLeft: "8px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          ✖
                        </span>
                      )}
                    </span>
                  );
                }}
              >
                <Option value="SALES">Cappuchino</Option>
                <Option value="DELIVERY">Latte</Option>
                <Option value="MANAGER">Mocha</Option>
              </Select>
            </Form.Item>


            <Button onClick={hanldeClickSubmit} className="form-button ">
              Thêm máy mới
            </Button>
          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default ClassMangement;