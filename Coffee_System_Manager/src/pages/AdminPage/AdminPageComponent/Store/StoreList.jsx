import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";

const StoreList = () => {
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
      title: 'Mã sản phẩm',
      width: 100,
      dataIndex: 'pid',
      fixed: 'left',
    },
    {
      title: 'Tên sản phẩm',
      width: 100,
      dataIndex: 'name',
    },
    {
      title: 'Ngày thêm sản phẩm',
      dataIndex: 'adate',
      key: '1',
      width: 100,
    },
    {
        title: 'Giá sản phẩm',
        width: 100,
        dataIndex: 'price',
      },
    {
      width: 90,
      render: () => <a>Chỉnh sửa</a>,
    },
    {

      width: 90,
      render: () => <a>Xóa</a>,
    },
  ];

  const data = [
    {
      pid: '1',
      name: 'Olivia',
      price: 32,
      address: 'New York Park',
      adate: '01/01/2025',
    },
    {
      pid: '2',
      name: 'Ethan',
      price: 40,
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
            // onFinish={RegisterAccount}
            id="form"
            className=""
          >
            <Form.Item
              required
              label="Mã sản phẩm"
              name="firstname"
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


            <Button onClick={hanldeClickSubmit} className="form-button ">
              Thêm sản phẩm mới
            </Button>
          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default StoreList;