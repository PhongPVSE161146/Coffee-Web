import React, { useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../axios/Axios";
import { UploadOutlined } from "@ant-design/icons";

const ClassMangement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [machineList, setMachineList] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [form] = useForm();
  const [formUpdate] = useForm();
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

  async function fetchMachines() {
    const response = await axiosInstance.get("Machine");
    setMachineList(response.data);
  }
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
  function hanldeClickSubmit() {
    form.submit();
    setIsModalOpen(false);
    fetchMachines();
  }
  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
  };
  

  async function updateMachine(machine) {
    try {
      const updatedValues = {
        ...newData,
      };

      await axiosInstance.put(`machine/${machine.id}`, updatedValues);

      toast.success("Cập nhật máy thành công");

      // Cập nhật danh sách máy hiện tại
      setMachineList((prevList) =>
        prevList.map((item) =>
          item.id === machine.id ? { ...item, ...updatedValues } : item
        )
      );

      // Đóng modal sau khi cập nhật thành công
      setIsModalOpen(false);

      // Nếu cần, fetch lại data chính xác từ server
      fetchMachines();
    } catch (error) {
      toast.error("Có lỗi khi cập nhật máy");
      console.log(error);
    }
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
      title: "Hành Động",
      render: (record) => {
        return (
          <>
            <div className="action-button">
              {/* Nút Xóa */}
              <Button
                onClick={() => deleteMachine(record)}
                className="delete-button"
              >
                Xóa
              </Button>

              {/* Nút Chỉnh sửa */}
              <Button
                icon={<UploadOutlined />}
                className="admin-upload-button update-button"
                onClick={() => {
                  setSelectedMachine(record); // Chọn máy hiện tại
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
                initialValues={selectedMachine}
                form={formUpdate}
                onValuesChange={(changedValues, allValues) => {
                  setNewData(allValues);
                }}
                onFinish={() => {
                  updateMachine(selectedMachine);
                }}
                id="form-update-machine"
                className="form-main"
              >
                <div className="form-content-main">
                  <div className="form-content">

                    {/* Mã máy */}
                    <Form.Item
                      className="label-form"
                      label="Mã Máy"
                      name="firstname"
                      rules={[
                        {
                          required: true,
                          message: "Nhập mã máy",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>

                    {/* Tên máy */}
                    <Form.Item
                      className="label-form"
                      label="Tên Máy"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Nhập tên máy",
                        },
                      ]}
                    >
                      <Input type="text" required />
                    </Form.Item>

                    {/* Ngày thêm máy */}
                    <Form.Item
                      className="label-form"
                      label="Ngày Thêm Máy"
                      name="doa"
                      rules={[
                        {
                          required: true,
                          message: "Chọn ngày thêm máy",
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Ngày Thêm Máy"
                      />
                    </Form.Item>

                    {/* Sản phẩm */}
                    <Form.Item
                      className="label-form"
                      label="Sản phẩm"
                      name="mproduct"
                      rules={[
                        {
                          required: true,
                          message: "Thêm sản phẩm của máy",
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn Sản Phẩm"
                        onChange={(value) => {
                          const uniqueValues = [...new Set(value)];
                          formUpdate.setFieldsValue({ mproduct: uniqueValues });
                        }}
                        tagRender={(props) => {
                          const { label, closable, onClose } = props;
                          return (
                            <span
                              style={{
                                fontWeight: "bold",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                display: "inline-flex",
                                alignItems: "center",
                                margin: "2px",
                                border: "1px solid #d9d9d9",
                                background: "#f5f5f5",
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
                        <Select.Option value="SALES">Cappuchino</Select.Option>
                        <Select.Option value="DELIVERY">Latte</Select.Option>
                        <Select.Option value="MANAGER">Mocha</Select.Option>
                      </Select>
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

  async function AddMachine(values) {
    try {
      // Xử lý dữ liệu từ form (values)
      const payload = {
        code: values.firstname, // Mã máy
        name: values.name,      // Tên máy
        doa: values.doa.format("YYYY-MM-DD"), // Ngày thêm máy (format lại ngày tháng)
        mproduct: values.mproduct, // Sản phẩm (danh sách sản phẩm đã chọn)
      };

      // Nếu có hình ảnh thì bạn có thể thêm bước upload ảnh ở đây (giống AddDiamond)
      // const imgURL = await uploadFile(img);
      // payload.imgURL = imgURL;

      // Gửi dữ liệu lên API
      await axiosInstance.post("machine", payload);

      // Xử lý sau khi thêm thành công
      toast.success("Thêm máy thành công");

      // Fetch lại danh sách máy (nếu cần)
      // fetchMachines(); // <--- hàm fetch dữ liệu danh sách máy (nếu có)

      // Reset form và đóng modal
      form.resetFields();
      setIsModalOpen(false); // Đóng modal tạo máy
    } catch (error) {
      toast.error("Đã có lỗi khi thêm máy");
      console.log(error);
    }
  }
  async function deleteMachine(machine) {
    try {
      Modal.confirm({
        title: "Bạn có chắc muốn xóa máy này?",
        okText: "Đồng ý",
        cancelText: "Hủy",
        onOk: async () => {
          await axiosInstance.delete(`Machine/${machine.id}`); // API xóa theo ID máy
          toast.success("Xóa máy thành công");

          // Cập nhật lại state danh sách máy (giả sử state là machineList)
          setMachineList((prev) => prev.filter((item) => item.id !== machine.id));

          // Fetch lại danh sách máy (nếu cần)
          fetchMachines();
        },
      });
    } catch (error) {
      // toast.error("Đã có lỗi trong lúc xóa máy");
      console.log(error);
    }
  }

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
            onFinish={AddMachine}
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


            <Button htmlType="submit" className="form-button">
              Thêm máy mới
            </Button>

          </Form>
        </Modal>
      </div>
    </div>

  );
};

export default ClassMangement;