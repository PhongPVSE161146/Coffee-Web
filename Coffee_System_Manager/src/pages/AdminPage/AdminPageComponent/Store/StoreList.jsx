import React, { useEffect, useState } from "react";
import { Button, Form, Image, Input, Modal, Table, Upload } from "antd";
import { createStyles } from 'antd-style';
import { useForm } from "antd/es/form/Form";
import { axiosInstance } from "../../../../axios/Axios";
import { toast } from "react-toastify";
import { UploadOutlined } from "@ant-design/icons";
import uploadFile from "../../../../utils/uploadFile";

const StoreList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formUpdate] = useForm();
  const [storeList, setStoreList] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [newData, setNewData] = useState("");
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
  };
  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };
  function hanldeClickSubmit() {
    form.submit();
    setIsModalOpen(false);
    // fetchAccount();
  }
  async function fetchStore() {
    try {
      const response = await axiosInstance.get('/store');
      console.log(response);
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
  }
  
  
  


  useEffect(() => {
    fetchStore();
  }, []);

  async function AddStore(values) {
    try {
      console.log("Dữ liệu từ form gửi lên:", values);
      const payload = {
        storeId: values.storeId,
        storeName: values.storeName,
        address: values.address,
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
  }


  async function updateStore(store) {
    try {
      const updatedValues = {
        ...newData,
      };
  
      if (img) {
        const imgURL = await uploadFile(img);
        updatedValues.imgURL = imgURL;
      }
  
      await axiosInstance.put(`store/${store.id}`, updatedValues);
  
      toast.success("Cập nhật máy thành công");
  
      setStoreList((prevList) =>
        prevList.map((item) =>
          item.id === store.id ? { ...item, ...updatedValues } : item
        )
      );
  
      setIsModalUpdateOpen(false); // nên dùng update modal
    } catch (error) {
      toast.error("Có lỗi khi cập nhật máy");
      console.log(error);
    }
  }
  

  async function deleteStore(store) {
    try {
      Modal.confirm({
        title: "Bạn có chắc muốn xóa sản phẩm này?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await axiosInstance.delete(`store/${store.id}`); // API xóa theo ID máy
          toast.success("Xóa sản phẩm thành công");

          // Cập nhật lại state danh sách máy (giả sử state là machineList)
          setStoreList((prev) => prev.filter((item) => item.id !== store.id));

          // Fetch lại danh sách máy (nếu cần)
          fetchStore();
        },
      });
    } catch (error) {
      // toast.error("Đã có lỗi trong lúc xóa máy");
      console.log(error);
    }
  }
  const columns = [
    {
      title: 'Mã Cửa Hàng',
      width: 120,
      dataIndex: 'storeId',
      fixed: 'left',
    },
    {
      title: 'Tên Cửa Hàng',
      width: 130,
      dataIndex: 'storeName',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'storeLocation',
      key: '1',
      width: 100,
    },
    {
      title: "Hành Động",
      render: (record) => {
        return (
          <>
            <div className="action-button">
              {/* Nút Xóa */}
              <Button
                onClick={() => deleteStore(record)}
                className="delete-button"
              >
                Xóa
              </Button>

              {/* Nút Chỉnh sửa */}
              <Button
                icon={<UploadOutlined />}
                className="admin-upload-button update-button"
                onClick={() => {
                  setSelectedStore(record); // Chọn máy hiện tại
                  formUpdate.setFieldsValue(record); // Đổ data vào form
                  setIsModalOpen(true); // Mở modal chỉnh sửa
                }}
              >
                Chỉnh sửa
              </Button>
            </div>

            {/* Modal chỉnh sửa máy */}
            <Modal
              className="modal-add-form"
              footer={false}
              title="Chỉnh Sửa Máy"
              open={isModalUpdateOpen}
              onOk={handleUpdateOk}
              onCancel={handleUpdateCancel}
            >
              <Form
                initialValues={selectedStore}
                form={formUpdate}
                onValuesChange={(changedValues, allValues) => {
                  setNewData(allValues);
                }}
                onFinish={() => {
                  updateStore(selectedStore);
                }}
                id="form-update-machine"
                className="form-main"
              >
                <div className="form-content-main">
                  <div className="form-content">
                    <Form.Item
                      className="label-form"
                      label="Tên Cửa Hàng"
                      name="storeName"
                      rules={[
                        {
                          required: true,
                          message: "Nhập tên cửa hàng",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>
                    <Form.Item
                      className="label-form"
                      label="Địa chỉ"
                      name="storeAddress"
                      rules={[
                        {
                          required: true,
                          message: "Nhập địa chỉ cửa hàng",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>


                  </div>
                </div>

                {/* Nút xác nhận chỉnh sửa */}
                <Button
                  onClick={() => handleClickUpdateSubmit()}
                  className="form-button"
                >
                  Cập Nhật Máy
                </Button>
              </Form>
            </Modal>
          </>
        );
      },
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
          dataSource={storeList}
          scroll={{
            x: 'max-content',
          }}
          pagination={{ pageSize: 5 }}
          style={{ width: "90%", maxWidth: "1200px" }}
        />
        <Button type="primary" onClick={showModal}>
          Tạo thông tin cửa hàng mới
        </Button>
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
            className=""
          >
            <Form.Item
              required
              label="Mã Cửa Hàng"
              name="storeId"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập mã cửa hàng",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Tên Cửa Hàng"
              name="storeName"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập tên cửa hàng",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item
              required
              label="Địa Chỉ"
              name="storeLocation"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập địa chỉ cửa hàng",
                },
              ]}
            >
              <Input required />
            </Form.Item>
            <Form.Item className="label-form" label="Hình Ảnh " name="imgURL">
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
            </Form.Item>
            <Button onClick={hanldeClickSubmit} className="form-button ">
              Thêm Cửa Hàng Mới
            </Button>
          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default StoreList;