import React, { useEffect, useState } from "react";
import { Table, Spin, message, Tag, Button, Modal } from "antd";
import axios from "axios";
import dayjs from "dayjs";

const OrderList = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://coffeeshop.ngrok.app/api/order?sortBy=OrderId&isAscending=true&page=1&pageSize=10"
        );
        const data = response?.data?.orders;
        if (Array.isArray(data)) {
          setOrderList(data);
        } else {
          message.warning("Dữ liệu không đúng định dạng.");
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách đơn hàng.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case 0:
        return <Tag color="blue">Đang xử lý</Tag>;
      case 1:
        return <Tag color="green">Hoàn thành</Tag>;
      case 2:
        return <Tag color="red">Đã hủy</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setDetailLoading(true);
    setSelectedOrderId(orderId);
    try {
      const response = await axios.get(
        `https://coffeeshop.ngrok.app/api/order/${orderId}/detail`
      );
      setOrderDetails(response.data); // Giả sử API trả về danh sách orderDetail
      setModalVisible(true);
    } catch (error) {
      message.error("Không thể lấy chi tiết đơn hàng.");
      console.error(error);
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      sorter: (a, b) => a.orderId - b.orderId,
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    // {
    //   title: "Mô tả",
    //   dataIndex: "orderDescription",
    //   key: "orderDescription",
    // },
    // {
    //   title: "Tổng tiền",
    //   dataIndex: "totalAmount",
    //   key: "totalAmount",
    //   sorter: (a, b) => a.totalAmount - b.totalAmount,
    //   render: (text) => `${text.toLocaleString()} VND`,
    // },
    {
      title: "Mã khách hàng",
      dataIndex: "customerId",
      key: "customerId",
    },
    // {
    //   title: "Mã máy",
    //   dataIndex: "machineId",
    //   key: "machineId",
    // },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => getStatusTag(status),
    //   sorter: (a, b) => a.status - b.status,
    // },
    {
      title: "Thao tác",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => fetchOrderDetails(record.orderId)}
          loading={detailLoading && selectedOrderId === record.orderId}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const detailColumns = [
    // {
    //   title: "Mã chi tiết",
    //   dataIndex: "orderDetailId",
    //   key: "orderDetailId",
    // },
    // {
    //   title: "Mã sản phẩm",
    //   dataIndex: "productId",
    //   key: "productId",
    // },
      // {
    //   title: "Số lượng",
    //   dataIndex: "quantity",
    //   key: "quantity",
    // },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product",
    },
    
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text.toLocaleString()} VND`,
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => getStatusTag(status),
    // },
  ];

  return (
    <div style={{ padding: 20 }}>
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : (
        <Table
          bordered
          columns={columns}
          dataSource={orderList}
          rowKey="orderId"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrderId}`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {detailLoading ? (
          <Spin tip="Đang tải chi tiết..." />
        ) : (
          <Table
            bordered
            columns={detailColumns}
            dataSource={orderDetails}
            rowKey="orderDetailId"
            pagination={false}
          />
        )}
      </Modal>
    </div>
  );
};

export default OrderList;
// {
    //   title: "Hành Động",
    //   render: (record) => {
    //     return (
    //       <>
    //         <div className="action-button">
    //           {/* Nút Xóa */}
    //           <Button
    //             onClick={() => deleteOrder(record)}
    //             className="delete-button"
    //           >
    //             Xóa
    //           </Button>

    //           {/* Nút Chỉnh sửa */}
    //           <Button
    //             icon={<UploadOutlined />}
    //             className="admin-upload-button update-button"
    //             onClick={() => {
    //               setSelectedOrder(record); // Chọn máy hiện tại
    //               formUpdate.setFieldsValue(record); // Đổ data vào form
    //               setIsModalOpen(true); // Mở modal chỉnh sửa
    //             }}
    //           >
    //             Chỉnh sửa
    //           </Button>
    //         </div>

    //         {/* Modal chỉnh sửa máy */}
    //         <Modal
    //           title="Chỉnh sửa sản phẩm"
    //           open={isModalUpdateOpen}
    //           onOk={handleUpdateOk}
    //           onCancel={handleUpdateCancel}
    //           footer={null}
    //         >
    //           <Form
    //             layout="horizontal"
    //             labelCol={{ span: 7 }}
    //             wrapperCol={{ span: 20 }}
    //             style={{ width: "100%" }}
    //             form={form}
    //             // onFinish={RegisterAccount}
    //             id="form"
    //             className=""
    //           >
    //             <Form.Item
    //               required
    //               label="Mã sản phẩm"
    //               name="productId"
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: "Hãy nhập mã sản phẩm",
    //                 },
    //               ]}
    //             >
    //               <Input required />
    //             </Form.Item>
    //             <Form.Item
    //               required
    //               label="Tên sản phẩm"
    //               name="productName"
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: "Hãy nhập tên sản phẩm",
    //                 },
    //               ]}
    //             >
    //               <Input required />
    //             </Form.Item>
    //             <Form.Item
    //               className="label-form"
    //               label="Loại Sản Phẩm"
    //               name="type"
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: "Chọn Loại Sản Phẩm",
    //                 },
    //               ]}
    //             >
    //               <Select
    //                 className="select-input"
    //                 placeholder="chọn Loại Sản Phẩm"
    //               >
    //                 <Select.Option value="ROUND">Cappuchino</Select.Option>
    //                 <Select.Option value="OVAL">Mocha</Select.Option>
    //                 <Select.Option value="CUSHION">Latte</Select.Option>
    //                 <Select.Option value="PEAR">Americano</Select.Option>
    //               </Select>
    //             </Form.Item>
    //             <Form.Item
    //               name="doap"
    //               label="Ngày thêm sản phẩm"
    //               rules={[{ required: true, message: "Chọn ngày thêm sản phẩm" }]}
    //             >
    //               <DatePicker
    //                 placeholder="Ngày Thêm Sản Phẩm"
    //                 style={{ width: "100%" }}
    //               // format={dateFormat}
    //               />
    //             </Form.Item>
    //             <Form.Item
    //               required
    //               label="Giá sản phẩm"
    //               name="price"
    //               rules={[
    //                 {
    //                   required: true,
    //                   message: "Hãy nhập giá tiền",
    //                 },
    //               ]}
    //             >
    //               <Input required />
    //             </Form.Item>
    //             <Button onClick={handleClickUpdateSubmit} className="form-button ">
    //               Cập Nhật Sản Phẩm
    //             </Button>
    //           </Form>
    //         </Modal>
    //       </>
    //     );
    //   },
    // },