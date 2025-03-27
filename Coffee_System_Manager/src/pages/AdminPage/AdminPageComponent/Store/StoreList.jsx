import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Upload } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";

const StoreList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUpdate] = useForm();
  const [storeList, setStoreList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [newData, setNewData] = useState({});
  const [img, setImg] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
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

  const handleUpdateOk = () => {
    setIsModalUpdateOpen(false);
  };

  const handleUpdateCancel = () => {
    setIsModalUpdateOpen(false);
    setSelectedStore(null); // Reset selected store khi đóng modal
  };

  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };

  const hanldeClickSubmit = () => {
    form.submit();
    setIsModalOpen(false);
    fetchStore();
  };

  const fetchStore = async () => {
    try {
      const response = await axiosInstance.get('/stores');
      const stores = response.data?.stores;

      if (Array.isArray(stores)) {
        setStoreList(stores);
      } else {
        console.warn('❗ Không nhận được danh sách store hợp lệ:', stores);
        setStoreList([]); // reset danh sách nếu không đúng định dạng
      }
    } catch (error) {
      console.error('❌ Lỗi khi gọi API /store:', error);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const AddStore = async (values) => {
    try {
      const payload = {
        storeId: values.storeId,
        storeName: values.storeName,
        address: values.storeLocation,
      };

      if (!img) {
        toast.error("Vui lòng chọn ảnh trước khi thêm cửa hàng");
        return;
      }

      const imgURL = await uploadFile(img);
      payload.imgURL = imgURL;

      await axiosInstance.post("store", payload);
      toast.success("Thêm máy thành công");

      fetchStore();
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Đã có lỗi khi thêm máy");
      console.log(error);
    }
  };

  const updateStore = async (store) => {
    try {
      const updatedValues = {
        ...newData,
      };
  
      // Xóa storeId khỏi updatedValues nếu tồn tại
      delete updatedValues.storeId;
  
      console.log("PUT store:", store.storeId);
      console.log("Payload gửi đi:", updatedValues);
  
      await axiosInstance.put(`store/${store.storeId}`, updatedValues, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      toast.success("Cập nhật cửa hàng thành công");
  
      setStoreList((prevList) =>
        prevList.map((item) =>
          item.id === store.id ? { ...item, ...updatedValues } : item
        )
      );
  
      setIsModalUpdateOpen(false);
      setSelectedStore(null);
    } catch (error) {
      toast.error("Có lỗi khi cập nhật cửa hàng");
      console.log("Lỗi cập nhật:", error);
    }
  };
  


  const columns = [
    {
      title: 'Mã Cửa Hàng',
      width: 120,
      dataIndex: 'storeId',
      fixed: 'left',
    },
    {
      title: 'Tên Cửa Hàng',
      width: 200,
      dataIndex: 'storeName',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'storeLocation',
      key: '1',
      width: 300,
    },
    {
      title: "Hành Động",
      render: (record) => (
        <Button
          icon={<UploadOutlined />}
          className="admin-upload-button update-button"
          onClick={() => {
            setSelectedStore(record); // Chọn máy hiện tại
            formUpdate.setFieldsValue(record); // Đổ data vào form
            setIsModalUpdateOpen(true); // Mở modal chỉnh sửa
          }}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  const { styles } = useStyle();
  return (
    <div>
      <div className={styles.centeredContainer}>
        <Table
          bordered
          columns={columns}
          dataSource={storeList}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 5 }}
          style={{ width: "90%", maxWidth: "1200px" }}
        />
        <Button type="primary" onClick={showModal}>
          Tạo thông tin cửa hàng mới
        </Button>

        {/* Modal tạo cửa hàng mới */}
        <Modal
          title="Tạo Thông Tin Cửa Hàng"
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
            onFinish={AddStore}
            id="form"
          >
            <Form.Item
              required
              label="Tên Cửa Hàng"
              name="storeName"
              rules={[{ required: true, message: "Hãy nhập tên cửa hàng" }]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Địa Chỉ"
              name="storeLocation"
              rules={[{ required: true, message: "Hãy nhập địa chỉ cửa hàng" }]}
            >
              <Input required />
            </Form.Item>
            <Button onClick={hanldeClickSubmit} className="form-button">
              Thêm Cửa Hàng Mới
            </Button>
          </Form>
        </Modal>

        {/* Modal chỉnh sửa cửa hàng */}
        <Modal
          footer={false}
          title="Chỉnh Sửa Máy"
          open={isModalUpdateOpen}
          onOk={handleUpdateOk}
          onCancel={handleUpdateCancel}
          styles={{
            body: {
              maxHeight: "300px",
              overflowY: "auto",
              paddingRight: "8px",
            },
          }}
        >
          <Form
            initialValues={selectedStore || {}}
            form={formUpdate}
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 20 }}
            style={{ width: "100%" }}
            onValuesChange={(changedValues, allValues) => {
              setNewData({
                ...allValues,
                storeId: selectedStore?.storeId, // Đảm bảo luôn có storeId
              });
            }}
            
            onFinish={() => updateStore(selectedStore)}
          >
            <Form.Item
              label="Tên Cửa Hàng"
              name="storeName"
              rules={[{ required: true, message: "Nhập tên cửa hàng" }]}
            >
              <Input required />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="storeLocation"
              rules={[{ required: true, message: "Nhập địa chỉ cửa hàng" }]}
            >
              <Input required />
            </Form.Item>

            <Button onClick={handleClickUpdateSubmit} className="form-button">
              Cập Nhật Máy
            </Button>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default StoreList;