import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";

const ClassMangement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const useStyle = createStyles(({ css, token }) => {
    const { antCls } = token;
    return {
      customTable: css`
        ${antCls}-table {
          ${antCls}-table-container {
            ${antCls}-table-body,
            ${antCls}-table-content {
              scrollbar-width: thin;
              scrollbar-color: #eaeaea transparent;
              scrollbar-gutter: stable;
            }
          }
        }
      `,
    };
  });

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
      render: () => <a>Thêm</a>,
    },
    {

      width: 90,
      render: () => <a>Xóa</a>,
    },
  ];

  const data = [
    {
      mid: '1',
      name: 'Olivia',
      age: 32,
      address: 'New York Park',
      adate:'01/01/2025',
    },
    {
      mid: '2',
      name: 'Ethan',
      age: 40,
      address: 'London Park',
      adate:'01/01/2025',
    },
  ];
  return (
    <div>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Table
          bordered
          columns={columns}
          dataSource={data}
          scroll={{
            x: 'max-content',
          }}
          pagination={{ pageSize: 5 }}
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
                placeholder="Ngày Sinh"
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
              <Select placeholder="Chọn Sản Phẩm">
                <Option value="SALES">Nhân viên SALES</Option>
                <Option value="DELIVERY">Nhân viên giao hàng</Option>
                <Option value="MANAGER">Quản lý</Option>
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