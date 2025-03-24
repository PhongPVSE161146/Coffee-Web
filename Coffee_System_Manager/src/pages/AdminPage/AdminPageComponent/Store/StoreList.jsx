import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Table, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined, SearchOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";

const StoreList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const [formUpdate] = useForm();
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newData, setNewData] = useState({});
  const [img, setImg] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    fetchStore();
  }, []);

  useEffect(() => {
    setFilteredList(storeList);
  }, [storeList]);

  async function fetchStore() {
    try {
      const response = await axiosInstance.get("store");
      const data = response?.data?.stores || [];
      setStoreList(data);
    } catch (error) {
      console.error("Lỗi fetch store:", error);
      setStoreList([]);
    }
  }

  const handleSearch = (value) => {
    setSearchText(value);
    const lowerValue = value.toLowerCase();
    
    const filteredData = storeList.filter((store) =>
      (store.storeName && store.storeName.toLowerCase().includes(lowerValue)) ||
      (store.storeId && String(store.storeId).toLowerCase().includes(lowerValue)) ||
      (store.storeLocation && store.storeLocation.toLowerCase().includes(lowerValue))
    );

    setFilteredList(filteredData);
  };

  async function AddStore(values) {
    try {
      const payload = {
        storeId: values.storeId,
        storeName: values.storeName,
        storeLocation: values.storeLocation,
      };

      if (!img) {
        toast.error("Vui lòng chọn ảnh trước khi thêm cửa hàng");
        return;
      }

      payload.imgURL = await uploadFile(img);

      await axiosInstance.post("store", payload);
      toast.success("Thêm cửa hàng thành công");

      fetchStore();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Đã có lỗi khi thêm cửa hàng");
      console.log(error);
    }
  }

  async function updateStore(store) {
    try {
      const updatedValues = { ...newData };

      if (img) {
        updatedValues.imgURL = await uploadFile(img);
      }

      await axiosInstance.put(`store/${store.id}`, updatedValues);
      toast.success("Cập nhật cửa hàng thành công");

      setStoreList((prevList) =>
        prevList.map((item) =>
          item.id === store.id ? { ...item, ...updatedValues } : item
        )
      );

      setIsModalUpdateOpen(false);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật cửa hàng");
      console.log(error);
    }
  }

  async function deleteStore(store) {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa cửa hàng này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await axiosInstance.delete(`store/${store.id}`);
          toast.success("Xóa cửa hàng thành công");
          fetchStore();
        } catch (error) {
          toast.error("Đã có lỗi khi xóa cửa hàng");
          console.log(error);
        }
      },
    });
  }

  const columns = [
    {
      title: "Mã Cửa Hàng",
      dataIndex: "storeId",
      sorter: (a, b) => String(a.storeId).localeCompare(String(b.storeId)),
    },
    {
      title: "Tên Cửa Hàng",
      dataIndex: "storeName",
      sorter: (a, b) => a.storeName.localeCompare(b.storeName),
    },
    {
      title: "Địa Chỉ",
      dataIndex: "storeLocation",
    },
    {
      title: "Hình Ảnh",
      dataIndex: "imgURL",
      key: "imgURL",
      render: (value) => <Image src={value} style={{ width: 80 }} />,
    },
    {
      title: "Hành Động",
      render: (record) => (
        <>
          <Button onClick={() => deleteStore(record)} className="delete-button">
            Xóa
          </Button>
          <Button
            icon={<UploadOutlined />}
            className="admin-upload-button update-button"
            onClick={() => {
              setSelectedStore(record);
              formUpdate.setFieldsValue(record);
              setIsModalUpdateOpen(true);
            }}
          >
            Chỉnh sửa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div 
        style={{
          position: "sticky",
          top: "60px",
          zIndex: 998,
          backgroundColor: "white",
          padding: "10px 0",
          width: "100%",
          textAlign: "center",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <Input
          placeholder="Tìm kiếm theo mã hoặc tên cửa hàng..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: "50%", minWidth: "300px", marginBottom: 16 }}
        />
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={filteredList.length > 0 ? filteredList : storeList}
        pagination={{ pageSize: 5 }}
      />

      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Tạo thông tin cửa hàng mới
      </Button>

      <Modal title="Tạo Thông Tin Cửa Hàng" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <Form layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 20 }} form={form} onFinish={AddStore}>
          <Form.Item label="Mã Cửa Hàng" name="storeId" rules={[{ required: true, message: "Nhập mã cửa hàng" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên Cửa Hàng" name="storeName" rules={[{ required: true, message: "Nhập tên cửa hàng" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa Chỉ" name="storeLocation" rules={[{ required: true, message: "Nhập địa chỉ cửa hàng" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Hình Ảnh" name="imgURL">
            <Upload beforeUpload={(file) => { setImg(file); return false; }} onRemove={() => setImg(null)}>
              <Button icon={<UploadOutlined />}>Tải Hình Ảnh</Button>
            </Upload>
          </Form.Item>
          <Button htmlType="submit">Thêm Cửa Hàng</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default StoreList;
