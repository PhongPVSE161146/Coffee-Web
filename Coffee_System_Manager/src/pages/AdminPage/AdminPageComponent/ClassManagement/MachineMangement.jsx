import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Table } from "antd";
import { createStyles } from 'antd-style';
import { Option } from "antd/es/mentions";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../axios/Axios";
import { UploadOutlined } from "@ant-design/icons";

const MachineMangement = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newData, setNewData] = useState("");
  const [machineList, setMachineList] = useState("");
  const [selectedMachine, setSelectedMachine] = useState("");
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

  async function fetchMachines() {
      try {
        const response = await axiosInstance.get(
          "machines"
        );
  console.log(response);
  
        const data = response?.data?.machines;
  
        if (Array.isArray(data)) {
          setMachineList(data);
        } else {
          console.warn("Dữ liệu không đúng dạng mảng:", data);
          setMachineList([]);
        }
  
      } catch (error) {
        console.error("Lỗi fetch store:", error);
        setMachineList([]);
      }
    }
useEffect(() => {
    fetchMachines();
    // fetchCategory();
  }, []);
  const showCreateModal = () => setIsCreateModalOpen(true);
  const handleCreateCancel = () => setIsCreateModalOpen(false);
  const handleCreateOk = () => setIsCreateModalOpen(false);

  const showUpdateModal = () => setIsUpdateModalOpen(true);
  const handleUpdateCancel = () => setIsUpdateModalOpen(false);
  const handleUpdateOk = () => setIsUpdateModalOpen(false);

  function handleClickCreateSubmit() {
    form.submit();
    setIsCreateModalOpen(false);
    fetchMachines();
  }

  const handleClickUpdateSubmit = () => {
    formUpdate.submit();
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
  
    const productList = products.join(', ');
  
    Modal.info({
      title: 'Danh sách sản phẩm',
      content: `Các sản phẩm: ${productList}`,
      okText: 'Đóng',
    });
  };
  
  async function updateMachine(machine) {
    try {
      const updatedValues = { ...newData };

      await axiosInstance.put(`machines/${machine.id}`, updatedValues);

      toast.success("Cập nhật máy thành công");

      setMachineList((prevList) =>
        prevList.map((item) =>
          item.id === machine.id ? { ...item, ...updatedValues } : item
        )
      );

      setIsUpdateModalOpen(false);
      fetchMachines();
    } catch (error) {
      toast.error("Có lỗi khi cập nhật máy");
      console.log(error);
    }
  }

  const data = [
    {
      id: 1,
      mid: 'M001',
      name: 'Máy Pha Cà Phê Espresso',
      installationDate: '2025-01-01',
      mproduct: ['Cappuchino', 'Latte'],
    },
    {
      id: 2,
      mid: 'M002',
      name: 'Máy Xay Sinh Tố Công Nghiệp',
      installationDate: '2025-02-15',
      mproduct: ['Mocha'],
    },
    {
      id: 3,
      mid: 'M003',
      name: 'Máy Đun Nước Tự Động',
      installationDate: '2025-03-10',
      mproduct: ['Cappuchino', 'Latte', 'Mocha'],
    },
  ];
  
  const columns = [
    {
      title: 'Mã máy',
      width: 100,
      dataIndex: 'machineCode',
      fixed: 'left',
    },
    {
      title: 'Tên máy',
      width: 150,
      dataIndex: 'machineName',
    },
    {
      title: 'Ngày thêm máy',
      dataIndex: 'installationDate',
      key: '1',
      width: 150,
    },
    {
      title: 'Sản phẩm',
      width: 110,
      render: (record) => (
        <a onClick={() => handleViewProducts(record.machineProducts)}>Xem thêm</a>
      ),
    },
    {
      title: "Hành Động",
      width: 110,
      render: (record) => {
        return (
          <>
            <div className="action-button">
              <Button
                onClick={() => deleteMachine(record)}
                className="delete-button"
              >
                Xóa
              </Button>

              <Button
                icon={<UploadOutlined />}
                className="admin-upload-button update-button"
                onClick={() => {
                  setSelectedMachine(record);
                  formUpdate.setFieldsValue(record);
                  showUpdateModal(); // mở modal update đúng cách
                }}
              >
                Chỉnh sửa
              </Button>
            </div>

            {/* Modal chỉnh sửa */}
            <Modal
              className="modal-add-form"
              footer={false}
              title="Chỉnh Sửa Máy"
              open={isUpdateModalOpen}
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
                    <Form.Item
                      className="label-form"
                      label="Mã Máy"
                      name="firstname"
                      rules={[{ required: true, message: "Nhập mã máy" }]}
                    >
                      <Input type="text" required />
                    </Form.Item>

                    <Form.Item
                      className="label-form"
                      label="Tên Máy"
                      name="name"
                      rules={[{ required: true, message: "Nhập tên máy" }]}
                    >
                      <Input type="text" required />
                    </Form.Item>

                    <Form.Item
                      className="label-form"
                      label="Ngày Thêm Máy"
                      name="doa"
                      rules={[{ required: true, message: "Chọn ngày thêm máy" }]}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        placeholder="Ngày Thêm Máy"
                      />
                    </Form.Item>

                    <Form.Item
                      className="label-form"
                      label="Sản phẩm"
                      name="mproduct"
                      rules={[{ required: true, message: "Thêm sản phẩm của máy" }]}
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

                <Button onClick={handleClickUpdateSubmit} className="form-button">
                  Cập Nhật Máy
                </Button>
              </Form>
            </Modal>
          </>
        );
      },
    },
  ];

  const { styles } = useStyle();

  async function AddMachine(values) {
    try {
      const payload = {
        code: values.firstname,
        name: values.name,
        doa: values.doa.format("YYYY-MM-DD"),
        mproduct: values.mproduct,
      };

      await axiosInstance.post("machine", payload);

      toast.success("Thêm máy thành công");

      fetchMachines();
      form.resetFields();
      setIsCreateModalOpen(false);
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
          await axiosInstance.delete(`machines/${machine.id}`);
          toast.success("Xóa máy thành công");

          setMachineList((prev) => prev.filter((item) => item.id !== machine.id));
          fetchMachines();
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div className={styles.centeredContainer}>
        <Table
          bordered
          columns={columns}
          dataSource={machineList}
          onViewProducts={handleViewProducts}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 5 }}
          style={{ width: "90%", maxWidth: "1200px" }}
        />
        <Button type="primary" onClick={showCreateModal}>
          Tạo thông tin máy mới
        </Button>
        <Modal
          title="Tạo máy"
          open={isCreateModalOpen}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
          footer={null}
        >
          <Form
            layout="horizontal"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 20 }}
            style={{ width: "100%" }}
            form={form}
            onFinish={AddMachine}
          >
            <Form.Item
              label="Mã máy"
              name="firstname"
              rules={[{ required: true, message: "Hãy nhập mã máy" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tên máy"
              name="name"
              rules={[{ required: true, message: "Hãy nhập tên máy" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="doa"
              label="Ngày thêm máy"
              rules={[{ required: true, message: "Chọn ngày thêm máy" }]}
            >
              <DatePicker style={{ width: "100%" }} placeholder="Ngày Thêm Máy" />
            </Form.Item>

            <Form.Item
              label="Sản phẩm"
              name="mproduct"
              rules={[{ required: true, message: "Thêm sản phẩm của máy" }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn Sản Phẩm"
                onChange={(value) => {
                  const uniqueValues = [...new Set(value)];
                  form.setFieldsValue({ mproduct: uniqueValues });
                }}
              >
                <Option value="CAPPUCHINO">Cappuchino</Option>
                <Option value="LATTE">Latte</Option>
                <Option value="MOCHA">Mocha</Option>
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

export default MachineMangement;