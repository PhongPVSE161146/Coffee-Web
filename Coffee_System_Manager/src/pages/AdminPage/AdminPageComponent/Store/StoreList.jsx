import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Upload } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";

const StoreList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUpdate] = useForm();
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newData, setNewData] = useState(null);
  const [img, setImg] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [form] = useForm();

  async function fetchStore() {
    try {
      const response = await axiosInstance.get("store");
      const data = response?.data?.stores;
      setStoreList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi fetch store:", error);
      setStoreList([]);
    }
  }

  useEffect(() => {
    fetchStore();
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredData = storeList.filter((store) =>
    store.storeName.toLowerCase().includes(searchText.toLowerCase())
  );

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
      title: "Hành Động",
      render: (record) => (
        <>
          <Button onClick={() => deleteStore(record)}>Xóa</Button>
          <Button onClick={() => {
            setSelectedStore(record);
            formUpdate.setFieldsValue(record);
            setIsModalUpdateOpen(true);
          }}>Chỉnh sửa</Button>
        </>
      ),
    },
  ];

  async function deleteStore(store) {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa cửa hàng này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        await axiosInstance.delete(`Store/${store.id}`);
        toast.success("Xóa cửa hàng thành công");
        fetchStore();
      },
    });
  }

  async function AddStore(values) {
    try {
      const payload = { ...values };
      if (img) {
        const imgURL = await uploadFile(img);
        payload.imgURL = imgURL;
      }
      await axiosInstance.post("store", payload);
      toast.success("Thêm cửa hàng thành công");
      fetchStore();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
    }
  }

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Input
        placeholder="Tìm kiếm cửa hàng..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Table bordered columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} style={{ width: "90%", maxWidth: "1200px" }} />
      <Button type="primary" onClick={() => setIsModalOpen(true)}>Thêm Cửa Hàng</Button>
      <Modal title="Tạo Cửa Hàng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form form={form} onFinish={AddStore}>
          <Form.Item label="Mã Cửa Hàng" name="storeId" rules={[{ required: true, message: "Nhập mã cửa hàng" }]}> <Input /> </Form.Item>
          <Form.Item label="Tên Cửa Hàng" name="storeName" rules={[{ required: true, message: "Nhập tên cửa hàng" }]}> <Input /> </Form.Item>
          <Form.Item label="Địa Chỉ" name="storeLocation" rules={[{ required: true, message: "Nhập địa chỉ" }]}> <Input /> </Form.Item>
          <Form.Item label="Hình Ảnh" name="imgURL"> <Upload beforeUpload={(file) => { setImg(file); return false; }} onRemove={() => setImg(null)}> <Button icon={<UploadOutlined />}>Tải Hình Ảnh</Button> </Upload> </Form.Item>
          <Button htmlType="submit">Thêm Cửa Hàng</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreList;