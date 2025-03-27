import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../axios/Axios";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const MachineManagement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [machineList, setMachineList] = useState([]);
  const [machineType, setMachineType] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [productList, setProductList] = useState([]);
  const [form] = useForm();
  const [formUpdate] = useForm();

  const useStyle = createStyles(({ css }) => ({
    centeredContainer: css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 85vw;
      flex-direction: column;
    `,
  }));

  // Fetch data functions
  const fetchMachines = async () => {
    try {
      const response = await axiosInstance.get("machines");
      const data = response?.data?.machines?.map(item => ({
        ...item,
        key: item.machineId
      }));
      setMachineList(data || []);
    } catch (error) {
      console.error("Lỗi fetch machines:", error);
      setMachineList([]);
    }
  };
  const fetchMachineTypes = async () => {
    try {
      const response = await axiosInstance.get("machine_types");
      const data = response?.data?.machineTypes?.map(item => ({
        ...item,
        key: item.machineTypeId
      }));
      setMachineType(data || []);
    } catch (error) {
      console.error("Lỗi fetch machines:", error);
      setMachineType([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(
        "products?sortBy=ProductId&isAscending=true&page=1&pageSize=1000"
      );
      setProductList(response?.data?.products || []);
    } catch (error) {
      console.error("Lỗi fetch products:", error);
      setProductList([]);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await axiosInstance.get('/stores');
      setStoreList(response.data?.stores || []);
    } catch (error) {
      console.error('Lỗi fetch stores:', error);
    }
  };

  useEffect(() => {
    fetchMachines();
    fetchMachineTypes();
    fetchProducts();
    fetchStores();
  }, []);

  // Modal handlers
  const showCreateModal = () => setIsCreateModalOpen(true);
  const handleCreateCancel = () => setIsCreateModalOpen(false);

  const showUpdateModal = () => setIsUpdateModalOpen(true);
  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
    setSelectedMachine(null);
  };

  // Form handlers
  const handleAddMachine = async (values) => {
    try {
      const payload = {
        ...values,
        installationDate: values.installationDate.format("YYYY-MM-DD"),
        status: 1,
        machineTypeId: values.machineTypeId,
        machineProducts: values.machineProducts?.map(id => ({ productId: id })) || []
      };

      await axiosInstance.post("machines", payload);
      toast.success("Thêm máy thành công!");
      fetchMachines();
      form.resetFields();
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error("Đã có lỗi khi thêm máy!");
      console.error("Lỗi:", error);
    }
  };

  const handleUpdateMachine = async (values) => {
    try {
      const payload = {
        ...values,
        machineId: selectedMachine.machineId, // Thêm machineId vào payload
        machineTypeId: 1,
        installationDate: values.installationDate.format("YYYY-MM-DD"),
        machineProducts: values.machineProducts?.map(id => ({ productId: id })) || []
      };

      await axiosInstance.put(`machines/${selectedMachine.machineId}`, payload);
      toast.success("Cập nhật thành công");
      fetchMachines();
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Lỗi khi cập nhật");
      console.error(error);
    }
  };

  const handleDeleteMachine = async (machine) => {
    Modal.confirm({
      title: "Xác nhận xóa máy",
      content: "Bạn có chắc muốn xóa máy này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`machines/${machine.machineId}`);
          toast.success("Xóa máy thành công");
          fetchMachines();
        } catch (error) {
          toast.error("Lỗi khi xóa máy");
          console.error(error);
        }
      }
    });
  };

  const handleViewProducts = (products) => {
    if (!products || products.length === 0) {
      Modal.info({
        title: 'Thông báo',
        content: 'Không có sản phẩm nào.',
        okText: 'Đóng',
      });
      return;
    }

    const productNames = products.map(p => typeof p === 'object' ? p.productName : p).join(', ');
    Modal.info({
      title: 'Danh sách sản phẩm',
      content: `Các sản phẩm: ${productNames}`,
      okText: 'Đóng',
    });
  };

  const columns = [
    {
      title: 'Mã máy',
      dataIndex: 'machineCode',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Loại máy',
      dataIndex: 'machineTypeId',
      width: 150,
      render: (machineTypeId) => machineType.find(t => t.machineTypeId === machineTypeId)?.typeName || 'Không xác định'
    },
    {
      title: 'Tên máy',
      dataIndex: 'machineName',
      width: 150,
    },
    {
      title: 'Ngày thêm máy',
      dataIndex: 'installationDate',
      width: 150,
    },
    {
      title: 'Cửa hàng',
      width: 150,
      render: (_, record) => {
        // Tìm store tương ứng với storeId của máy
        const store = storeList.find(store => store.storeId === record.storeId);
        return store ? store.storeName : 'Không xác định';
      },
    },
    {
      title: 'Sản phẩm',
      width: 110,
      render: (_, record) => (
        <a onClick={() => handleViewProducts(record.machineProducts)}>Xem thêm</a>
      ),
    },
    {
      title: "Hành động",
      width: 150,
      render: (_, record) => (
        <div className="action-button">
          <Button danger onClick={() => handleDeleteMachine(record)}>
            Xóa
          </Button>
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => {
              setSelectedMachine(record);
              formUpdate.setFieldsValue({
                ...record,
                installationDate: record.installationDate ? dayjs(record.installationDate) : null,
                machineProducts: record.machineProducts?.map(p => p.productId) || []
              });
              showUpdateModal();
            }}
          >
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  const { styles } = useStyle();

  return (
    <div className={styles.centeredContainer}>
      <Table
        bordered
        columns={columns}
        dataSource={machineList}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 5 }}
        style={{ width: "90%", maxWidth: "1200px" }}
      />

      <Button type="primary" onClick={showCreateModal}>
        Tạo thông tin máy mới
      </Button>

      {/* Create Machine Modal */}
      <Modal
        title="Thêm Máy Mới"
        open={isCreateModalOpen}
        onCancel={handleCreateCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleAddMachine}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item name="machineCode" label="Mã máy">
            <Input placeholder="Nhập mã máy (nếu có)" />
          </Form.Item>
          <Form.Item
            name="machineTypeId"
            label="Loại máy"
            rules={[{ required: true, message: "Vui lòng chọn loại máy!" }]}
          >
            <Select placeholder="Chọn loại máy">
              {machineType.map(type => (
                <Select.Option key={type.machineTypeId} value={type.machineTypeId}>
                  {type.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="machineName"
            label="Tên máy"
            rules={[{ required: true, message: "Vui lòng nhập tên máy!" }]}
          >
            <Input placeholder="Nhập tên máy" />
          </Form.Item>

          <Form.Item
            name="storeId"
            label="Cửa hàng"
            rules={[{ required: true, message: "Vui lòng chọn cửa hàng!" }]}
          >
            <Select placeholder="Chọn cửa hàng">
              {storeList.map(store => (
                <Select.Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="installationDate"
            label="Ngày lắp đặt"
            rules={[{ required: true, message: "Vui lòng chọn ngày lắp đặt!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="machineProducts"
            label="Sản phẩm"
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
            >
              {productList.map(product => (
                <Select.Option key={product.productId} value={product.productId}>
                  {product.productName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm máy
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Machine Modal */}
      <Modal
        className="modal-update-form"
        footer={false}
        title="Chỉnh Sửa Máy"
        open={isUpdateModalOpen}
        onCancel={handleUpdateCancel}
      >
        <Form
          initialValues={{
            ...selectedMachine,
            installationDate: selectedMachine?.installationDate
              ? dayjs(selectedMachine.installationDate)
              : null,
            machineProducts: selectedMachine?.machineProducts?.map(p => p.productId) || [],
            storeId: selectedMachine?.storeId // Thêm trường storeId
          }}
          form={formUpdate}
          onFinish={handleUpdateMachine}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
        >
          <Form.Item
            name="machineCode"
            label="Mã máy"
          >
            <Input placeholder="Nhập mã máy (nếu có)" />
          </Form.Item>

          <Form.Item
            name="machineName"
            label="Tên máy"
            rules={[{ required: true, message: "Vui lòng nhập tên máy!" }]}
          >
            <Input placeholder="Nhập tên máy" />
          </Form.Item>
          <Form.Item
            name="machineTypeId"
            label="Loại máy"
            rules={[{ required: true, message: "Vui lòng chọn loại máy!" }]}
          >
            <Select placeholder="Chọn loại máy">
              {machineType.map(type => (
                <Select.Option key={type.machineTypeId} value={type.machineTypeId}>
                  {type.typeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="storeId"
            label="Cửa hàng"
            rules={[{ required: true, message: "Vui lòng chọn cửa hàng!" }]}
          >
            <Select placeholder="Chọn cửa hàng">
              {storeList.map((store) => (
                <Select.Option key={store.storeId} value={store.storeId}>
                  {store.storeName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="installationDate"
            label="Ngày lắp đặt"
            rules={[{ required: true, message: "Vui lòng chọn ngày lắp đặt!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="machineProducts"
            label="Sản phẩm"
            rules={[{ required: false, message: "Vui lòng chọn sản phẩm!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn sản phẩm"
            >
              {productList.map(product => (
                <Select.Option key={product.productId} value={product.productId}>
                  {product.productName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MachineManagement;